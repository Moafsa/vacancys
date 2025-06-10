"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const events_1 = require("events");
class RedisClient {
    constructor(config) {
        if (typeof window !== 'undefined') {
            throw new Error('RedisClient cannot be used in the browser');
        }
        this.publisher = new ioredis_1.default(config);
        this.subscriber = new ioredis_1.default(config);
        this.eventEmitter = new events_1.EventEmitter();
        this.eventEmitter.setMaxListeners(0);
        this.subscriber.on('message', (channel, message) => {
            try {
                const parsedMessage = JSON.parse(message);
                this.eventEmitter.emit(channel, parsedMessage);
            }
            catch (error) {
                console.error(`Error parsing message from Redis: ${error}`);
            }
        });
    }
    async publish(channel, message) {
        if (!channel || typeof channel !== 'string') {
            throw new Error('Channel must be a non-empty string');
        }
        try {
            const serializedMessage = JSON.stringify(message);
            await this.publisher.publish(channel, serializedMessage);
        }
        catch (error) {
            throw new Error(`Failed to publish message: ${error}`);
        }
    }
    async subscribe(channel, callback) {
        if (!channel || typeof channel !== 'string') {
            throw new Error('Channel must be a non-empty string');
        }
        if (!callback || typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }
        try {
            await this.subscriber.subscribe(channel);
            this.eventEmitter.on(channel, callback);
        }
        catch (error) {
            throw new Error(`Failed to subscribe to channel: ${error}`);
        }
    }
    async unsubscribe(channel) {
        if (!channel || typeof channel !== 'string') {
            throw new Error('Channel must be a non-empty string');
        }
        try {
            await this.subscriber.unsubscribe(channel);
            this.eventEmitter.removeAllListeners(channel);
        }
        catch (error) {
            throw new Error(`Failed to unsubscribe from channel: ${error}`);
        }
    }
    async disconnect() {
        try {
            const results = await Promise.allSettled([
                this.publisher.quit(),
                this.subscriber.quit()
            ]);
            this.eventEmitter.removeAllListeners();
            const errors = results
                .filter((r) => r.status === 'rejected')
                .map(r => r.reason);
            if (errors.length > 0) {
                throw new Error('Disconnect failed');
            }
        }
        catch (error) {
            throw new Error('Disconnect failed');
        }
    }
    async ping() {
        try {
            const result = await this.publisher.ping();
            return result === 'PONG';
        }
        catch (_a) {
            return false;
        }
    }
    getStatus() {
        return {
            publisherStatus: this.publisher.status,
            subscriberStatus: this.subscriber.status
        };
    }
}
exports.RedisClient = RedisClient;
//# sourceMappingURL=RedisClient.js.map