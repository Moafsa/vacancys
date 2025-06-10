"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RetryManager_1 = require("../../../../src/infrastructure/messaging/RetryManager");
const globals_1 = require("@jest/globals");
class TestRetryManager extends RetryManager_1.RetryManager {
    async retryEvent(retryableEvent) {
        return Promise.resolve();
    }
    sendToDeadLetterQueue(event, failureReason) {
    }
    getRetryQueue() {
        return this.retryQueue;
    }
    async testProcessRetryQueue() {
        return this.processRetryQueue();
    }
    getConfig() {
        return this.config;
    }
    testSendToDLQ(event, reason) {
        this.sendToDeadLetterQueue(event, reason);
    }
}
(0, globals_1.describe)('RetryManager', () => {
    let retryManager;
    let mockRetryEvent;
    let mockSendToDLQ;
    let testEvent;
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.useFakeTimers();
        testEvent = {
            type: 'TEST_EVENT',
            payload: { message: 'Test payload' },
            createdAt: new Date()
        };
        retryManager = new TestRetryManager();
        mockRetryEvent = globals_1.jest.fn();
        mockSendToDLQ = globals_1.jest.fn();
        retryManager.retryEvent = mockRetryEvent;
        retryManager.sendToDeadLetterQueue = mockSendToDLQ;
    });
    afterEach(() => {
        globals_1.jest.useRealTimers();
        retryManager.stopProcessing();
    });
    (0, globals_1.test)('should initialize with default config', () => {
        (0, globals_1.expect)(retryManager.getConfig()).toEqual(RetryManager_1.DEFAULT_RETRY_CONFIG);
    });
    (0, globals_1.test)('should enqueue event for retry with initial delay', () => {
        var _a, _b;
        retryManager.enqueueForRetry(testEvent, 'Test error');
        const retryQueue = retryManager.getRetryQueue();
        (0, globals_1.expect)(retryQueue.has('TEST_EVENT')).toBe(true);
        (0, globals_1.expect)((_a = retryQueue.get('TEST_EVENT')) === null || _a === void 0 ? void 0 : _a.length).toBe(1);
        const queueItem = (_b = retryQueue.get('TEST_EVENT')) === null || _b === void 0 ? void 0 : _b[0];
        (0, globals_1.expect)(queueItem === null || queueItem === void 0 ? void 0 : queueItem.event).toEqual(testEvent);
        (0, globals_1.expect)(queueItem === null || queueItem === void 0 ? void 0 : queueItem.failureReason).toBe('Test error');
        (0, globals_1.expect)(queueItem === null || queueItem === void 0 ? void 0 : queueItem.attemptCount).toBe(1);
        (0, globals_1.expect)((queueItem === null || queueItem === void 0 ? void 0 : queueItem.nextRetryAt) instanceof Date).toBe(true);
        (0, globals_1.expect)(queueItem === null || queueItem === void 0 ? void 0 : queueItem.nextRetryAt.getTime()).toBeGreaterThan(Date.now());
    });
    (0, globals_1.test)('should retry event when processing queue and nextRetryTime has passed', async () => {
        retryManager.enqueueForRetry(testEvent, 'Test error');
        globals_1.jest.advanceTimersByTime(RetryManager_1.DEFAULT_RETRY_CONFIG.initialDelayMs + 100);
        await retryManager.testProcessRetryQueue();
        (0, globals_1.expect)(mockRetryEvent).toHaveBeenCalledWith(globals_1.expect.objectContaining({
            event: testEvent,
            attemptCount: 1
        }));
        const retryQueue = retryManager.getRetryQueue();
        (0, globals_1.expect)(retryQueue.size).toBe(0);
    });
    (0, globals_1.test)('should not retry event when nextRetryTime has not yet passed', async () => {
        var _a;
        retryManager.enqueueForRetry(testEvent, 'Test error');
        globals_1.jest.advanceTimersByTime(RetryManager_1.DEFAULT_RETRY_CONFIG.initialDelayMs / 2);
        await retryManager.testProcessRetryQueue();
        (0, globals_1.expect)(mockRetryEvent).not.toHaveBeenCalled();
        const retryQueue = retryManager.getRetryQueue();
        (0, globals_1.expect)((_a = retryQueue.get('TEST_EVENT')) === null || _a === void 0 ? void 0 : _a.length).toBe(1);
    });
    (0, globals_1.test)('should use exponential backoff for retry delays', async () => {
        var _a;
        mockRetryEvent.mockRejectedValue(new Error('Retry failed'));
        retryManager.enqueueForRetry(testEvent, 'Test error');
        globals_1.jest.advanceTimersByTime(RetryManager_1.DEFAULT_RETRY_CONFIG.initialDelayMs + 100);
        await retryManager.testProcessRetryQueue();
        const retryQueue = retryManager.getRetryQueue();
        const event = (_a = retryQueue.get('TEST_EVENT')) === null || _a === void 0 ? void 0 : _a[0];
        (0, globals_1.expect)(event === null || event === void 0 ? void 0 : event.attemptCount).toBe(2);
        const expectedDelay = RetryManager_1.DEFAULT_RETRY_CONFIG.initialDelayMs * RetryManager_1.DEFAULT_RETRY_CONFIG.backoffFactor;
        const actualDelay = (event === null || event === void 0 ? void 0 : event.nextRetryAt.getTime()) - Date.now();
        (0, globals_1.expect)(actualDelay).toBeGreaterThan(expectedDelay - 100);
        (0, globals_1.expect)(actualDelay).toBeLessThan(expectedDelay + 100);
    });
    (0, globals_1.test)('should send event to DLQ after max retries', async () => {
        mockRetryEvent.mockRejectedValue(new Error('Persistent failure'));
        const testRetryManager = new TestRetryManager({
            ...RetryManager_1.DEFAULT_RETRY_CONFIG,
            maxRetries: 2,
            initialDelayMs: 10
        });
        testRetryManager.sendToDeadLetterQueue = mockSendToDLQ;
        testRetryManager.enqueueForRetry(testEvent, 'Persistent failure', 3);
        (0, globals_1.expect)(mockSendToDLQ).toHaveBeenCalledWith(testEvent, 'Persistent failure');
        const retryQueue = testRetryManager.getRetryQueue();
        (0, globals_1.expect)(retryQueue.size).toBe(0);
        testRetryManager.stopProcessing();
    });
    (0, globals_1.test)('should respect maxDelayMs config', async () => {
        var _a;
        const customConfig = {
            ...RetryManager_1.DEFAULT_RETRY_CONFIG,
            maxDelayMs: 5000,
            backoffFactor: 10
        };
        const customRetryManager = new TestRetryManager(customConfig);
        const mockCustomRetryEvent = globals_1.jest.fn().mockRejectedValue(new Error('Retry failed'));
        customRetryManager.retryEvent = mockCustomRetryEvent;
        customRetryManager.enqueueForRetry(testEvent, 'Test error');
        globals_1.jest.advanceTimersByTime(RetryManager_1.DEFAULT_RETRY_CONFIG.initialDelayMs + 100);
        await customRetryManager.testProcessRetryQueue();
        const retryQueue = customRetryManager.getRetryQueue();
        const event = (_a = retryQueue.get('TEST_EVENT')) === null || _a === void 0 ? void 0 : _a[0];
        const nextRetryDelay = (event === null || event === void 0 ? void 0 : event.nextRetryAt.getTime()) - Date.now();
        (0, globals_1.expect)(nextRetryDelay).toBeLessThanOrEqual(customConfig.maxDelayMs + 100);
        (0, globals_1.expect)(nextRetryDelay).toBeGreaterThanOrEqual(customConfig.maxDelayMs - 100);
        customRetryManager.stopProcessing();
    });
});
//# sourceMappingURL=RetryManager.test.js.map