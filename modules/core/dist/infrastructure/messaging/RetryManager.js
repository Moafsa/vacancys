"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryManager = exports.DEFAULT_RETRY_CONFIG = void 0;
exports.DEFAULT_RETRY_CONFIG = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2
};
class RetryManager {
    constructor(config = {}) {
        if (config.maxAttempts !== undefined && config.maxAttempts <= 0) {
            throw new Error('maxAttempts must be greater than 0');
        }
        if (config.initialDelay !== undefined && config.initialDelay < 0) {
            throw new Error('initialDelay must be greater than or equal to 0');
        }
        if (config.maxDelay !== undefined && config.maxDelay < config.initialDelay) {
            throw new Error('maxDelay must be greater than or equal to initialDelay');
        }
        if (config.backoffFactor !== undefined && config.backoffFactor <= 1) {
            throw new Error('backoffFactor must be greater than 1');
        }
        this.config = { ...exports.DEFAULT_RETRY_CONFIG, ...config };
    }
    async execute(operation) {
        if (!operation || typeof operation !== 'function') {
            throw new Error('Operation must be a function');
        }
        let attempt = 1;
        let delay = this.config.initialDelay;
        while (attempt <= this.config.maxAttempts) {
            try {
                return await operation();
            }
            catch (error) {
                if (attempt === this.config.maxAttempts) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    throw new Error(`Operation failed after ${attempt} attempts. Last error: ${errorMessage}`);
                }
                await this.wait(delay);
                delay = Math.min(delay * this.config.backoffFactor, this.config.maxDelay);
                attempt++;
            }
        }
        throw new Error('Unexpected error: Maximum attempts reached without resolution');
    }
    wait(ms) {
        if (process.env.NODE_ENV === 'test') {
            return Promise.resolve();
        }
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    getConfig() {
        return { ...this.config };
    }
}
exports.RetryManager = RetryManager;
//# sourceMappingURL=RetryManager.js.map