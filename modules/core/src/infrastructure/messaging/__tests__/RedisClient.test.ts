import Redis from 'ioredis';
import { RedisClient, RedisConfig } from '../RedisClient';
import { EventEmitter } from 'events';

jest.mock('ioredis');

const mockConfig: RedisConfig = {
  host: 'localhost',
  port: 6379,
};

describe('RedisClient', () => {
  let redisClient: RedisClient;
  let mockPublisher: jest.Mocked<Redis>;
  let mockSubscriber: jest.Mocked<Redis>;
  let mockEventEmitter: jest.Mocked<EventEmitter>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockPublisher = {
      publish: jest.fn(),
      quit: jest.fn(),
      ping: jest.fn(),
      status: 'ready',
    } as unknown as jest.Mocked<Redis>;

    mockSubscriber = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      quit: jest.fn(),
      on: jest.fn(),
      status: 'ready',
    } as unknown as jest.Mocked<Redis>;

    // Mock do EventEmitter
    mockEventEmitter = new EventEmitter() as jest.Mocked<EventEmitter>;

    let isFirstCall = true;
    (Redis as jest.MockedClass<typeof Redis>).mockImplementation(() => {
      if (isFirstCall) {
        isFirstCall = false;
        return mockPublisher;
      }
      return mockSubscriber;
    });

    redisClient = new RedisClient(mockConfig);
    // @ts-ignore - Acessando propriedade privada para teste
    redisClient['eventEmitter'] = mockEventEmitter;
  });

  afterEach(async () => {
    try {
      await redisClient.disconnect();
    } catch {
      // Ignore disconnect errors in cleanup
    }
  });

  describe('publish', () => {
    it('should publish message successfully', async () => {
      const channel = 'test-channel';
      const message = { data: 'test' };
      
      mockPublisher.publish.mockResolvedValue(1);
      
      await redisClient.publish(channel, message);
      
      expect(mockPublisher.publish).toHaveBeenCalledWith(
        channel,
        JSON.stringify(message)
      );
    });

    it('should throw error when publishing fails', async () => {
      const error = new Error('Publish failed');
      mockPublisher.publish.mockRejectedValue(error);
      
      await expect(redisClient.publish('channel', {}))
        .rejects
        .toThrow('Failed to publish message: Error: Publish failed');
    });

    it('should throw error for invalid channel', async () => {
      await expect(redisClient.publish('', {}))
        .rejects
        .toThrow('Channel must be a non-empty string');
    });
  });

  describe('subscribe', () => {
    it('should subscribe to channel successfully', async () => {
      const channel = 'test-channel';
      const callback = jest.fn();
      
      mockSubscriber.subscribe.mockResolvedValue(undefined);
      
      await redisClient.subscribe(channel, callback);
      
      expect(mockSubscriber.subscribe).toHaveBeenCalledWith(channel);
    });

    it('should throw error when subscribing fails', async () => {
      const error = new Error('Subscribe failed');
      mockSubscriber.subscribe.mockRejectedValue(error);
      
      await expect(redisClient.subscribe('channel', jest.fn()))
        .rejects
        .toThrow('Failed to subscribe to channel: Error: Subscribe failed');
    });

    it('should throw error for invalid channel', async () => {
      await expect(redisClient.subscribe('', jest.fn()))
        .rejects
        .toThrow('Channel must be a non-empty string');
    });

    it('should throw error for invalid callback', async () => {
      await expect(redisClient.subscribe('channel', null as any))
        .rejects
        .toThrow('Callback must be a function');
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from channel successfully', async () => {
      const channel = 'test-channel';
      
      mockSubscriber.unsubscribe.mockResolvedValue(undefined);
      
      await redisClient.unsubscribe(channel);
      
      expect(mockSubscriber.unsubscribe).toHaveBeenCalledWith(channel);
    });

    it('should throw error when unsubscribing fails', async () => {
      const error = new Error('Unsubscribe failed');
      mockSubscriber.unsubscribe.mockRejectedValue(error);
      
      await expect(redisClient.unsubscribe('channel'))
        .rejects
        .toThrow('Failed to unsubscribe from channel: Error: Unsubscribe failed');
    });

    it('should throw error for invalid channel', async () => {
      await expect(redisClient.unsubscribe(''))
        .rejects
        .toThrow('Channel must be a non-empty string');
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully', async () => {
      mockPublisher.quit.mockResolvedValue('OK');
      mockSubscriber.quit.mockResolvedValue('OK');
      
      await redisClient.disconnect();
      
      expect(mockPublisher.quit).toHaveBeenCalled();
      expect(mockSubscriber.quit).toHaveBeenCalled();
    });

    it('should throw error when disconnect fails', async () => {
      const error = new Error('Disconnect failed');
      mockPublisher.quit.mockRejectedValue(error);
      mockSubscriber.quit.mockResolvedValue('OK');
      
      await expect(redisClient.disconnect())
        .rejects
        .toThrowError(/Disconnect failed/);
    });
  });

  describe('ping', () => {
    it('should return true when ping succeeds', async () => {
      mockPublisher.ping.mockResolvedValue('PONG');
      
      const result = await redisClient.ping();
      
      expect(result).toBe(true);
    });

    it('should return false when ping fails', async () => {
      mockPublisher.ping.mockRejectedValue(new Error('Ping failed'));
      
      const result = await redisClient.ping();
      
      expect(result).toBe(false);
    });
  });

  describe('getStatus', () => {
    it('should return correct status', () => {
      const status = redisClient.getStatus();
      
      expect(status).toEqual({
        publisherStatus: 'ready',
        subscriberStatus: 'ready'
      });
    });
  });

  describe('message handling', () => {
    it('should handle invalid JSON message gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const invalidMessage = 'invalid json';
      const channel = 'test-channel';

      // Simular recebimento de mensagem inválida
      mockSubscriber.on.mock.calls[0][1](channel, invalidMessage);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error parsing message from Redis')
      );

      consoleSpy.mockRestore();
    });
  });
}); 