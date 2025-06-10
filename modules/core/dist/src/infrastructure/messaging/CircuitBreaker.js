"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = exports.CircuitState = exports.DEFAULT_CIRCUIT_BREAKER_CONFIG = void 0;
exports.DEFAULT_CIRCUIT_BREAKER_CONFIG = {
    failureThreshold: 5,
    resetTimeout: 60000,
    successThreshold: 2
};
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (exports.CircuitState = CircuitState = {}));
class CircuitBreaker {
    constructor(config = {}) {
        this.config = {
            failureThreshold: config.failureThreshold || 5,
            resetTimeout: config.resetTimeout || 60000,
            successThreshold: config.successThreshold || 2
        };
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = 0;
        this.stateChangeListeners = [];
    }
    async execute(operation) {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() - this.lastFailureTime >= this.config.resetTimeout) {
                this.transitionTo(CircuitState.HALF_OPEN);
            }
            else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        try {
            const result = await operation();
            this.handleSuccess();
            return result;
        }
        catch (error) {
            this.handleFailure();
            throw error;
        }
    }
    handleSuccess() {
        if (this.state === CircuitState.HALF_OPEN) {
            this.successCount++;
            if (this.successCount >= this.config.successThreshold) {
                this.transitionTo(CircuitState.CLOSED);
            }
        }
        else if (this.state === CircuitState.CLOSED) {
            this.failureCount = 0;
            this.successCount = 0;
        }
    }
    handleFailure() {
        this.lastFailureTime = Date.now();
        if (this.state === CircuitState.HALF_OPEN) {
            this.transitionTo(CircuitState.OPEN);
        }
        else if (this.state === CircuitState.CLOSED) {
            this.failureCount++;
            if (this.failureCount >= this.config.failureThreshold) {
                this.transitionTo(CircuitState.OPEN);
            }
        }
    }
    transitionTo(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.notifyStateChange(newState);
            if (newState === CircuitState.CLOSED) {
                this.failureCount = 0;
                this.successCount = 0;
            }
            else if (newState === CircuitState.HALF_OPEN) {
                this.successCount = 0;
            }
        }
    }
    getState() {
        return this.state;
    }
    getFailureCount() {
        return this.failureCount;
    }
    getSuccessCount() {
        return this.successCount;
    }
    onStateChange(listener) {
        this.stateChangeListeners.push(listener);
    }
    notifyStateChange(state) {
        this.stateChangeListeners.forEach(listener => listener(state));
    }
}
exports.CircuitBreaker = CircuitBreaker;
//# sourceMappingURL=CircuitBreaker.js.map