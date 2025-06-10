"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const config_1 = __importDefault(require("@config/config"));
const errorHandler_1 = require("./middlewares/errorHandler");
const Logger_1 = require("@infrastructure/logging/Logger");
const metricsMiddleware_1 = require("./middlewares/metricsMiddleware");
const metricsRoutes_1 = require("./routes/metricsRoutes");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const requestLogger_1 = require("../../infrastructure/middlewares/requestLogger");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: config_1.default.server.nodeEnv === 'development' ? '*' : [/vacancy\.service$/, /localhost/],
        credentials: true,
    }));
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use(Logger_1.httpLogger);
    app.use(requestLogger_1.requestLogger);
    if (config_1.default.monitoring.enabled) {
        app.use(metricsMiddleware_1.metricsMiddleware);
    }
    app.use('/api/core', routes_1.default);
    if (config_1.default.monitoring.enabled) {
        app.use('/api/core/metrics', metricsRoutes_1.metricsRouter);
    }
    app.use(errorHandler_1.errorHandler);
    app.use('*', (req, res) => {
        res.status(404).json({
            status: 'error',
            message: 'Rota não encontrada',
        });
    });
    app.use((err, req, res, next) => {
        console.error(`[ERROR] ${err.stack}`);
        res.status(err.status || 500).json({
            status: 'error',
            message: err.message || 'Erro interno do servidor',
            ...(config_1.default.server.nodeEnv === 'development' && { stack: err.stack }),
        });
    });
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map