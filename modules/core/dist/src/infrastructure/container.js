"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const tsyringe_1 = require("tsyringe");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return tsyringe_1.container; } });
const ioredis_1 = require("ioredis");
const BcryptHashService_1 = require("./services/BcryptHashService");
const JwtTokenServiceImpl_1 = require("./services/JwtTokenServiceImpl");
const RedisSessionService_1 = require("./services/RedisSessionService");
const RedisService_1 = require("./services/RedisService");
const config_1 = require("../config/config");
const redis = new ioredis_1.Redis(config_1.config.redis.url);
tsyringe_1.container.registerInstance('Redis', redis);
tsyringe_1.container.registerSingleton('HashService', BcryptHashService_1.BcryptHashService);
tsyringe_1.container.registerSingleton('RedisService', (container) => {
    const redis = container.resolve('Redis');
    return new RedisService_1.RedisService(redis);
});
tsyringe_1.container.registerSingleton('TokenService', (container) => {
    const redisService = container.resolve('RedisService');
    return new JwtTokenServiceImpl_1.JwtTokenServiceImpl(config_1.config, redisService);
});
tsyringe_1.container.registerSingleton('SessionService', (container) => {
    const redis = container.resolve('Redis');
    return new RedisSessionService_1.RedisSessionService(redis);
});
//# sourceMappingURL=container.js.map