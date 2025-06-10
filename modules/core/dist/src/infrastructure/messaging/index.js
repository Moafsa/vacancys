"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeEventService = exports.eventService = exports.DeadLetterQueue = exports.DEFAULT_RETRY_CONFIG = exports.RetryManager = exports.CircuitState = exports.CircuitBreaker = exports.ResilientRedisEventService = exports.RedisEventService = void 0;
const RedisEventService_1 = require("./RedisEventService");
Object.defineProperty(exports, "RedisEventService", { enumerable: true, get: function () { return RedisEventService_1.RedisEventService; } });
const ResilientRedisEventService_1 = require("./ResilientRedisEventService");
Object.defineProperty(exports, "ResilientRedisEventService", { enumerable: true, get: function () { return ResilientRedisEventService_1.ResilientRedisEventService; } });
const CircuitBreaker_1 = require("./CircuitBreaker");
Object.defineProperty(exports, "CircuitBreaker", { enumerable: true, get: function () { return CircuitBreaker_1.CircuitBreaker; } });
Object.defineProperty(exports, "CircuitState", { enumerable: true, get: function () { return CircuitBreaker_1.CircuitState; } });
const RetryManager_1 = require("./RetryManager");
Object.defineProperty(exports, "RetryManager", { enumerable: true, get: function () { return RetryManager_1.RetryManager; } });
Object.defineProperty(exports, "DEFAULT_RETRY_CONFIG", { enumerable: true, get: function () { return RetryManager_1.DEFAULT_RETRY_CONFIG; } });
const DeadLetterQueue_1 = require("./DeadLetterQueue");
Object.defineProperty(exports, "DeadLetterQueue", { enumerable: true, get: function () { return DeadLetterQueue_1.DeadLetterQueue; } });
const Logger_1 = require("../logging/Logger");
exports.eventService = new ResilientRedisEventService_1.ResilientRedisEventService();
exports.default = ResilientRedisEventService_1.ResilientRedisEventService;
const initializeEventService = async () => {
    try {
        await exports.eventService.connect();
        Logger_1.logger.info('Serviço de eventos inicializado com sucesso');
        return exports.eventService;
    }
    catch (error) {
        Logger_1.logger.error('Erro ao inicializar serviço de eventos:', error);
        throw error;
    }
};
exports.initializeEventService = initializeEventService;
//# sourceMappingURL=index.js.map