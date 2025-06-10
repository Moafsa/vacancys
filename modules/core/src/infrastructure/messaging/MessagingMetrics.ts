interface MetricValue {
  count: number;
  timestamp: Date;
}

interface EventMetrics {
  published: number;
  failed: number;
  retried: number;
  deadLettered: number;
  processingTime: number[];
}

export class MessagingMetrics {
  private metrics: Map<string, EventMetrics>;
  private circuitBreakerStateChanges: MetricValue[];
  private retryAttempts: MetricValue[];

  constructor() {
    this.metrics = new Map();
    this.circuitBreakerStateChanges = [];
    this.retryAttempts = [];
  }

  // Métricas de Eventos
  recordEventPublished(eventType: string, processingTime: number): void {
    this.initializeEventMetrics(eventType);
    const metrics = this.metrics.get(eventType)!;
    metrics.published++;
    metrics.processingTime.push(processingTime);
  }

  recordEventFailed(eventType: string): void {
    this.initializeEventMetrics(eventType);
    const metrics = this.metrics.get(eventType)!;
    metrics.failed++;
  }

  recordEventRetried(eventType: string): void {
    this.initializeEventMetrics(eventType);
    const metrics = this.metrics.get(eventType)!;
    metrics.retried++;
  }

  recordEventDeadLettered(eventType: string): void {
    this.initializeEventMetrics(eventType);
    const metrics = this.metrics.get(eventType)!;
    metrics.deadLettered++;
  }

  // Métricas do Circuit Breaker
  recordCircuitBreakerStateChange(state: string): void {
    this.circuitBreakerStateChanges.push({
      count: this.circuitBreakerStateChanges.length + 1,
      timestamp: new Date()
    });
  }

  // Métricas de Retry
  recordRetryAttempt(): void {
    this.retryAttempts.push({
      count: this.retryAttempts.length + 1,
      timestamp: new Date()
    });
  }

  // Métodos de Consulta
  getEventMetrics(eventType: string): EventMetrics | undefined {
    return this.metrics.get(eventType);
  }

  getAllEventMetrics(): Map<string, EventMetrics> {
    return new Map(this.metrics);
  }

  getCircuitBreakerMetrics(): MetricValue[] {
    return [...this.circuitBreakerStateChanges];
  }

  getRetryMetrics(): MetricValue[] {
    return [...this.retryAttempts];
  }

  // Métricas Agregadas
  getAggregatedMetrics(): Record<string, any> {
    const totalEvents = Array.from(this.metrics.values()).reduce(
      (acc, metrics) => acc + metrics.published,
      0
    );

    const totalFailures = Array.from(this.metrics.values()).reduce(
      (acc, metrics) => acc + metrics.failed,
      0
    );

    const totalRetries = Array.from(this.metrics.values()).reduce(
      (acc, metrics) => acc + metrics.retried,
      0
    );

    const totalDeadLettered = Array.from(this.metrics.values()).reduce(
      (acc, metrics) => acc + metrics.deadLettered,
      0
    );

    const averageProcessingTimes = new Map<string, number>();
    this.metrics.forEach((metrics, eventType) => {
      if (metrics.processingTime.length > 0) {
        const average = metrics.processingTime.reduce((a, b) => a + b, 0) / metrics.processingTime.length;
        averageProcessingTimes.set(eventType, average);
      }
    });

    return {
      totalEvents,
      totalFailures,
      totalRetries,
      totalDeadLettered,
      circuitBreakerChanges: this.circuitBreakerStateChanges.length,
      retryAttempts: this.retryAttempts.length,
      averageProcessingTimes: Object.fromEntries(averageProcessingTimes)
    };
  }

  // Utilitários
  private initializeEventMetrics(eventType: string): void {
    if (!this.metrics.has(eventType)) {
      this.metrics.set(eventType, {
        published: 0,
        failed: 0,
        retried: 0,
        deadLettered: 0,
        processingTime: []
      });
    }
  }

  // Limpar métricas antigas
  clearOldMetrics(olderThan: Date): void {
    this.circuitBreakerStateChanges = this.circuitBreakerStateChanges.filter(
      metric => metric.timestamp > olderThan
    );
    
    this.retryAttempts = this.retryAttempts.filter(
      metric => metric.timestamp > olderThan
    );

    // Limpar tempos de processamento antigos
    this.metrics.forEach(metrics => {
      metrics.processingTime = metrics.processingTime.slice(-1000); // Manter apenas os últimos 1000 registros
    });
  }
} 