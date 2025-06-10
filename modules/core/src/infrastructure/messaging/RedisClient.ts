import Redis from 'ioredis';
import { EventEmitter } from 'events';

export interface RedisConfig {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}

export class RedisClient {
  private publisher: Redis;
  private subscriber: Redis;
  private eventEmitter: EventEmitter;

  constructor(config: RedisConfig) {
    if (typeof window !== 'undefined') {
      throw new Error('RedisClient cannot be used in the browser');
    }
    if (config.url) {
      this.publisher = new Redis(config.url);
      this.subscriber = new Redis(config.url);
    } else {
      this.publisher = new Redis(config);
      this.subscriber = new Redis(config);
    }
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(0);

    this.subscriber.on('message', (channel: string, message: string) => {
      try {
        const parsedMessage = JSON.parse(message);
        this.eventEmitter.emit(channel, parsedMessage);
      } catch (error) {
        console.error(`Error parsing message from Redis: ${error}`);
        // Não propaga mensagens com JSON inválido
      }
    });
  }

  async publish(channel: string, message: any): Promise<void> {
    if (!channel || typeof channel !== 'string') {
      throw new Error('Channel must be a non-empty string');
    }

    try {
      const serializedMessage = JSON.stringify(message);
      await this.publisher.publish(channel, serializedMessage);
    } catch (error) {
      throw new Error(`Failed to publish message: ${error}`);
    }
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    if (!channel || typeof channel !== 'string') {
      throw new Error('Channel must be a non-empty string');
    }
    if (!callback || typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    try {
      await this.subscriber.subscribe(channel);
      this.eventEmitter.on(channel, callback);
    } catch (error) {
      throw new Error(`Failed to subscribe to channel: ${error}`);
    }
  }

  async unsubscribe(channel: string): Promise<void> {
    if (!channel || typeof channel !== 'string') {
      throw new Error('Channel must be a non-empty string');
    }

    try {
      await this.subscriber.unsubscribe(channel);
      this.eventEmitter.removeAllListeners(channel);
    } catch (error) {
      throw new Error(`Failed to unsubscribe from channel: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      const results = await Promise.allSettled([
        this.publisher.quit(),
        this.subscriber.quit()
      ]);

      this.eventEmitter.removeAllListeners();

      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map(r => r.reason);

      if (errors.length > 0) {
        throw new Error('Disconnect failed');
      }
    } catch (error) {
      throw new Error('Disconnect failed');
    }
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.publisher.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }

  getStatus(): {
    publisherStatus: string;
    subscriberStatus: string;
  } {
    return {
      publisherStatus: this.publisher.status,
      subscriberStatus: this.subscriber.status
    };
  }
} 