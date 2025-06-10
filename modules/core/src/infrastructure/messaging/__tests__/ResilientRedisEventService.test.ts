import { ResilientRedisEventService } from '../ResilientRedisEventService';
import { CircuitBreaker, CircuitState } from '../CircuitBreaker';
import { RetryManager } from '../RetryManager';
import { DeadLetterQueue } from '../DeadLetterQueue';
import { MessagingMetrics } from '../MessagingMetrics';
import { RedisClient } from '../RedisClient';

jest.mock('../RedisClient');
jest.mock('../CircuitBreaker');
jest.mock('../RetryManager');
jest.mock('../DeadLetterQueue');
jest.mock('../MessagingMetrics');

describe('ResilientRedisEventService', () => {
  let service: ResilientRedisEventService;
  let mockRedisClient: jest.Mocked<RedisClient>;
  let mockCircuitBreaker: jest.Mocked<CircuitBreaker>;
  let mockRetryManager: jest.Mocked<RetryManager>;
  let mockDeadLetterQueue: jest.Mocked<DeadLetterQueue>;
  let mockMetrics: jest.Mocked<MessagingMetrics>;

  const config = {
    host: 'localhost',
    port: 6379
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    mockRedisClient = {
      publish: jest.fn(),
      subscribe: jest.fn(),
      disconnect: jest.fn(),
      ping: jest.fn(),
    } as unknown as jest.Mocked<RedisClient>;

    mockCircuitBreaker = {
      execute: jest.fn(),
      onStateChange: jest.fn(),
      getState: jest.fn(),
    } as unknown as jest.Mocked<CircuitBreaker>;

    mockRetryManager = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RetryManager>;

    mockDeadLetterQueue = {
      addMessage: jest.fn(),
      getSize: jest.fn().mockReturnValue(0),
      clear: jest.fn(),
      getMessage: jest.fn(),
      getAllMessages: jest.fn(),
      removeMessage: jest.fn(),
      retryMessage: jest.fn(),
    } as unknown as jest.Mocked<DeadLetterQueue>;

    mockMetrics = {
      recordCircuitBreakerStateChange: jest.fn(),
      recordEventPublished: jest.fn(),
      recordEventFailed: jest.fn(),
      recordEventDeadLettered: jest.fn(),
    } as unknown as jest.Mocked<MessagingMetrics>;

    // Mock implementations
    (RedisClient as jest.MockedClass<typeof RedisClient>)
      .mockImplementation(() => mockRedisClient);
    (CircuitBreaker as jest.MockedClass<typeof CircuitBreaker>)
      .mockImplementation(() => mockCircuitBreaker);
    (RetryManager as jest.MockedClass<typeof RetryManager>)
      .mockImplementation(() => mockRetryManager);
    (DeadLetterQueue as jest.MockedClass<typeof DeadLetterQueue>)
      .mockImplementation(() => mockDeadLetterQueue);
    (MessagingMetrics as jest.MockedClass<typeof MessagingMetrics>)
      .mockImplementation(() => mockMetrics);

    service = new ResilientRedisEventService(
      config,
      mockCircuitBreaker,
      mockRetryManager,
      mockDeadLetterQueue,
      mockMetrics
    );
  });

  describe('constructor', () => {
    it('should create instance with default dependencies when not provided', () => {
      const defaultService = new ResilientRedisEventService(config);
      expect(defaultService).toBeInstanceOf(ResilientRedisEventService);
    });

    it('should setup circuit breaker state change listener', () => {
      expect(mockCircuitBreaker.onStateChange).toHaveBeenCalled();
      
      // Simulate state change
      const listener = mockCircuitBreaker.onStateChange.mock.calls[0][0];
      listener(CircuitState.OPEN);
      
      expect(mockMetrics.recordCircuitBreakerStateChange)
        .toHaveBeenCalledWith(CircuitState.OPEN);
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

      expect(mockRedisClient.publish).toHaveBeenCalledWith(
        eventType,
        expect.objectContaining({
          type: eventType,
          data: eventData,
        })
      );
      expect(mockMetrics.recordEventPublished).toHaveBeenCalledWith(
        eventType,
        expect.any(Number)
      );
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

      expect(mockRedisClient.subscribe).toHaveBeenCalledWith(
        eventType,
        expect.any(Function)
      );
    });

    it('should handle messages successfully', async () => {
      mockRedisClient.subscribe.mockImplementation(async (_, callback) => {
        await callback({ data: 'test', type: eventType });
      });

      await service.subscribeToEvent(eventType, handler);

      expect(handler).toHaveBeenCalledWith('test');
      expect(mockMetrics.recordEventPublished).toHaveBeenCalledWith(
        eventType,
        expect.any(Number)
      );
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
      expect(mockDeadLetterQueue.addMessage).toHaveBeenCalledWith(
        'test-id',
        expect.any(Object),
        error,
        3,
        eventType
      );
    });
  });

  describe('health check and monitoring', () => {
    it('should check health status', async () => {
      mockRedisClient.ping.mockResolvedValue(true);
      mockCircuitBreaker.getState.mockReturnValue(CircuitState.CLOSED);
      mockDeadLetterQueue.getSize.mockReturnValue(0);

      const health = await service.checkHealth();

      expect(health).toEqual({
        redis: true,
        circuitBreaker: CircuitState.CLOSED,
        deadLetterQueue: 0
      });
    });

    it('should handle health check failure', async () => {
      mockRedisClient.ping.mockResolvedValue(false);
      mockCircuitBreaker.getState.mockReturnValue(CircuitState.OPEN);
      mockDeadLetterQueue.getSize.mockReturnValue(5);

      const health = await service.checkHealth();

      expect(health).toEqual({
        redis: false,
        circuitBreaker: CircuitState.OPEN,
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
      mockCircuitBreaker.getState.mockReturnValue(CircuitState.HALF_OPEN);
      
      const state = await service.getCircuitBreakerState();
      expect(state).toBe(CircuitState.HALF_OPEN);
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