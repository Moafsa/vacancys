"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResilientRedisEventService_1 = require("../ResilientRedisEventService");
const CircuitBreaker_1 = require("../CircuitBreaker");
const RetryManager_1 = require("../RetryManager");
const DeadLetterQueue_1 = require("../DeadLetterQueue");
const MessagingMetrics_1 = require("../MessagingMetrics");
const RedisClient_1 = require("../RedisClient");
jest.mock('../RedisClient');
jest.mock('../CircuitBreaker');
jest.mock('../RetryManager');
jest.mock('../DeadLetterQueue');
jest.mock('../MessagingMetrics');
describe('ResilientRedisEventService', () => {
    let service;
    let mockRedisClient;
    let mockCircuitBreaker;
    let mockRetryManager;
    let mockDeadLetterQueue;
    let mockMetrics;
    const config = {
        host: 'localhost',
        port: 6379
    };
    beforeEach(() => {
        jest.clearAllMocks();
        mockRedisClient = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            disconnect: jest.fn(),
            ping: jest.fn(),
        };
        mockCircuitBreaker = {
            execute: jest.fn(),
            onStateChange: jest.fn(),
            getState: jest.fn(),
        };
        mockRetryManager = {
            execute: jest.fn(),
        };
        mockDeadLetterQueue = {
            addMessage: jest.fn(),
            getSize: jest.fn().mockReturnValue(0),
            clear: jest.fn(),
            getMessage: jest.fn(),
            getAllMessages: jest.fn(),
            removeMessage: jest.fn(),
            retryMessage: jest.fn(),
        };
        mockMetrics = {
            recordCircuitBreakerStateChange: jest.fn(),
            recordEventPublished: jest.fn(),
            recordEventFailed: jest.fn(),
            recordEventDeadLettered: jest.fn(),
        };
        RedisClient_1.RedisClient
            .mockImplementation(() => mockRedisClient);
        CircuitBreaker_1.CircuitBreaker
            .mockImplementation(() => mockCircuitBreaker);
        RetryManager_1.RetryManager
            .mockImplementation(() => mockRetryManager);
        DeadLetterQueue_1.DeadLetterQueue
            .mockImplementation(() => mockDeadLetterQueue);
        MessagingMetrics_1.MessagingMetrics
            .mockImplementation(() => mockMetrics);
        service = new ResilientRedisEventService_1.ResilientRedisEventService(config, mockCircuitBreaker, mockRetryManager, mockDeadLetterQueue, mockMetrics);
    });
    describe('constructor', () => {
        it('should create instance with default dependencies when not provided', () => {
            const defaultService = new ResilientRedisEventService_1.ResilientRedisEventService(config);
            expect(defaultService).toBeInstanceOf(ResilientRedisEventService_1.ResilientRedisEventService);
        });
        it('should setup circuit breaker state change listener', () => {
            expect(mockCircuitBreaker.onStateChange).toHaveBeenCalled();
            const listener = mockCircuitBreaker.onStateChange.mock.calls[0][0];
            listener(CircuitBreaker_1.CircuitState.OPEN);
            expect(mockMetrics.recordCircuitBreakerStateChange)
                .toHaveBeenCalledWith(CircuitBreaker_1.CircuitState.OPEN);
        });
    });
    describe('publishEvent', () => {
        const eventType = 'test-event';
        const eventData = { test: 'data' };
        it('should publish event successfully', async () => {
            mockCircuitBreaker.execute.mockImplementation(fn => fn());
            mockRetryManager.execute.mockImplementation(fn => fn());
            mockRedisClient.publish.mockResolvedValue();
            await service.publishEvent(eventType, eventData);
            expect(mockRedisClient.publish).toHaveBeenCalledWith(eventType, expect.objectContaining({
                type: eventType,
                data: eventData,
            }));
            expect(mockMetrics.recordEventPublished).toHaveBeenCalledWith(eventType, expect.any(Number));
        });
        it('should handle publish failure', async () => {
            const error = new Error('Publish failed');
            mockCircuitBreaker.execute.mockRejectedValue(error);
            await expect(service.publishEvent(eventType, eventData))
                .rejects
                .toThrow('Publish failed');
            expect(mockMetrics.recordEventFailed).toHaveBeenCalledWith(eventType);
        });
    });
    describe('subscribeToEvent', () => {
        const eventType = 'test-event';
        const handler = jest.fn();
        beforeEach(() => {
            mockCircuitBreaker.execute.mockImplementation(fn => fn());
            mockRetryManager.execute.mockImplementation(fn => fn());
        });
        it('should subscribe to event successfully', async () => {
            await service.subscribeToEvent(eventType, handler);
            expect(mockRedisClient.subscribe).toHaveBeenCalledWith(eventType, expect.any(Function));
        });
        it('should handle messages successfully', async () => {
            mockRedisClient.subscribe.mockImplementation(async (_, callback) => {
                await callback({ data: 'test', type: eventType });
            });
            await service.subscribeToEvent(eventType, handler);
            expect(handler).toHaveBeenCalledWith('test');
            expect(mockMetrics.recordEventPublished).toHaveBeenCalledWith(eventType, expect.any(Number));
        });
        it('should handle message processing failure', async () => {
            const error = new Error('Processing failed');
            handler.mockRejectedValue(error);
            mockRedisClient.subscribe.mockImplementation(async (_, callback) => {
                await callback({
                    id: 'test-id',
                    type: eventType,
                    data: 'test',
                    timestamp: new Date()
                });
            });
            await service.subscribeToEvent(eventType, handler);
            expect(mockMetrics.recordEventFailed).toHaveBeenCalledWith(eventType);
            expect(mockMetrics.recordEventDeadLettered).toHaveBeenCalledWith(eventType);
            expect(mockDeadLetterQueue.addMessage).toHaveBeenCalledWith('test-id', expect.any(Object), error, 3, eventType);
        });
    });
    describe('health check and monitoring', () => {
        it('should check health status', async () => {
            mockRedisClient.ping.mockResolvedValue(true);
            mockCircuitBreaker.getState.mockReturnValue(CircuitBreaker_1.CircuitState.CLOSED);
            mockDeadLetterQueue.getSize.mockReturnValue(0);
            const health = await service.checkHealth();
            expect(health).toEqual({
                redis: true,
                circuitBreaker: CircuitBreaker_1.CircuitState.CLOSED,
                deadLetterQueue: 0
            });
        });
        it('should handle health check failure', async () => {
            mockRedisClient.ping.mockResolvedValue(false);
            mockCircuitBreaker.getState.mockReturnValue(CircuitBreaker_1.CircuitState.OPEN);
            mockDeadLetterQueue.getSize.mockReturnValue(5);
            const health = await service.checkHealth();
            expect(health).toEqual({
                redis: false,
                circuitBreaker: CircuitBreaker_1.CircuitState.OPEN,
                deadLetterQueue: 5
            });
        });
        it('should get metrics', () => {
            expect(service.getMetrics()).toBe(mockMetrics);
        });
        it('should get dead letter queue size', async () => {
            mockDeadLetterQueue.getSize.mockReturnValue(3);
            const size = await service.getDeadLetterQueueSize();
            expect(size).toBe(3);
        });
        it('should get circuit breaker state', async () => {
            mockCircuitBreaker.getState.mockReturnValue(CircuitBreaker_1.CircuitState.HALF_OPEN);
            const state = await service.getCircuitBreakerState();
            expect(state).toBe(CircuitBreaker_1.CircuitState.HALF_OPEN);
        });
    });
    describe('disconnect', () => {
        it('should disconnect redis client', async () => {
            mockRedisClient.disconnect.mockResolvedValue();
            await service.disconnect();
            expect(mockRedisClient.disconnect).toHaveBeenCalled();
        });
        it('should handle disconnect failure', async () => {
            const error = new Error('Disconnect failed');
            mockRedisClient.disconnect.mockRejectedValue(error);
            await expect(service.disconnect())
                .rejects
                .toThrow('Disconnect failed');
        });
    });
});
//# sourceMappingURL=ResilientRedisEventService.test.js.map