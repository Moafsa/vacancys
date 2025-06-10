"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CircuitBreaker_1 = require("../../../../src/infrastructure/messaging/CircuitBreaker");
const DeadLetterQueue_1 = require("../../../../src/infrastructure/messaging/DeadLetterQueue");
const RedisEventService_1 = require("../../../../src/infrastructure/messaging/RedisEventService");
const ResilientRedisEventService_1 = require("../../../../src/infrastructure/messaging/ResilientRedisEventService");
jest.mock('../../../../src/infrastructure/messaging/CircuitBreaker');
jest.mock('../../../../src/infrastructure/messaging/DeadLetterQueue');
jest.mock('../../../../src/infrastructure/messaging/RedisEventService');
describe('ResilientRedisEventService', () => {
    let service;
    let mockCircuitBreaker;
    let mockDeadLetterQueue;
    let mockRedisEventService;
    beforeEach(() => {
        jest.clearAllMocks();
        service = new ResilientRedisEventService_1.ResilientRedisEventService({
            enableCircuitBreaker: true,
            enableRetries: true,
            enableDeadLetterQueue: true,
            redisUrl: 'redis://test:6379'
        });
        mockCircuitBreaker = CircuitBreaker_1.CircuitBreaker;
        mockDeadLetterQueue = DeadLetterQueue_1.DeadLetterQueue;
        mockRedisEventService = RedisEventService_1.RedisEventService;
    });
    describe('connect', () => {
        it('should connect to Redis and initialize components', async () => {
            await service.connect();
            expect(mockRedisEventService.prototype.connect).toHaveBeenCalled();
            expect(mockDeadLetterQueue.prototype.connect).toHaveBeenCalled();
        });
        it('should handle connection errors', async () => {
            const error = new Error('Connection failed');
            mockRedisEventService.prototype.connect.mockRejectedValue(error);
            await expect(service.connect()).rejects.toThrow(error);
        });
    });
    describe('publish', () => {
        const testEvent = {
            id: '123',
            type: 'TEST_EVENT',
            data: { test: true },
            timestamp: new Date()
        };
        it('should publish event successfully with circuit breaker', async () => {
            mockCircuitBreaker.prototype.execute.mockImplementation(async (fn) => fn());
            mockRedisEventService.prototype.publish.mockResolvedValue();
            await service.publish(testEvent);
            expect(mockCircuitBreaker.prototype.execute).toHaveBeenCalled();
            expect(mockRedisEventService.prototype.publish).toHaveBeenCalledWith(testEvent);
        });
        it('should handle publish errors and retry', async () => {
            const error = new Error('Publish failed');
            mockCircuitBreaker.prototype.execute.mockRejectedValue(error);
            await expect(service.publish(testEvent)).rejects.toThrow(error);
        });
        it('should publish directly when circuit breaker is disabled', async () => {
            service = new ResilientRedisEventService_1.ResilientRedisEventService({ enableCircuitBreaker: false });
            mockRedisEventService.prototype.publish.mockResolvedValue();
            await service.publish(testEvent);
            expect(mockCircuitBreaker.prototype.execute).not.toHaveBeenCalled();
            expect(mockRedisEventService.prototype.publish).toHaveBeenCalledWith(testEvent);
        });
    });
    describe('subscribe', () => {
        const eventType = 'TEST_EVENT';
        const handler = jest.fn();
        it('should subscribe to events successfully', async () => {
            mockRedisEventService.prototype.subscribe.mockResolvedValue();
            await service.subscribe(eventType, handler);
            expect(mockRedisEventService.prototype.subscribe).toHaveBeenCalledWith(eventType, handler);
        });
        it('should handle subscription errors', async () => {
            const error = new Error('Subscribe failed');
            mockRedisEventService.prototype.subscribe.mockRejectedValue(error);
            await expect(service.subscribe(eventType, handler)).rejects.toThrow(error);
        });
    });
    describe('getMetrics', () => {
        it('should return service metrics', () => {
            mockCircuitBreaker.prototype.getState.mockReturnValue(CircuitBreaker_1.CircuitState.CLOSED);
            const metrics = service.getMetrics();
            expect(metrics).toEqual({
                circuitBreakerState: CircuitBreaker_1.CircuitState.CLOSED,
                deadLetterQueueEnabled: true,
                retryEnabled: true
            });
        });
    });
});
//# sourceMappingURL=ResilientRedisEventService.test.js.map