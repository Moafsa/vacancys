"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResilientMessageBroker = void 0;
const CircuitBreaker_1 = require("./CircuitBreaker");
const RetryManager_1 = require("./RetryManager");
class ResilientMessageBroker {
    constructor(config = {}) {
        this.handlers = new Map();
        this.circuitBreaker = new CircuitBreaker_1.CircuitBreaker(config.circuitBreakerConfig);
        this.retryManager = new RetryManager_1.RetryManager(config.retryConfig);
    }
    async publish(message) {
        const handlers = this.handlers.get(message.topic) || [];
        if (handlers.length === 0) {
            console.warn(`No handlers registered for topic: ${message.topic}`);
            return;
        }
        const enrichedMessage = {
            ...message,
            timestamp: message.timestamp || new Date(),
            metadata: {
                ...message.metadata,
                publishedAt: new Date()
            }
        };
        await Promise.all(handlers.map(handler => this.circuitBreaker.execute(() => this.retryManager.execute(() => handler(enrichedMessage)))));
    }
    async subscribe(topic, handler) {
        const existingHandlers = this.handlers.get(topic) || [];
        this.handlers.set(topic, [...existingHandlers, handler]);
    }
    async unsubscribe(topic) {
        this.handlers.delete(topic);
    }
    getSubscribedTopics() {
        return Array.from(this.handlers.keys());
    }
    getHandlersCount(topic) {
        var _a;
        return ((_a = this.handlers.get(topic)) === null || _a === void 0 ? void 0 : _a.length) || 0;
    }
}
exports.ResilientMessageBroker = ResilientMessageBroker;
//# sourceMappingURL=MessageBroker.js.map