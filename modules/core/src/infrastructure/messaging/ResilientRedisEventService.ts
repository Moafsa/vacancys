import { CircuitBreaker, CircuitState } from './CircuitBreaker';
import { RetryManager } from './RetryManager';
import { DeadLetterQueue } from './DeadLetterQueue';
import { MessagingMetrics } from './MessagingMetrics';
import { RedisClient, RedisConfig } from './RedisClient';

interface EventMessage {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
}

export class ResilientRedisEventService {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly retryManager: RetryManager;
  private readonly deadLetterQueue: DeadLetterQueue;
  private readonly metrics: MessagingMetrics;
  private readonly redisClient: RedisClient;

  constructor(
    config: RedisConfig,
    circuitBreaker?: CircuitBreaker,
    retryManager?: RetryManager,
    deadLetterQueue?: DeadLetterQueue,
    metrics?: MessagingMetrics
  ) {
    this.redisClient = new RedisClient(config);
    this.circuitBreaker = circuitBreaker || new CircuitBreaker();
    this.retryManager = retryManager || new RetryManager();
    this.deadLetterQueue = deadLetterQueue || new DeadLetterQueue();
    this.metrics = metrics || new MessagingMetrics();

    // Monitorar mudanças de estado do circuit breaker
    this.circuitBreaker.onStateChange((state: CircuitState) => {
      this.metrics.recordCircuitBreakerStateChange(state);
    });
  }

  async publishEvent(type: string, data: any): Promise<void> {
    const startTime = Date.now();
    const event: EventMessage = {
      id: this.generateEventId(),
      type,
      data,
      timestamp: new Date()
    };

    try {
      await this.circuitBreaker.execute(async () => {
        await this.retryManager.execute(async () => {
          await this.publishToRedis(event);
        });
      });

      const processingTime = Date.now() - startTime;
      this.metrics.recordEventPublished(type, processingTime);
    } catch (error) {
      this.metrics.recordEventFailed(type);
      throw error;
    }
  }

  async subscribeToEvent(
    eventType: string,
    handler: (data: any) => Promise<void>
  ): Promise<void> {
    await this.circuitBreaker.execute(async () => {
      await this.retryManager.execute(async () => {
        await this.subscribeToRedis(eventType, async (event: EventMessage) => {
          const startTime = Date.now();
          try {
            await handler(event.data);
            const processingTime = Date.now() - startTime;
            this.metrics.recordEventPublished(eventType, processingTime);
          } catch (error) {
            this.metrics.recordEventFailed(eventType);
            await this.handleEventError(event, error as Error);
          }
        });
      });
    });
  }

  private async handleEventError(
    event: EventMessage,
    error: Error
  ): Promise<void> {
    this.metrics.recordEventDeadLettered(event.type);
    await this.deadLetterQueue.addMessage(
      event.id,
      event,
      error,
      3, // número de tentativas realizadas
      event.type // nome da fila original
    );
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async publishToRedis(event: EventMessage): Promise<void> {
    await this.redisClient.publish(event.type, event);
  }

  private async subscribeToRedis(
    eventType: string,
    callback: (event: EventMessage) => Promise<void>
  ): Promise<void> {
    await this.redisClient.subscribe(eventType, callback);
  }

  // Métodos para teste e monitoramento
  async getDeadLetterQueueSize(): Promise<number> {
    return this.deadLetterQueue.getSize();
  }

  async getCircuitBreakerState(): Promise<CircuitState> {
    return this.circuitBreaker.getState();
  }

  getMetrics(): MessagingMetrics {
    return this.metrics;
  }

  async disconnect(): Promise<void> {
    await this.redisClient.disconnect();
  }

  async checkHealth(): Promise<{
    redis: boolean;
    circuitBreaker: CircuitState;
    deadLetterQueue: number;
  }> {
    const [redisHealth, circuitBreakerState, dlqSize] = await Promise.all([
      this.redisClient.ping(),
      this.getCircuitBreakerState(),
      this.getDeadLetterQueueSize()
    ]);

    return {
      redis: redisHealth,
      circuitBreaker: circuitBreakerState,
      deadLetterQueue: dlqSize
    };
  }
} 