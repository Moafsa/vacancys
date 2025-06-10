// Importar apenas o que é necessário e declarar apenas uma vez
const CircuitBreakerModule = require('../../../../src/infrastructure/messaging/CircuitBreaker');
const CircuitBreaker = CircuitBreakerModule.CircuitBreaker;
const CircuitState = CircuitBreakerModule.CircuitState;
const DEFAULT_CIRCUIT_CONFIG = CircuitBreakerModule.DEFAULT_CIRCUIT_CONFIG;

describe('CircuitBreaker', () => {
  let circuitBreaker;
  
  beforeEach(() => {
    jest.useFakeTimers();
    circuitBreaker = new CircuitBreaker('test-service');
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('should initialize in CLOSED state', () => {
    expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
  });
  
  test('should execute function successfully when circuit is closed', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    
    const result = await circuitBreaker.execute(mockFn);
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
  });
  
  test('should transition to OPEN state after failures exceed threshold', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('failure'));
    
    // Execute the function multiple times to exceed failure threshold
    for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
    }
    
    // Now the circuit should be open
    expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    
    // Next execution should fail without calling the function
    await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service test-service is unavailable');
    expect(mockFn).toHaveBeenCalledTimes(DEFAULT_CIRCUIT_CONFIG.failureThreshold);
  });
  
  test('should transition to HALF_OPEN state after reset timeout', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('failure'));
    
    // Trip the circuit breaker
    for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
    }
    
    expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    
    // Fast forward time to just past the reset timeout
    jest.advanceTimersByTime(DEFAULT_CIRCUIT_CONFIG.resetTimeout + 100);
    
    // Now the circuit should allow one test request
    const mockSuccessFn = jest.fn().mockResolvedValue('success');
    await circuitBreaker.execute(mockSuccessFn);
    
    expect(mockSuccessFn).toHaveBeenCalledTimes(1);
    expect(circuitBreaker.getState()).toBe(CircuitState.HALF_OPEN);
  });
  
  test('should transition from HALF_OPEN to CLOSED after success threshold is met', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('failure'));
    
    // Trip the circuit breaker
    for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
    }
    
    expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    
    // Fast forward time to reset timeout
    jest.advanceTimersByTime(DEFAULT_CIRCUIT_CONFIG.resetTimeout + 100);
    
    // Now execute successful calls to meet success threshold
    const mockSuccessFn = jest.fn().mockResolvedValue('success');
    
    for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.successThreshold; i++) {
      await circuitBreaker.execute(mockSuccessFn);
    }
    
    // Circuit should now be closed
    expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
  });
  
  test('should transition from HALF_OPEN back to OPEN on failure', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('failure'));
    
    // Trip the circuit breaker
    for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
    }
    
    expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    
    // Fast forward time to reset timeout
    jest.advanceTimersByTime(DEFAULT_CIRCUIT_CONFIG.resetTimeout + 100);
    
    // Now the circuit is half-open, but the next call fails
    await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
    
    // Circuit should be open again
    expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
  });
  
  // Este teste foi reestruturado para resolver o problema de timeout
  test('should handle timeout as a failure', async () => {
    // Criar uma instância específica com timeout muito curto para o teste
    const shortTimeoutCircuit = new CircuitBreaker('test-service', {
      timeoutDuration: 50, // 50ms
      failureThreshold: 3  // Reduzir o threshold para acelerar o teste
    });
    
    // Mock de função que demorará mais que o timeout definido
    const slowFn = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, 100, 'late response');
      });
    });
    
    // Desativar os timers falsos para este teste específico para permitir
    // que o timeout real da Promise aconteça
    jest.useRealTimers();
    
    // Executar a função lenta e verificar que ocorre timeout
    await expect(shortTimeoutCircuit.execute(slowFn)).rejects.toThrow('timed out');
    
    // Executar mais vezes para abrir o circuito
    await expect(shortTimeoutCircuit.execute(slowFn)).rejects.toThrow('timed out');
    await expect(shortTimeoutCircuit.execute(slowFn)).rejects.toThrow('timed out');
    
    // Agora o circuito deve estar aberto
    expect(shortTimeoutCircuit.getState()).toBe(CircuitState.OPEN);
    
    // A próxima execução deve falhar sem chamar a função
    await expect(shortTimeoutCircuit.execute(slowFn)).rejects.toThrow('Service test-service is unavailable');
    
    // Verificar que a função foi chamada apenas o número de vezes do threshold
    expect(slowFn).toHaveBeenCalledTimes(3);
  }, 30000); // Aumentar o timeout do Jest para este teste específico
}); 