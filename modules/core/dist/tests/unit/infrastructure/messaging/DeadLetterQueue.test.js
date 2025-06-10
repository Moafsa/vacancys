const DeadLetterQueueModule = require('../../../../src/infrastructure/messaging/DeadLetterQueue');
const DeadLetterQueue = DeadLetterQueueModule.DeadLetterQueue;
const { Event } = require('../../../../src/domain/events/Event');
const mockRedisClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn(),
    del: jest.fn().mockResolvedValue(1),
    sAdd: jest.fn().mockResolvedValue(1),
    sRem: jest.fn().mockResolvedValue(1),
    sMembers: jest.fn(),
    exists: jest.fn().mockResolvedValue(1),
    keys: jest.fn().mockResolvedValue([]),
    quit: jest.fn().mockResolvedValue(undefined)
};
const originalCreateClient = require('redis').createClient;
require('redis').createClient = jest.fn().mockReturnValue(mockRedisClient);
describe('DeadLetterQueue', () => {
    let dlq;
    beforeEach(() => {
        jest.clearAllMocks();
        dlq = new DeadLetterQueue({
            redisUrl: 'redis://localhost:6379',
            queuePrefix: 'test:dlq:'
        });
    });
    afterEach(async () => {
        await dlq.disconnect();
    });
    afterAll(() => {
        require('redis').createClient = originalCreateClient;
    });
    test('should connect to Redis', async () => {
        await dlq.connect();
        expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
    });
    test('should disconnect from Redis', async () => {
        await dlq.connect();
        await dlq.disconnect();
        expect(mockRedisClient.quit).toHaveBeenCalledTimes(1);
    });
    test('should add event to DLQ', async () => {
        const testEvent = {
            type: 'TEST_EVENT',
            payload: { message: 'Test message' },
            createdAt: new Date()
        };
        const failureReason = 'Test failure';
        const attemptCount = 3;
        await dlq.connect();
        const eventId = await dlq.addEvent(testEvent, failureReason, attemptCount);
        expect(eventId).toBeTruthy();
        expect(typeof eventId).toBe('string');
        expect(mockRedisClient.set).toHaveBeenCalledWith(expect.stringContaining('test:dlq:TEST_EVENT:'), expect.any(String));
        expect(mockRedisClient.sAdd).toHaveBeenCalledWith('test:dlq:index:TEST_EVENT', expect.any(String));
    });
    test('should retrieve event types from DLQ', async () => {
        const mockEventTypes = ['TYPE_A', 'TYPE_B', 'TYPE_C'];
        mockRedisClient.keys.mockResolvedValue(['test:dlq:index:TYPE_A', 'test:dlq:index:TYPE_B', 'test:dlq:index:TYPE_C']);
        await dlq.connect();
        const eventTypes = await dlq.getEventTypes();
        expect(mockRedisClient.keys).toHaveBeenCalledWith('test:dlq:index:*');
        expect(eventTypes).toEqual(mockEventTypes);
    });
    test('should retrieve events by type', async () => {
        const testEventType = 'ERROR_EVENT';
        const mockEventIds = ['id1', 'id2', 'id3'];
        const mockEvents = mockEventIds.map(id => ({
            id,
            originalEvent: {
                type: testEventType,
                payload: { message: `Event ${id}` },
                createdAt: new Date().toISOString()
            },
            failureReason: 'Test failure',
            attemptCount: 3,
            lastAttemptAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        }));
        mockRedisClient.sMembers.mockResolvedValue(mockEventIds);
        mockRedisClient.get.mockImplementation((key) => {
            const id = key.split(':').pop();
            const event = mockEvents.find(e => e.id === id);
            return Promise.resolve(event ? JSON.stringify(event) : null);
        });
        await dlq.connect();
        const events = await dlq.getEventsByType(testEventType);
        expect(mockRedisClient.sMembers).toHaveBeenCalledWith(`test:dlq:index:${testEventType}`);
        expect(mockRedisClient.get).toHaveBeenCalledTimes(mockEventIds.length);
        expect(events.length).toBe(mockEventIds.length);
        events.forEach(event => {
            expect(event.originalEvent.type).toBe(testEventType);
            expect(mockEventIds).toContain(event.id);
        });
    });
    test('should reprocess an event', async () => {
        const testEventId = 'test-id-123';
        const testEventType = 'TEST_EVENT';
        const mockEvent = {
            id: testEventId,
            originalEvent: {
                type: testEventType,
                payload: { message: 'Reprocess me' },
                createdAt: new Date().toISOString()
            },
            failureReason: 'Original failure',
            attemptCount: 3,
            lastAttemptAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        mockRedisClient.get.mockResolvedValue(JSON.stringify(mockEvent));
        mockRedisClient.exists.mockResolvedValue(1);
        let reprocessedEvent = null;
        dlq.onReprocessEvent = async (event) => {
            reprocessedEvent = event;
            return true;
        };
        await dlq.connect();
        const success = await dlq.reprocessEvent(testEventId, testEventType);
        expect(success).toBe(true);
        expect(reprocessedEvent).toEqual(mockEvent.originalEvent);
        expect(mockRedisClient.del).toHaveBeenCalledWith(`test:dlq:${testEventType}:${testEventId}`);
        expect(mockRedisClient.sRem).toHaveBeenCalledWith(`test:dlq:index:${testEventType}`, testEventId);
    });
    test('should handle reprocess failure', async () => {
        const testEventId = 'test-id-123';
        const testEventType = 'TEST_EVENT';
        const mockEvent = {
            id: testEventId,
            originalEvent: {
                type: testEventType,
                payload: { message: 'Reprocess me' },
                createdAt: new Date().toISOString()
            },
            failureReason: 'Original failure',
            attemptCount: 3,
            lastAttemptAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        mockRedisClient.get.mockResolvedValue(JSON.stringify(mockEvent));
        mockRedisClient.exists.mockResolvedValue(1);
        dlq.onReprocessEvent = async () => {
            throw new Error('Reprocessing failed');
        };
        await dlq.connect();
        const success = await dlq.reprocessEvent(testEventId, testEventType);
        expect(success).toBe(false);
        expect(mockRedisClient.del).not.toHaveBeenCalled();
        expect(mockRedisClient.sRem).not.toHaveBeenCalled();
    });
    test('should purge events by type', async () => {
        const testEventType = 'ERROR_EVENT';
        const mockEventIds = ['id1', 'id2', 'id3'];
        mockRedisClient.sMembers.mockResolvedValue(mockEventIds);
        await dlq.connect();
        const purgedCount = await dlq.purgeEventsByType(testEventType);
        expect(mockRedisClient.sMembers).toHaveBeenCalledWith(`test:dlq:index:${testEventType}`);
        expect(mockRedisClient.del).toHaveBeenCalledTimes(mockEventIds.length + 1);
        expect(purgedCount).toBe(mockEventIds.length);
    });
    test('should handle non-existent event during reprocess', async () => {
        const testEventId = 'non-existent-id';
        const testEventType = 'TEST_EVENT';
        mockRedisClient.get.mockResolvedValue(null);
        await dlq.connect();
        const success = await dlq.reprocessEvent(testEventId, testEventType);
        expect(success).toBe(false);
        expect(mockRedisClient.get).toHaveBeenCalledWith(`test:dlq:${testEventType}:${testEventId}`);
    });
});
//# sourceMappingURL=DeadLetterQueue.test.js.map