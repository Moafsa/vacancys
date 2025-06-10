import { CircuitBreaker, CircuitState } from '../CircuitBreaker';

describe('CircuitBreaker', () => {
  let circuitBreaker: CircuitBreaker;
  const mockOperation = jest.fn();
  const config = {
    failureThreshold: 2,
    resetTimeout: 1000,
    successThreshold: 2
  };

  beforeEach(() => {
    jest.clearAllMocks();
    circuitBreaker = new CircuitBreaker(config);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should start in CLOSED state', () => {
      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
      expect(circuitBreaker.getFailureCount()).toBe(0);
      expect(circuitBreaker.getSuccessCount()).toBe(0);
    });

    it('should use default config when not provided', () => {
      const defaultCircuitBreaker = new CircuitBreaker();
      expect(defaultCircuitBreaker.getState()).toBe(CircuitState.CLOSED);
    });
  });

  describe('execute', () => {
    it('should execute operation successfully in CLOSED state', async () => {
      mockOperation.mockResolvedValue('success');
      
      const result = await circuitBreaker.execute(mockOperation);
      
      expect(result).toBe('success');
      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
      expect(circuitBreaker.getFailureCount()).toBe(0);
    });

    it('should handle failures in CLOSED state', async () => {
      mockOperation.mockRejectedValue(new Error('failure'));
      
      await expect(circuitBreaker.execute(mockOperation))
        .rejects
        .toThrow('failure');
      
      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
      expect(circuitBreaker.getFailureCount()).toBe(1);
    });

    it('should transition to OPEN state after reaching failure threshold', async () => {
      mockOperation.mockRejectedValue(new Error('failure'));
      
      for (let i = 0; i < config.failureThreshold; i++) {
        await expect(circuitBreaker.execute(mockOperation))
          .rejects
          .toThrow('failure');
      }
      
      expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    });

    it('should reject requests when in OPEN state', async () => {
      mockOperation.mockRejectedValue(new Error('failure'));
      
      // Force circuit to OPEN state
      for (let i = 0; i < config.failureThreshold; i++) {
        await expect(circuitBreaker.execute(mockOperation))
          .rejects
          .toThrow('failure');
      }
      
      await expect(circuitBreaker.execute(mockOperation))
        .rejects
        .toThrow('Circuit breaker is OPEN');
    });

    it('should transition to HALF_OPEN state after reset timeout', async () => {
      mockOperation.mockRejectedValue(new Error('failure'));
      
      // Force circuit to OPEN state
      for (let i = 0; i < config.failureThreshold; i++) {
        await expect(circuitBreaker.execute(mockOperation))
          .rejects
          .toThrow('failure');
      }
      
      // Advance time past reset timeout
      jest.advanceTimersByTime(config.resetTimeout);
      
      mockOperation.mockResolvedValue('success');
      await circuitBreaker.execute(mockOperation);
      
      expect(circuitBreaker.getState()).toBe(CircuitState.HALF_OPEN);
    });

    it('should transition to CLOSED state after success threshold in HALF_OPEN state', async () => {
      mockOperation.mockRejectedValue(new Error('failure'));
      
      // Force circuit to OPEN state
      for (let i = 0; i < config.failureThreshold; i++) {
        await expect(circuitBreaker.execute(mockOperation))
          .rejects
          .toThrow('failure');
      }
      
      // Advance time past reset timeout
      jest.advanceTimersByTime(config.resetTimeout);
      
      mockOperation.mockResolvedValue('success');
      
      // Execute successful operations to meet success threshold
      for (let i = 0; i < config.successThreshold; i++) {
        await circuitBreaker.execute(mockOperation);
      }
      
      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
    });

    it('should transition back to OPEN state on failure in HALF_OPEN state', async () => {
      mockOperation.mockRejectedValue(new Error('failure'));
      
      // Force circuit to OPEN state
      for (let i = 0; i < config.failureThreshold; i++) {
        await expect(circuitBreaker.execute(mockOperation))
          .rejects
          .toThrow('failure');
      }
      
      // Advance time past reset timeout
      jest.advanceTimersByTime(config.resetTimeout);
      
      // Execute operation to transition to HALF_OPEN
      mockOperation.mockResolvedValue('success');
      await circuitBreaker.execute(mockOperation);
      
      // Fail in HALF_OPEN state
      mockOperation.mockRejectedValue(new Error('failure'));
      await expect(circuitBreaker.execute(mockOperation))
        .rejects
        .toThrow('failure');
      
      expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    });
  });

  describe('state change notifications', () => {
    it('should notify listeners of state changes', async () => {
      const listener = jest.fn();
      circuitBreaker.onStateChange(listener);
      
      mockOperation.mockRejectedValue(new Error('failure'));
      
      // Force circuit to OPEN state
      for (let i = 0; i < config.failureThreshold; i++) {
        await expect(circuitBreaker.execute(mockOperation))
          .rejects
          .toThrow('failure');
      }
      
      expect(listener).toHaveBeenCalledWith(CircuitState.OPEN);
    });

    it('should not notify listeners when state does not change', async () => {
      const listener = jest.fn();
      circuitBreaker.onStateChange(listener);
      
      mockOperation.mockRejectedValue(new Error('failure'));
      
      // Single failure should not change state
      await expect(circuitBreaker.execute(mockOperation))
        .rejects
        .toThrow('failure');
      
      expect(listener).not.toHaveBeenCalled();
    });
  });
}); 