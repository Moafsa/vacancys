"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
class RedisService {
    constructor(redis) {
        this.redis = redis;
    }
    async get(key) {
        return this.redis.get(key);
    }
    async set(key, value, expirationInSeconds) {
        await this.redis.setex(key, expirationInSeconds, value);
    }
    async del(key) {
        await this.redis.del(key);
    }
    async exists(key) {
        const result = await this.redis.exists(key);
        return result === 1;
    }
}
exports.RedisService = RedisService;
//# sourceMappingURL=RedisService.js.map