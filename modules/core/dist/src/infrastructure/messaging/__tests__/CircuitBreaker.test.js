"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CircuitBreaker_1 = require("../CircuitBreaker");
describe('CircuitBreaker', () => {
    let circuitBreaker;
    const mockOperation = jest.fn();
    const config = {
        failureThreshold: 2,
        resetTimeout: 1000,
        successThreshold: 2
    };
    beforeEach(() => {
        jest.clearAllMocks();
        circuitBreaker = new CircuitBreaker_1.CircuitBreaker(config);
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    describe('initial state', () => {
        it('should start in CLOSED state', () => {
            expect(circuitBreaker.getState()).toBe(CircuitBreaker_1.CircuitState.CLOSED);
            expect(circuitBreaker.getFailureCount()).toBe(0);
            expect(circuitBreaker.getSuccessCount()).toBe(0);
        });
        it('should use default config when not provided', () => {
            const defaultCircuitBreaker = new CircuitBreaker_1.CircuitBreaker();
            expect(defaultCircuitBreaker.getState()).toBe(CircuitBreaker_1.CircuitState.CLOSED);
        });
    });
    describe('execute', () => {
        it('should execute operation successfully in CLOSED state', async () => {
            mockOperation.mockResolvedValue('success');
            const result = await circuitBreaker.execute(mockOperation);
            expect(result).toBe('success');
            expect(circuitBreaker.getState()).toBe(CircuitBreaker_1.CircuitState.CLOSED);
            expect(circuitBreaker.getFailureCount()).toBe(0);
        });
        it('should handle failures in CLOSED state', async () => {
            mockOperation.mockRejectedValue(new Error('failure'));
            await expect(circuitBreaker.execute(mockOperation))
                .rejects
                .toThrow('failure');
            expect(circuitBreaker.getState()).toBe(CircuitBreaker_1.CircuitState.CLOSED);
            expect(circuitBreaker.getFailureCount()).toBe(1);
        });
        it('should transition to OPEN state after reaching failure threshold', async () => {
            mockOperation.mockRejectedValue(new Error('failure'));
            for (let i = 0; i < config.failureThreshold; i++) {
                await expect(circuitBreaker.execute(mockOperation))
                    .rejects
                    .toThrow('failure');
            }
            expect(circuitBreaker.getState()).toBe(CircuitBreaker_1.CircuitState.OPEN);
        });
        it('should reject requests when in OPEN state', async () => {
            mockOperation.mockRejectedValue(new Error('failure'));
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
            for (let i = 0; i < config.failureThreshold; i++) {
                await expect(circuitBreaker.execute(mockOperation))
                    .rejects
                    .toThrow('failure');
            }
            jest.advanceTimersByTime(config.resetTimeout);
            mockOperation.mockResolvedValue('success');
            await circuitBreaker.execute(mockOperation);
            expect(circuitBreaker.getState()).toBe(CircuitBreaker_1.CircuitState.HALF_OPEN);
        });
        it('should transition to CLOSED state after success threshold in HALF_OPEN state', async () => {
            mockOperation.mockRejectedValue(new Error('failure'));
            for (let i = 0; i < config.failureThreshold; i++) {
                await expect(circuitBreaker.execute(mockOperation))
                    .rejects
                    .toThrow('failure');
            }
            jest.advanceTimersByTime(config.resetTimeout);
            mockOperation.mockResolvedValue('success');
            for (let i = 0; i < config.successThreshold; i++) {
                await circuitBreaker.execute(mockOperation);
            }
            expect(circuitBreaker.getState()).toBe(CircuitBreaker_1.CircuitState.CLOSED);
        });
        it('should transition back to OPEN state on failure in HALF_OPEN state', async () => {
            mockOperation.mockRejectedValue(new Error('failure'));
            for (let i = 0; i < config.failureThreshold; i++) {
                await expect(circuitBreaker.execute(mockOperation))
                    .rejects
                    .toThrow('failure');
            }
            jest.advanceTimersByTime(config.resetTimeout);
            mockOperation.mockResolvedValue('success');
            await circuitBreaker.execute(mockOperation);
            mockOperation.mockRejectedValue(new Error('failure'));
            await expect(circuitBreaker.execute(mockOperation))
                .rejects
                .toThrow('failure');
            expect(circuitBreaker.getState()).toBe(CircuitBreaker_1.CircuitState.OPEN);
        });
    });
    describe('state change notifications', () => {
        it('should notify listeners of state changes', async () => {
            const listener = jest.fn();
            circuitBreaker.onStateChange(listener);
            mockOperation.mockRejectedValue(new Error('failure'));
            for (let i = 0; i < config.failureThreshold; i++) {
                await expect(circuitBreaker.execute(mockOperation))
                    .rejects
                    .toThrow('failure');
            }
            expect(listener).toHaveBeenCalledWith(CircuitBreaker_1.CircuitState.OPEN);
        });
        it('should not notify listeners when state does not change', async () => {
            const listener = jest.fn();
            circuitBreaker.onStateChange(listener);
            mockOperation.mockRejectedValue(new Error('failure'));
            await expect(circuitBreaker.execute(mockOperation))
                .rejects
                .toThrow('failure');
            expect(listener).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=CircuitBreaker.test.js.map