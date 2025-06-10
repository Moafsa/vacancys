"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = void 0;
const MonitoringService_1 = require("../../../infrastructure/monitoring/MonitoringService");
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : req.path;
        MonitoringService_1.monitoringService.observeHttpRequest(req.method, route, res.statusCode, duration);
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
//# sourceMappingURL=metricsMiddleware.js.map