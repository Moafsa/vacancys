"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RetryManager_1 = require("../RetryManager");
describe('RetryManager', () => {
    let retryManager;
    const mockOperation = jest.fn();
    const defaultConfig = {
        maxAttempts: 3,
        initialDelay: 100,
        maxDelay: 1000,
        backoffFactor: 2
    };
    beforeEach(() => {
        jest.clearAllMocks();
        retryManager = new RetryManager_1.RetryManager(defaultConfig);
    });
    describe('constructor validation', () => {
        it('should throw error for invalid maxAttempts', () => {
            expect(() => new RetryManager_1.RetryManager({ maxAttempts: 0 }))
                .toThrow('maxAttempts must be greater than 0');
            expect(() => new RetryManager_1.RetryManager({ maxAttempts: -1 }))
                .toThrow('maxAttempts must be greater than 0');
        });
        it('should throw error for invalid initialDelay', () => {
            expect(() => new RetryManager_1.RetryManager({ initialDelay: -1 }))
                .toThrow('initialDelay must be greater than or equal to 0');
        });
        it('should throw error for invalid maxDelay', () => {
            expect(() => new RetryManager_1.RetryManager({ initialDelay: 1000, maxDelay: 500 }))
                .toThrow('maxDelay must be greater than or equal to initialDelay');
        });
        it('should throw error for invalid backoffFactor', () => {
            expect(() => new RetryManager_1.RetryManager({ backoffFactor: 1 }))
                .toThrow('backoffFactor must be greater than 1');
            expect(() => new RetryManager_1.RetryManager({ backoffFactor: 0.5 }))
                .toThrow('backoffFactor must be greater than 1');
        });
        it('should accept valid configuration', () => {
            const config = new RetryManager_1.RetryManager(defaultConfig).getConfig();
            expect(config).toEqual(defaultConfig);
        });
    });
    describe('execute', () => {
        it('should throw error for invalid operation', async () => {
            await expect(retryManager.execute(null))
                .rejects.toThrow('Operation must be a function');
            await expect(retryManager.execute(undefined))
                .rejects.toThrow('Operation must be a function');
            await expect(retryManager.execute('not a function'))
                .rejects.toThrow('Operation must be a function');
        });
        it('should execute operation successfully on first attempt', async () => {
            mockOperation.mockResolvedValueOnce('success');
            const result = await retryManager.execute(mockOperation);
            expect(result).toBe('success');
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });
        it('should retry operation on failure and succeed eventually', async () => {
            mockOperation
                .mockRejectedValueOnce(new Error('First failure'))
                .mockRejectedValueOnce(new Error('Second failure'))
                .mockResolvedValueOnce('success');
            const result = await retryManager.execute(mockOperation);
            expect(result).toBe('success');
            expect(mockOperation).toHaveBeenCalledTimes(3);
        });
        it('should throw error after max attempts with last error message', async () => {
            const error = new Error('Persistent failure');
            mockOperation.mockRejectedValue(error);
            await expect(retryManager.execute(mockOperation))
                .rejects.toThrow('Operation failed after 3 attempts. Last error: Persistent failure');
            expect(mockOperation).toHaveBeenCalledTimes(3);
        });
        it('should handle non-Error objects in rejection', async () => {
            mockOperation.mockRejectedValue('string error');
            await expect(retryManager.execute(mockOperation))
                .rejects.toThrow('Operation failed after 3 attempts. Last error: string error');
            expect(mockOperation).toHaveBeenCalledTimes(3);
        });
        it('should respect maxDelay when calculating next delay', async () => {
            const customConfig = {
                maxAttempts: 3,
                initialDelay: 1000,
                maxDelay: 1500,
                backoffFactor: 2
            };
            const customRetryManager = new RetryManager_1.RetryManager(customConfig);
            mockOperation
                .mockRejectedValueOnce(new Error('First failure'))
                .mockRejectedValueOnce(new Error('Second failure'))
                .mockResolvedValueOnce('success');
            await customRetryManager.execute(mockOperation);
            expect(mockOperation).toHaveBeenCalledTimes(3);
        });
        it('should handle undefined error message', async () => {
            mockOperation.mockRejectedValue(undefined);
            await expect(retryManager.execute(mockOperation))
                .rejects.toThrow('Operation failed after 3 attempts. Last error: undefined');
            expect(mockOperation).toHaveBeenCalledTimes(3);
        });
        it('should handle null error message', async () => {
            mockOperation.mockRejectedValue(null);
            await expect(retryManager.execute(mockOperation))
                .rejects.toThrow('Operation failed after 3 attempts. Last error: null');
            expect(mockOperation).toHaveBeenCalledTimes(3);
        });
        it('should throw specific error when maximum attempts are reached', async () => {
            const error = new Error('Persistent failure');
            mockOperation.mockRejectedValue(error);
            try {
                await retryManager.execute(mockOperation);
                fail('Should have thrown an error');
            }
            catch (e) {
                expect(e.message).toBe('Operation failed after 3 attempts. Last error: Persistent failure');
            }
            expect(mockOperation).toHaveBeenCalledTimes(3);
        });
    });
    describe('getConfig', () => {
        it('should return a copy of the config', () => {
            const config = retryManager.getConfig();
            expect(config).toEqual(defaultConfig);
            expect(config).not.toBe(defaultConfig);
        });
        it('should merge partial config with defaults', () => {
            const partialConfig = { maxAttempts: 5 };
            const manager = new RetryManager_1.RetryManager(partialConfig);
            const config = manager.getConfig();
            expect(config.maxAttempts).toBe(5);
            expect(config.initialDelay).toBe(RetryManager_1.DEFAULT_RETRY_CONFIG.initialDelay);
            expect(config.maxDelay).toBe(RetryManager_1.DEFAULT_RETRY_CONFIG.maxDelay);
            expect(config.backoffFactor).toBe(RetryManager_1.DEFAULT_RETRY_CONFIG.backoffFactor);
        });
    });
    describe('wait', () => {
        it('should resolve immediately in test environment', async () => {
            const startTime = Date.now();
            await retryManager.wait(5000);
            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(100);
        });
        it('should wait for specified time in non-test environment', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            const startTime = Date.now();
            await retryManager.wait(100);
            const endTime = Date.now();
            expect(endTime - startTime).toBeGreaterThanOrEqual(100);
            process.env.NODE_ENV = originalEnv;
        });
    });
    describe('default config', () => {
        it('should use default config when no config is provided', () => {
            const manager = new RetryManager_1.RetryManager();
            const config = manager.getConfig();
            expect(config).toEqual(RetryManager_1.DEFAULT_RETRY_CONFIG);
        });
        it('should handle empty object config', () => {
            const manager = new RetryManager_1.RetryManager({});
            const config = manager.getConfig();
            expect(config).toEqual(RetryManager_1.DEFAULT_RETRY_CONFIG);
        });
    });
});
//# sourceMappingURL=RetryManager.test.js.map