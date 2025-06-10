"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const tsyringe_1 = require("tsyringe");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return tsyringe_1.container; } });
const ioredis_1 = require("ioredis");
const BcryptHashService_1 = require("./services/BcryptHashService");
const JwtTokenService_1 = require("./services/JwtTokenService");
const RedisSessionService_1 = require("./services/RedisSessionService");
const config_1 = require("../config/config");
const redis = new ioredis_1.Redis(config_1.config.redis.url);
tsyringe_1.container.registerInstance('Redis', redis);
tsyringe_1.container.registerSingleton('HashService', BcryptHashService_1.BcryptHashService);
tsyringe_1.container.registerSingleton('TokenService', (container) => {
    const redis = container.resolve('Redis');
    return new JwtTokenService_1.JwtTokenService(config_1.config.jwt.secret, redis);
});
tsyringe_1.container.registerSingleton('SessionService', (container) => {
    const redis = container.resolve('Redis');
    return new RedisSessionService_1.RedisSessionService(redis);
});
//# sourceMappingURL=container.js.map