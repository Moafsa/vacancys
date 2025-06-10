"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
const ResilientRedisEventService_1 = require("./ResilientRedisEventService");
const RetryManager_1 = require("./RetryManager");
const CircuitBreaker_1 = require("./CircuitBreaker");
const DeadLetterQueue_1 = require("./DeadLetterQueue");
const MessagingMetrics_1 = require("./MessagingMetrics");
const RedisClient_1 = require("./RedisClient");
class EventEmitter {
    constructor() {
        const redisConfig = {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10)
        };
        this.redisClient = new RedisClient_1.RedisClient(redisConfig);
        const retryManager = new RetryManager_1.RetryManager();
        const circuitBreaker = new CircuitBreaker_1.CircuitBreaker();
        const deadLetterQueue = new DeadLetterQueue_1.DeadLetterQueue(1000);
        this.metrics = new MessagingMetrics_1.MessagingMetrics();
        this.resilientService = new ResilientRedisEventService_1.ResilientRedisEventService(redisConfig, circuitBreaker, retryManager, deadLetterQueue, this.metrics);
        this.handlers = new Map();
        this.startConsuming();
    }
    async startConsuming() {
        await this.redisClient.subscribe('user.*', async (message) => {
            try {
                const payload = JSON.parse(message);
                const channel = 'user.*';
                await this.processEvent(channel, payload);
            }
            catch (error) {
                console.error(`Error processing event:`, error);
            }
        });
    }
    async processEvent(eventName, payload) {
        const handlers = this.handlers.get(eventName) || [];
        const startTime = Date.now();
        for (const handler of handlers) {
            try {
                await handler(payload);
            }
            catch (error) {
                console.error(`Error in handler for event ${eventName}:`, error);
                this.metrics.recordEventFailed(eventName);
            }
        }
        const processingTime = Date.now() - startTime;
        this.metrics.recordEventPublished(eventName, processingTime);
    }
    async emit(eventName, payload) {
        try {
            const startTime = Date.now();
            await this.redisClient.publish(eventName, payload);
            const processingTime = Date.now() - startTime;
            this.metrics.recordEventPublished(eventName, processingTime);
        }
        catch (error) {
            console.error(`Error emitting event ${eventName}:`, error);
            this.metrics.recordEventFailed(eventName);
            throw error;
        }
    }
    on(eventName, handler) {
        const handlers = this.handlers.get(eventName) || [];
        handlers.push(handler);
        this.handlers.set(eventName, handlers);
    }
    off(eventName, handler) {
        const handlers = this.handlers.get(eventName) || [];
        const index = handlers.indexOf(handler);
        if (index !== -1) {
            handlers.splice(index, 1);
            this.handlers.set(eventName, handlers);
        }
    }
    async getMetrics() {
        return this.metrics.getAggregatedMetrics();
    }
    async close() {
        await this.redisClient.disconnect();
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map