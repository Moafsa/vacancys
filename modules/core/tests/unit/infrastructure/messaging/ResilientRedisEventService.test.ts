import { Event } from '../../../../src/domain/events/Event';
import { CircuitBreaker, CircuitState } from '../../../../src/infrastructure/messaging/CircuitBreaker';
import { DeadLetterQueue } from '../../../../src/infrastructure/messaging/DeadLetterQueue';
import { RedisEventService } from '../../../../src/infrastructure/messaging/RedisEventService';
import { ResilientRedisEventService } from '../../../../src/infrastructure/messaging/ResilientRedisEventService';

// Mock dependencies
jest.mock('../../../../src/infrastructure/messaging/CircuitBreaker');
jest.mock('../../../../src/infrastructure/messaging/DeadLetterQueue');
jest.mock('../../../../src/infrastructure/messaging/RedisEventService');

describe('ResilientRedisEventService', () => {
  let service: ResilientRedisEventService;
  let mockCircuitBreaker: jest.Mocked<CircuitBreaker>;
  let mockDeadLetterQueue: jest.Mocked<DeadLetterQueue>;
  let mockRedisEventService: jest.Mocked<RedisEventService>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create fresh instance for each test
    service = new ResilientRedisEventService({
      enableCircuitBreaker: true,
      enableRetries: true,
      enableDeadLetterQueue: true,
      redisUrl: 'redis://test:6379'
    });

    // Get mock instances
    mockCircuitBreaker = CircuitBreaker as jest.Mocked<typeof CircuitBreaker>;
    mockDeadLetterQueue = DeadLetterQueue as jest.Mocked<typeof DeadLetterQueue>;
    mockRedisEventService = RedisEventService as jest.Mocked<typeof RedisEventService>;
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
    const testEvent: Event = {
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
      service = new ResilientRedisEventService({ enableCircuitBreaker: false });
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
      mockCircuitBreaker.prototype.getState.mockReturnValue(CircuitState.CLOSED);

      const metrics = service.getMetrics();

      expect(metrics).toEqual({
        circuitBreakerState: CircuitState.CLOSED,
        deadLetterQueueEnabled: true,
        retryEnabled: true
      });
    });
  });
}); 