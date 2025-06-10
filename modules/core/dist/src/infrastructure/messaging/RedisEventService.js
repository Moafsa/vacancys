"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisEventService = void 0;
const redis_1 = require("redis");
const Logger_1 = require("../logging/Logger");
class RedisEventService {
    constructor() {
        this.client = (0, redis_1.createClient)();
        this.subscriber = (0, redis_1.createClient)();
        this.handlers = new Map();
    }
    async connect() {
        try {
            await this.client.connect();
            await this.subscriber.connect();
            Logger_1.logger.info('Connected to Redis');
        }
        catch (error) {
            Logger_1.logger.error('Failed to connect to Redis:', error);
            throw error;
        }
    }
    async disconnect() {
        try {
            await this.client.quit();
            await this.subscriber.quit();
            Logger_1.logger.info('Disconnected from Redis');
        }
        catch (error) {
            Logger_1.logger.error('Failed to disconnect from Redis:', error);
            throw error;
        }
    }
    async publish(event) {
        try {
            const message = JSON.stringify(event);
            await this.client.publish(event.type, message);
            Logger_1.logger.info(`Published event: ${event.type}`);
        }
        catch (error) {
            Logger_1.logger.error('Failed to publish event:', error);
            throw error;
        }
    }
    async subscribe(eventType, handler) {
        try {
            if (!this.handlers.has(eventType)) {
                this.handlers.set(eventType, []);
                await this.subscriber.subscribe(eventType, async (message) => {
                    const event = JSON.parse(message);
                    const handlers = this.handlers.get(eventType) || [];
                    await Promise.all(handlers.map(h => h.handle(event)));
                });
            }
            const handlers = this.handlers.get(eventType) || [];
            handlers.push(handler);
            this.handlers.set(eventType, handlers);
            Logger_1.logger.info(`Subscribed to event: ${eventType}`);
        }
        catch (error) {
            Logger_1.logger.error('Failed to subscribe to event:', error);
            throw error;
        }
    }
    async unsubscribe(eventType, handler) {
        try {
            const handlers = this.handlers.get(eventType);
            if (handlers) {
                const index = handlers.indexOf(handler);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
                if (handlers.length === 0) {
                    this.handlers.delete(eventType);
                    await this.subscriber.unsubscribe(eventType);
                }
            }
            Logger_1.logger.info(`Unsubscribed from event: ${eventType}`);
        }
        catch (error) {
            Logger_1.logger.error(`Failed to unsubscribe from event ${eventType}:`, error);
            throw error;
        }
    }
}
exports.RedisEventService = RedisEventService;
//# sourceMappingURL=RedisEventService.js.map