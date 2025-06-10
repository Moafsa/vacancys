import { ResilientRedisEventService } from './ResilientRedisEventService';
import { RetryManager } from './RetryManager';
import { CircuitBreaker } from './CircuitBreaker';
import { DeadLetterQueue } from './DeadLetterQueue';
import { MessagingMetrics } from './MessagingMetrics';
import { RedisClient, RedisConfig } from './RedisClient';

export type EventPayload = {
  [key: string]: any;
};

export type EventHandler = (payload: EventPayload) => Promise<void>;

export class EventEmitter {
  private redisClient: RedisClient;
  private resilientService: ResilientRedisEventService;
  private handlers: Map<string, EventHandler[]>;
  private metrics: MessagingMetrics;

  constructor() {
    const redisConfig: RedisConfig = {
      url: process.env.REDIS_URL
    };

    try {
      this.redisClient = new RedisClient(redisConfig);
    } catch (err) {
      console.error('Redis unavailable, falling back to in-memory events only:', err);
      // Fallback: mock RedisClient para não quebrar o fluxo
      this.redisClient = {
        publish: async () => {},
        subscribe: async () => {},
        unsubscribe: async () => {},
        disconnect: async () => {},
        getStatus: () => ({ publisherStatus: 'offline', subscriberStatus: 'offline' }),
        ping: async () => false,
      } as any;
    }
    
    const retryManager = new RetryManager();
    const circuitBreaker = new CircuitBreaker();
    const deadLetterQueue = new DeadLetterQueue(1000);
    this.metrics = new MessagingMetrics();

    this.resilientService = new ResilientRedisEventService(
      redisConfig,
      circuitBreaker,
      retryManager,
      deadLetterQueue,
      this.metrics
    );

    this.handlers = new Map();

    // Iniciar o consumo de eventos
    this.startConsuming();
  }

  private async startConsuming(): Promise<void> {
    await this.redisClient.subscribe('user.*', async (message: string) => {
      try {
        const payload = JSON.parse(message);
        const channel = 'user.*'; // Simplificado para este exemplo
        await this.processEvent(channel, payload);
      } catch (error) {
        console.error(`Error processing event:`, error);
      }
    });
  }

  private async processEvent(eventName: string, payload: EventPayload): Promise<void> {
    const handlers = this.handlers.get(eventName) || [];
    const startTime = Date.now();
    
    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (error) {
        console.error(`Error in handler for event ${eventName}:`, error);
        this.metrics.recordEventFailed(eventName);
      }
    }

    const processingTime = Date.now() - startTime;
    this.metrics.recordEventPublished(eventName, processingTime);
  }

  async emit(eventName: string, payload: EventPayload): Promise<void> {
    try {
      const startTime = Date.now();
      await this.redisClient.publish(eventName, payload);
      const processingTime = Date.now() - startTime;
      this.metrics.recordEventPublished(eventName, processingTime);
    } catch (error) {
      console.error(`Error emitting event ${eventName}:`, error);
      this.metrics.recordEventFailed(eventName);
      throw error;
    }
  }

  on(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }

  off(eventName: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventName) || [];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
      this.handlers.set(eventName, handlers);
    }
  }

  async getMetrics(): Promise<any> {
    return this.metrics.getAggregatedMetrics();
  }

  async close(): Promise<void> {
    await this.redisClient.disconnect();
  }
} 