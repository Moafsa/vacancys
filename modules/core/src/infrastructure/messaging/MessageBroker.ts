import { CircuitBreaker } from './CircuitBreaker';
import { RetryManager } from './RetryManager';

export interface Message {
  topic: string;
  payload: any;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface MessageHandler {
  (message: Message): Promise<void>;
}

export interface MessageBrokerConfig {
  retryConfig?: {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffFactor: number;
  };
  circuitBreakerConfig?: {
    failureThreshold: number;
    resetTimeout: number;
    successThreshold: number;
  };
}

export interface MessageBroker {
  publish(message: Message): Promise<void>;
  subscribe(topic: string, handler: MessageHandler): Promise<void>;
  unsubscribe(topic: string): Promise<void>;
}

export class ResilientMessageBroker implements MessageBroker {
  private handlers: Map<string, MessageHandler[]> = new Map();
  private circuitBreaker: CircuitBreaker;
  private retryManager: RetryManager;

  constructor(config: MessageBrokerConfig = {}) {
    this.circuitBreaker = new CircuitBreaker(config.circuitBreakerConfig);
    this.retryManager = new RetryManager(config.retryConfig);
  }

  async publish(message: Message): Promise<void> {
    const handlers = this.handlers.get(message.topic) || [];
    
    if (handlers.length === 0) {
      console.warn(`No handlers registered for topic: ${message.topic}`);
      return;
    }

    const enrichedMessage = {
      ...message,
      timestamp: message.timestamp || new Date(),
      metadata: {
        ...message.metadata,
        publishedAt: new Date()
      }
    };

    await Promise.all(
      handlers.map(handler =>
        this.circuitBreaker.execute(() =>
          this.retryManager.execute(() =>
            handler(enrichedMessage)
          )
        )
      )
    );
  }

  async subscribe(topic: string, handler: MessageHandler): Promise<void> {
    const existingHandlers = this.handlers.get(topic) || [];
    this.handlers.set(topic, [...existingHandlers, handler]);
  }

  async unsubscribe(topic: string): Promise<void> {
    this.handlers.delete(topic);
  }

  getSubscribedTopics(): string[] {
    return Array.from(this.handlers.keys());
  }

  getHandlersCount(topic: string): number {
    return this.handlers.get(topic)?.length || 0;
  }
} 