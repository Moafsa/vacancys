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
        for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
            await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
        }
        expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
        await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service test-service is unavailable');
        expect(mockFn).toHaveBeenCalledTimes(DEFAULT_CIRCUIT_CONFIG.failureThreshold);
    });
    test('should transition to HALF_OPEN state after reset timeout', async () => {
        const mockFn = jest.fn().mockRejectedValue(new Error('failure'));
        for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
            await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
        }
        expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
        jest.advanceTimersByTime(DEFAULT_CIRCUIT_CONFIG.resetTimeout + 100);
        const mockSuccessFn = jest.fn().mockResolvedValue('success');
        await circuitBreaker.execute(mockSuccessFn);
        expect(mockSuccessFn).toHaveBeenCalledTimes(1);
        expect(circuitBreaker.getState()).toBe(CircuitState.HALF_OPEN);
    });
    test('should transition from HALF_OPEN to CLOSED after success threshold is met', async () => {
        const mockFn = jest.fn().mockRejectedValue(new Error('failure'));
        for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
            await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
        }
        expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
        jest.advanceTimersByTime(DEFAULT_CIRCUIT_CONFIG.resetTimeout + 100);
        const mockSuccessFn = jest.fn().mockResolvedValue('success');
        for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.successThreshold; i++) {
            await circuitBreaker.execute(mockSuccessFn);
        }
        expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
    });
    test('should transition from HALF_OPEN back to OPEN on failure', async () => {
        const mockFn = jest.fn().mockRejectedValue(new Error('failure'));
        for (let i = 0; i < DEFAULT_CIRCUIT_CONFIG.failureThreshold; i++) {
            await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
        }
        expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
        jest.advanceTimersByTime(DEFAULT_CIRCUIT_CONFIG.resetTimeout + 100);
        await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('failure');
        expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    });
    test('should handle timeout as a failure', async () => {
        const shortTimeoutCircuit = new CircuitBreaker('test-service', {
            timeoutDuration: 50,
            failureThreshold: 3
        });
        const slowFn = jest.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(resolve, 100, 'late response');
            });
        });
        jest.useRealTimers();
        await expect(shortTimeoutCircuit.execute(slowFn)).rejects.toThrow('timed out');
        await expect(shortTimeoutCircuit.execute(slowFn)).rejects.toThrow('timed out');
        await expect(shortTimeoutCircuit.execute(slowFn)).rejects.toThrow('timed out');
        expect(shortTimeoutCircuit.getState()).toBe(CircuitState.OPEN);
        await expect(shortTimeoutCircuit.execute(slowFn)).rejects.toThrow('Service test-service is unavailable');
        expect(slowFn).toHaveBeenCalledTimes(3);
    }, 30000);
});
//# sourceMappingURL=CircuitBreaker.test.js.map