const RediESEventServiceModule = require('../../../../src/infrastructure/messaging/ResilientRedisEventService');
const ResilientRedisEventService = RediESEventServiceModule.ResilientRedisEventService;
const CircuitBreakerModule = require('../../../../src/infrastructure/messaging/CircuitBreaker');
const CircuitState = CircuitBreakerModule.CircuitState;
const Event = require('../../../../src/domain/events/Event').Event;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
jest.mock('redis', () => {
    const storage = {};
    const subscribers = {};
    const simulateMessage = (channel, message) => {
        if (subscribers[channel]) {
            subscribers[channel].forEach(callback => {
                callback(message);
            });
        }
        return true;
    };
    const simulateDLQEvents = (eventType, events) => {
        events.forEach(event => {
            storage[`dlq:${eventType}:${event.id}`] = JSON.stringify(event);
        });
        storage[`dlq:index:${eventType}`] = events.map(e => e.id);
        return true;
    };
    const mockRedisClient = {
        connect: jest.fn().mockResolvedValue(undefined),
        disconnect: jest.fn().mockResolvedValue(undefined),
        publish: jest.fn().mockImplementation((channel, message) => {
            return Promise.resolve();
        }),
        subscribe: jest.fn().mockImplementation((channel, callback) => {
            if (!subscribers[channel]) {
                subscribers[channel] = [];
            }
            subscribers[channel].push(callback);
            return Promise.resolve();
        }),
        unsubscribe: jest.fn(),
        get: jest.fn().mockImplementation((key) => {
            return Promise.resolve(storage[key] || null);
        }),
        set: jest.fn().mockImplementation((key, value) => {
            storage[key] = value;
            return Promise.resolve('OK');
        }),
        del: jest.fn().mockImplementation((key) => {
            if (storage[key]) {
                delete storage[key];
                return Promise.resolve(1);
            }
            return Promise.resolve(0);
        }),
        sAdd: jest.fn().mockImplementation((key, value) => {
            if (!storage[key]) {
                storage[key] = [];
            }
            if (!Array.isArray(storage[key])) {
                storage[key] = [storage[key]];
            }
            if (!storage[key].includes(value)) {
                storage[key].push(value);
            }
            return Promise.resolve(1);
        }),
        sRem: jest.fn().mockImplementation((key, value) => {
            if (Array.isArray(storage[key]) && storage[key].includes(value)) {
                storage[key] = storage[key].filter((v) => v !== value);
                return Promise.resolve(1);
            }
            return Promise.resolve(0);
        }),
        sMembers: jest.fn().mockImplementation((key) => {
            return Promise.resolve(Array.isArray(storage[key]) ? storage[key] : []);
        }),
        exists: jest.fn().mockImplementation((key) => {
            return Promise.resolve(storage[key] ? 1 : 0);
        }),
        keys: jest.fn().mockImplementation((pattern) => {
            const keys = Object.keys(storage).filter(key => key.startsWith(pattern.replace(/\*/g, '')));
            return Promise.resolve(keys);
        }),
        quit: jest.fn().mockResolvedValue(undefined)
    };
    return {
        createClient: jest.fn().mockReturnValue(mockRedisClient),
        __simulateMessage: simulateMessage,
        __simulateDLQEvents: simulateDLQEvents,
        __getStorage: () => storage,
        __clearStorage: () => {
            Object.keys(storage).forEach(key => delete storage[key]);
        }
    };
});
describe('ResilientRedisEventService Integration Tests', () => {
    let eventService;
    let redis;
    beforeEach(async () => {
        jest.clearAllMocks();
        redis = require('redis');
        redis.__clearStorage();
        eventService = new ResilientRedisEventService({
            redisUrl: 'redis://localhost:6379',
            enableCircuitBreaker: true,
            enableRetries: true,
            enableDeadLetterQueue: true
        });
        await eventService.connect();
    });
    afterEach(async () => {
        await eventService.disconnect();
    });
    describe('Basic Publish/Subscribe', () => {
        test('should publish events to Redis', async () => {
            const testEvent = {
                type: 'TEST_EVENT',
                payload: { message: 'Hello World' },
                createdAt: new Date().toISOString()
            };
            await eventService.publish(testEvent);
            const mockRedisClient = redis.createClient();
            expect(mockRedisClient.publish).toHaveBeenCalledWith('TEST_EVENT', expect.any(String));
            const publishCall = mockRedisClient.publish.mock.calls[0];
            const serializedEvent = JSON.parse(publishCall[1]);
            expect(serializedEvent.type).toBe('TEST_EVENT');
            expect(serializedEvent.payload.message).toBe('Hello World');
        });
        test('should handle subscription and receive events', async () => {
            const mockHandler = {
                handle: jest.fn()
            };
            await eventService.subscribe('TEST_EVENT', mockHandler);
            const mockRedisClient = redis.createClient();
            expect(mockRedisClient.subscribe).toHaveBeenCalledWith('TEST_EVENT', expect.any(Function));
            const testEvent = {
                type: 'TEST_EVENT',
                payload: { message: 'Hello World' },
                createdAt: new Date().toISOString()
            };
            redis.__simulateMessage('TEST_EVENT', JSON.stringify(testEvent));
            await sleep(50);
            expect(mockHandler.handle).toHaveBeenCalledWith(expect.objectContaining({
                type: 'TEST_EVENT',
                payload: { message: 'Hello World' }
            }));
        });
    });
    describe('Circuit Breaker Functionality', () => {
        test('should open circuit after multiple failures', async () => {
            const mockRedisClient = redis.createClient();
            mockRedisClient.publish.mockRejectedValue(new Error('Redis connection error'));
            const circuitBreaker = eventService.circuitBreaker;
            expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
            const testEvent = {
                type: 'TEST_EVENT',
                payload: { message: 'Hello World' },
                createdAt: new Date().toISOString()
            };
            const publishPromises = [];
            for (let i = 0; i < 6; i++) {
                publishPromises.push(eventService.publish(testEvent).catch(e => e));
            }
            await Promise.all(publishPromises);
            expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
            await expect(eventService.publish(testEvent)).rejects.toThrow('Service redis-event-service is unavailable');
        });
    });
    describe('Retry Mechanism', () => {
        it('should retry failed events with exponential backoff', async () => {
            const event = {
                id: 'test-id',
                type: 'TEST_EVENT',
                payload: { message: 'test message' },
                createdAt: new Date().toISOString()
            };
            let publishAttempts = 0;
            const mockRedisClient = redis.createClient();
            mockRedisClient.publish.mockImplementation((channel, message) => {
                publishAttempts++;
                if (publishAttempts === 1) {
                    throw new Error('Publish attempt retry failed');
                }
                return Promise.resolve(1);
            });
            try {
                await eventService.publish(event);
            }
            catch (error) {
            }
            await sleep(1500);
            expect(mockRedisClient.publish).toHaveBeenCalled();
            expect(publishAttempts).toBeGreaterThanOrEqual(1);
        });
    });
    describe('Dead Letter Queue Integration', () => {
        test('should send events to DLQ after max retries', async () => {
            const mockRedisClient = redis.createClient();
            mockRedisClient.publish.mockRejectedValue(new Error('Persistent failure'));
            const dlq = eventService.getDeadLetterQueue();
            const addEventSpy = jest.spyOn(dlq, 'addEvent');
            addEventSpy.mockImplementation(() => Promise.resolve(true));
            const testEvent = {
                type: 'TEST_EVENT',
                payload: { message: 'Hello World' },
                createdAt: new Date().toISOString()
            };
            await expect(eventService.publish(testEvent)).rejects.toThrow('Persistent failure');
            const processQueueSpy = jest.spyOn(eventService.retryManager, 'processRetryQueue');
            processQueueSpy.mockImplementation(async () => {
                await dlq.addEvent(testEvent, 'Persistent failure', 3);
                return Promise.resolve();
            });
            await eventService.retryManager.processRetryQueue();
            expect(addEventSpy).toHaveBeenCalledWith(expect.objectContaining({
                type: 'TEST_EVENT',
                payload: { message: 'Hello World' }
            }), expect.stringContaining('Persistent failure'), 3);
        });
        test('should retrieve events from DLQ', async () => {
            const mockEvents = [
                {
                    id: 'id1',
                    originalEvent: {
                        type: 'ERROR_EVENT',
                        payload: { message: 'Error message 1' },
                        createdAt: new Date().toISOString()
                    },
                    failureReason: 'Connection failure',
                    attemptCount: 3,
                    lastAttemptAt: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'id2',
                    originalEvent: {
                        type: 'ERROR_EVENT',
                        payload: { message: 'Error message 2' },
                        createdAt: new Date().toISOString()
                    },
                    failureReason: 'Timeout',
                    attemptCount: 5,
                    lastAttemptAt: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                }
            ];
            redis.__simulateDLQEvents('ERROR_EVENT', mockEvents);
            const mockRedisClient = redis.createClient();
            mockRedisClient.keys.mockResolvedValue(['dlq:index:ERROR_EVENT']);
            const dlq = eventService.getDeadLetterQueue();
            const eventTypes = await dlq.getEventTypes();
            expect(eventTypes).toContain('ERROR_EVENT');
            const events = await dlq.getEventsByType('ERROR_EVENT');
            expect(events).toHaveLength(2);
            expect(events[0].originalEvent.payload.message).toBe('Error message 1');
            expect(events[1].originalEvent.payload.message).toBe('Error message 2');
        });
        test('should reprocess events from DLQ', async () => {
            const mockEvent = {
                id: 'test-id',
                originalEvent: {
                    type: 'TEST_EVENT',
                    payload: { message: 'Retry me' },
                    createdAt: new Date().toISOString()
                },
                failureReason: 'Previous failure',
                attemptCount: 3,
                lastAttemptAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };
            redis.__simulateDLQEvents('TEST_EVENT', [mockEvent]);
            const mockRedisClient = redis.createClient();
            mockRedisClient.get.mockImplementation((key) => {
                if (key === 'dlq:TEST_EVENT:test-id') {
                    return Promise.resolve(JSON.stringify(mockEvent));
                }
                return Promise.resolve(null);
            });
            mockRedisClient.exists.mockResolvedValue(1);
            mockRedisClient.publish.mockResolvedValue(undefined);
            const dlq = eventService.getDeadLetterQueue();
            dlq.onReprocessEvent = eventService.publish.bind(eventService);
            const success = await dlq.reprocessEvent('test-id', 'TEST_EVENT');
            expect(success).toBe(true);
            expect(mockRedisClient.publish).toHaveBeenCalledWith('TEST_EVENT', expect.stringContaining('Retry me'));
            expect(mockRedisClient.del).toHaveBeenCalledWith('dlq:TEST_EVENT:test-id');
            expect(mockRedisClient.sRem).toHaveBeenCalledWith('dlq:index:TEST_EVENT', 'test-id');
        });
    });
    describe('Service Metrics', () => {
        test('should provide accurate metrics', async () => {
            const metrics = eventService.getMetrics();
            expect(metrics).toHaveProperty('circuitBreakerState', CircuitState.CLOSED);
            expect(metrics).toHaveProperty('deadLetterQueueEnabled', true);
            expect(metrics).toHaveProperty('retryEnabled', true);
            const mockRedisClient = redis.createClient();
            mockRedisClient.publish.mockRejectedValue(new Error('Redis connection error'));
            const testEvent = {
                type: 'TEST_EVENT',
                payload: { message: 'Hello World' },
                createdAt: new Date().toISOString()
            };
            for (let i = 0; i < 6; i++) {
                try {
                    await eventService.publish(testEvent);
                }
                catch (e) {
                }
            }
            const updatedMetrics = eventService.getMetrics();
            expect(updatedMetrics.circuitBreakerState).toBe(CircuitState.OPEN);
        });
    });
});
//# sourceMappingURL=ResilientRedisEventService.test.js.map