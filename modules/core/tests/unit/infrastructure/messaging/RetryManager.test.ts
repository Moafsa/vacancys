import { RetryManager, RetryableEvent, DEFAULT_RETRY_CONFIG } from '../../../../src/infrastructure/messaging/RetryManager';
import { Event } from '../../../../src/domain/events/Event';
import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { sleep } from '../../../utils/testUtils';

// Create a concrete implementation of RetryManager for testing
class TestRetryManager extends RetryManager {
  // Override protected methods with mocks
  protected async retryEvent(retryableEvent: RetryableEvent): Promise<void> {
    // This will be mocked in tests
    return Promise.resolve();
  }
  
  protected sendToDeadLetterQueue(event: Event, failureReason: string): void {
    // This will be mocked in tests
  }
  
  // Expose private methods for testing
  public getRetryQueue(): Map<string, RetryableEvent[]> {
    return (this as any).retryQueue;
  }
  
  public async testProcessRetryQueue(): Promise<void> {
    return (this as any).processRetryQueue();
  }
  
  public getConfig(): typeof DEFAULT_RETRY_CONFIG {
    return (this as any).config;
  }

  // Method to directly test sendToDeadLetterQueue
  public testSendToDLQ(event: Event, reason: string): void {
    this.sendToDeadLetterQueue(event, reason);
  }
}

describe('RetryManager', () => {
  let retryManager: TestRetryManager;
  let mockRetryEvent: jest.Mock;
  let mockSendToDLQ: jest.Mock;
  let testEvent: Event;
  
  beforeEach(() => {
    jest.useFakeTimers();
    
    // Create test event
    testEvent = {
      type: 'TEST_EVENT',
      payload: { message: 'Test payload' },
      createdAt: new Date()
    };
    
    retryManager = new TestRetryManager();
    
    // Mock the protected methods
    mockRetryEvent = jest.fn();
    mockSendToDLQ = jest.fn();
    
    // Replace the protected methods with mocks
    (retryManager as any).retryEvent = mockRetryEvent;
    (retryManager as any).sendToDeadLetterQueue = mockSendToDLQ;
  });
  
  afterEach(() => {
    jest.useRealTimers();
    retryManager.stopProcessing();
  });
  
  test('should initialize with default config', () => {
    expect(retryManager.getConfig()).toEqual(DEFAULT_RETRY_CONFIG);
  });
  
  test('should enqueue event for retry with initial delay', () => {
    retryManager.enqueueForRetry(testEvent, 'Test error');
    
    // Check if event was added to the queue
    const retryQueue = retryManager.getRetryQueue();
    expect(retryQueue.has('TEST_EVENT')).toBe(true);
    expect(retryQueue.get('TEST_EVENT')?.length).toBe(1);
    
    // Verify queue item properties
    const queueItem = retryQueue.get('TEST_EVENT')?.[0];
    expect(queueItem?.event).toEqual(testEvent);
    expect(queueItem?.failureReason).toBe('Test error');
    expect(queueItem?.attemptCount).toBe(1);
    expect(queueItem?.nextRetryAt instanceof Date).toBe(true);
    expect(queueItem?.nextRetryAt.getTime()).toBeGreaterThan(Date.now());
  });
  
  test('should retry event when processing queue and nextRetryTime has passed', async () => {
    retryManager.enqueueForRetry(testEvent, 'Test error');
    
    // Fast forward past the initial delay
    jest.advanceTimersByTime(DEFAULT_RETRY_CONFIG.initialDelayMs + 100);
    
    // Process the queue
    await retryManager.testProcessRetryQueue();
    
    // Verify retry was attempted
    expect(mockRetryEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: testEvent,
        attemptCount: 1
      })
    );
    
    // Queue should be empty after successful retry
    const retryQueue = retryManager.getRetryQueue();
    expect(retryQueue.size).toBe(0);
  });
  
  test('should not retry event when nextRetryTime has not yet passed', async () => {
    retryManager.enqueueForRetry(testEvent, 'Test error');
    
    // Fast forward, but not enough to reach nextRetryTime
    jest.advanceTimersByTime(DEFAULT_RETRY_CONFIG.initialDelayMs / 2);
    
    // Process the queue
    await retryManager.testProcessRetryQueue();
    
    // Verify retry was not attempted
    expect(mockRetryEvent).not.toHaveBeenCalled();
    
    // Event should still be in queue
    const retryQueue = retryManager.getRetryQueue();
    expect(retryQueue.get('TEST_EVENT')?.length).toBe(1);
  });
  
  test('should use exponential backoff for retry delays', async () => {
    // Mock retry to fail so we can test multiple retries
    mockRetryEvent.mockRejectedValue(new Error('Retry failed'));
    
    // First attempt
    retryManager.enqueueForRetry(testEvent, 'Test error');
    
    // First retry
    jest.advanceTimersByTime(DEFAULT_RETRY_CONFIG.initialDelayMs + 100);
    await retryManager.testProcessRetryQueue();
    
    // After a failed retry, the event should be re-enqueued with attempt count = 2
    const retryQueue = retryManager.getRetryQueue();
    const event = retryQueue.get('TEST_EVENT')?.[0];
    expect(event?.attemptCount).toBe(2);
    
    // The delay should be calculated using the backoff factor
    const expectedDelay = DEFAULT_RETRY_CONFIG.initialDelayMs * DEFAULT_RETRY_CONFIG.backoffFactor;
    const actualDelay = event?.nextRetryAt.getTime() - Date.now();
    
    // Allow some small margin for test execution time
    expect(actualDelay).toBeGreaterThan(expectedDelay - 100);
    expect(actualDelay).toBeLessThan(expectedDelay + 100);
  });
  
  test('should send event to DLQ after max retries', async () => {
    // Esta abordagem é mais direta: testar a lógica de envio quando maxRetries é excedido
    // Mock retry to fail
    mockRetryEvent.mockRejectedValue(new Error('Persistent failure'));
    
    // Criar um RetryManager com max retries pequeno para o teste
    const testRetryManager = new TestRetryManager({
      ...DEFAULT_RETRY_CONFIG,
      maxRetries: 2,
      initialDelayMs: 10 // Delay muito pequeno para acelerar o teste
    });
    (testRetryManager as any).sendToDeadLetterQueue = mockSendToDLQ;
    
    // Chamamos diretamente com attemptCount > maxRetries (simulando o evento já ter falhado várias vezes)
    testRetryManager.enqueueForRetry(testEvent, 'Persistent failure', 3); // attemptCount > maxRetries (2)
    
    // Verificar que sendToDeadLetterQueue foi chamado com os argumentos corretos
    expect(mockSendToDLQ).toHaveBeenCalledWith(
      testEvent,
      'Persistent failure'
    );
    
    // Garantir que o evento não foi adicionado à fila de retry
    const retryQueue = testRetryManager.getRetryQueue();
    expect(retryQueue.size).toBe(0);
    
    // Limpar
    testRetryManager.stopProcessing();
  });
  
  test('should respect maxDelayMs config', async () => {
    // Create retry manager with small maxDelayMs and large backoff factor
    const customConfig = {
      ...DEFAULT_RETRY_CONFIG,
      maxDelayMs: 5000, // 5 seconds max
      backoffFactor: 10  // Large factor to hit max quickly
    };
    
    const customRetryManager = new TestRetryManager(customConfig);
    
    // Mock the retryEvent method
    const mockCustomRetryEvent = jest.fn().mockRejectedValue(new Error('Retry failed'));
    (customRetryManager as any).retryEvent = mockCustomRetryEvent;
    
    // Initial enqueue with attempt 1
    customRetryManager.enqueueForRetry(testEvent, 'Test error');
    
    // First retry, will fail and re-enqueue with attempt 2
    jest.advanceTimersByTime(DEFAULT_RETRY_CONFIG.initialDelayMs + 100);
    await customRetryManager.testProcessRetryQueue();
    
    // Get the queue items
    const retryQueue = customRetryManager.getRetryQueue();
    const event = retryQueue.get('TEST_EVENT')?.[0];
    
    // Second retry delay (using attempt 2) should be capped by maxDelayMs
    // Initial delay * backoff factor^1 = 1000 * 10^1 = 10000ms
    // This exceeds maxDelayMs (5000ms), so should be capped
    const nextRetryDelay = event?.nextRetryAt.getTime() - Date.now();
    
    // Verify delay is capped at maxDelayMs (with small margin for test execution)
    expect(nextRetryDelay).toBeLessThanOrEqual(customConfig.maxDelayMs + 100);
    expect(nextRetryDelay).toBeGreaterThanOrEqual(customConfig.maxDelayMs - 100);
    
    // Clean up
    customRetryManager.stopProcessing();
  });
}); 