import Redis from 'ioredis';

// Singleton Redis client configuration
let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      console.warn('REDIS_URL not configured, Redis features will be disabled');
      // Return a mock client that does nothing for development without Redis
      return {
        get: async () => null,
        set: async () => 'OK',
        del: async () => 0,
        exists: async () => 0,
        expire: async () => 0,
        ttl: async () => -1,
        publish: async () => 0,
        subscribe: async () => {},
        on: () => {},
        connect: async () => {},
        disconnect: async () => {},
      } as any;
    }

    try {
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            // Only reconnect when the error contains "READONLY"
            return true;
          }
          return false;
        },
      });

      redisClient.on('connect', () => {
        console.log('Redis connected successfully');
      });

      redisClient.on('error', (err) => {
        console.error('Redis connection error:', err);
      });
    } catch (error) {
      console.error('Failed to create Redis client:', error);
      throw error;
    }
  }

  return redisClient;
}

export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
} 