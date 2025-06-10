import { MessagingMetrics } from '../MessagingMetrics';

describe('MessagingMetrics', () => {
  let metrics: MessagingMetrics;

  beforeEach(() => {
    metrics = new MessagingMetrics();
  });

  describe('Event Metrics', () => {
    it('should record and retrieve event metrics', () => {
      const eventType = 'test-event';
      
      metrics.recordEventPublished(eventType, 100);
      metrics.recordEventFailed(eventType);
      metrics.recordEventRetried(eventType);
      metrics.recordEventDeadLettered(eventType);

      const eventMetrics = metrics.getEventMetrics(eventType);
      expect(eventMetrics).toBeDefined();
      expect(eventMetrics?.published).toBe(1);
      expect(eventMetrics?.failed).toBe(1);
      expect(eventMetrics?.retried).toBe(1);
      expect(eventMetrics?.deadLettered).toBe(1);
      expect(eventMetrics?.processingTime).toEqual([100]);
    });

    it('should handle multiple events of the same type', () => {
      const eventType = 'test-event';
      
      metrics.recordEventPublished(eventType, 100);
      metrics.recordEventPublished(eventType, 150);
      
      const eventMetrics = metrics.getEventMetrics(eventType);
      expect(eventMetrics?.published).toBe(2);
      expect(eventMetrics?.processingTime).toEqual([100, 150]);
    });

    it('should handle multiple event types', () => {
      metrics.recordEventPublished('type-1', 100);
      metrics.recordEventPublished('type-2', 200);

      const allMetrics = metrics.getAllEventMetrics();
      expect(allMetrics.size).toBe(2);
      expect(allMetrics.get('type-1')?.published).toBe(1);
      expect(allMetrics.get('type-2')?.published).toBe(1);
    });
  });

  describe('Circuit Breaker Metrics', () => {
    it('should record and retrieve circuit breaker state changes', () => {
      metrics.recordCircuitBreakerStateChange('OPEN');
      metrics.recordCircuitBreakerStateChange('HALF_OPEN');
      metrics.recordCircuitBreakerStateChange('CLOSED');

      const changes = metrics.getCircuitBreakerMetrics();
      expect(changes).toHaveLength(3);
      expect(changes[0].count).toBe(1);
      expect(changes[1].count).toBe(2);
      expect(changes[2].count).toBe(3);
    });
  });

  describe('Retry Metrics', () => {
    it('should record and retrieve retry attempts', () => {
      metrics.recordRetryAttempt();
      metrics.recordRetryAttempt();
      metrics.recordRetryAttempt();

      const attempts = metrics.getRetryMetrics();
      expect(attempts).toHaveLength(3);
      expect(attempts[0].count).toBe(1);
      expect(attempts[1].count).toBe(2);
      expect(attempts[2].count).toBe(3);
    });
  });

  describe('Aggregated Metrics', () => {
    it('should calculate aggregated metrics correctly', () => {
      // Configurar alguns dados de teste
      metrics.recordEventPublished('type-1', 100);
      metrics.recordEventPublished('type-1', 200);
      metrics.recordEventFailed('type-1');
      metrics.recordEventRetried('type-1');
      metrics.recordEventDeadLettered('type-1');

      metrics.recordEventPublished('type-2', 150);
      metrics.recordEventFailed('type-2');

      metrics.recordCircuitBreakerStateChange('OPEN');
      metrics.recordRetryAttempt();
      metrics.recordRetryAttempt();

      const aggregated = metrics.getAggregatedMetrics();

      expect(aggregated).toEqual({
        totalEvents: 3,
        totalFailures: 2,
        totalRetries: 1,
        totalDeadLettered: 1,
        circuitBreakerChanges: 1,
        retryAttempts: 2,
        averageProcessingTimes: {
          'type-1': 150, // (100 + 200) / 2
          'type-2': 150
        }
      });
    });
  });

  describe('Cleanup', () => {
    it('should clear old metrics', () => {
      // Adicionar algumas métricas
      metrics.recordEventPublished('test', 100);
      metrics.recordCircuitBreakerStateChange('OPEN');
      metrics.recordRetryAttempt();

      // Definir uma data de corte no futuro
      const cutoffDate = new Date(Date.now() + 1000);

      // Limpar métricas antigas
      metrics.clearOldMetrics(cutoffDate);

      // Verificar se as métricas foram limpas
      expect(metrics.getCircuitBreakerMetrics()).toHaveLength(0);
      expect(metrics.getRetryMetrics()).toHaveLength(0);
    });

    it('should keep recent metrics', () => {
      // Adicionar algumas métricas
      metrics.recordEventPublished('test', 100);
      metrics.recordCircuitBreakerStateChange('OPEN');
      metrics.recordRetryAttempt();

      // Definir uma data de corte no passado
      const cutoffDate = new Date(Date.now() - 1000);

      // Limpar métricas antigas
      metrics.clearOldMetrics(cutoffDate);

      // Verificar se as métricas recentes foram mantidas
      expect(metrics.getCircuitBreakerMetrics()).toHaveLength(1);
      expect(metrics.getRetryMetrics()).toHaveLength(1);
    });
  });
}); 