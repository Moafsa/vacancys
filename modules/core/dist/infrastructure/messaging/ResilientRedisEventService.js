"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResilientRedisEventService = void 0;
const CircuitBreaker_1 = require("./CircuitBreaker");
const RetryManager_1 = require("./RetryManager");
const DeadLetterQueue_1 = require("./DeadLetterQueue");
const MessagingMetrics_1 = require("./MessagingMetrics");
const RedisClient_1 = require("./RedisClient");
class ResilientRedisEventService {
    constructor(config, circuitBreaker, retryManager, deadLetterQueue, metrics) {
        this.redisClient = new RedisClient_1.RedisClient(config);
        this.circuitBreaker = circuitBreaker || new CircuitBreaker_1.CircuitBreaker();
        this.retryManager = retryManager || new RetryManager_1.RetryManager();
        this.deadLetterQueue = deadLetterQueue || new DeadLetterQueue_1.DeadLetterQueue();
        this.metrics = metrics || new MessagingMetrics_1.MessagingMetrics();
        this.circuitBreaker.onStateChange((state) => {
            this.metrics.recordCircuitBreakerStateChange(state);
        });
    }
    async publishEvent(type, data) {
        const startTime = Date.now();
        const event = {
            id: this.generateEventId(),
            type,
            data,
            timestamp: new Date()
        };
        try {
            await this.circuitBreaker.execute(async () => {
                await this.retryManager.execute(async () => {
                    await this.publishToRedis(event);
                });
            });
            const processingTime = Date.now() - startTime;
            this.metrics.recordEventPublished(type, processingTime);
        }
        catch (error) {
            this.metrics.recordEventFailed(type);
            throw error;
        }
    }
    async subscribeToEvent(eventType, handler) {
        await this.circuitBreaker.execute(async () => {
            await this.retryManager.execute(async () => {
                await this.subscribeToRedis(eventType, async (event) => {
                    const startTime = Date.now();
                    try {
                        await handler(event.data);
                        const processingTime = Date.now() - startTime;
                        this.metrics.recordEventPublished(eventType, processingTime);
                    }
                    catch (error) {
                        this.metrics.recordEventFailed(eventType);
                        await this.handleEventError(event, error);
                    }
                });
            });
        });
    }
    async handleEventError(event, error) {
        this.metrics.recordEventDeadLettered(event.type);
        await this.deadLetterQueue.addMessage(event.id, event, error, 3, event.type);
    }
    generateEventId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    async publishToRedis(event) {
        await this.redisClient.publish(event.type, event);
    }
    async subscribeToRedis(eventType, callback) {
        await this.redisClient.subscribe(eventType, callback);
    }
    async getDeadLetterQueueSize() {
        return this.deadLetterQueue.getSize();
    }
    async getCircuitBreakerState() {
        return this.circuitBreaker.getState();
    }
    getMetrics() {
        return this.metrics;
    }
    async disconnect() {
        await this.redisClient.disconnect();
    }
    async checkHealth() {
        const [redisHealth, circuitBreakerState, dlqSize] = await Promise.all([
            this.redisClient.ping(),
            this.getCircuitBreakerState(),
            this.getDeadLetterQueueSize()
        ]);
        return {
            redis: redisHealth,
            circuitBreaker: circuitBreakerState,
            deadLetterQueue: dlqSize
        };
    }
}
exports.ResilientRedisEventService = ResilientRedisEventService;
//# sourceMappingURL=ResilientRedisEventService.js.map