"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const MonitoringService_1 = require("@infrastructure/monitoring/MonitoringService");
const Logger_1 = require("@infrastructure/logging/Logger");
class MetricsController {
    async getMetrics(req, res) {
        try {
            const metrics = await MonitoringService_1.monitoringService.getMetrics();
            res.set('Content-Type', 'text/plain');
            res.send(metrics);
        }
        catch (error) {
            Logger_1.logger.error('Error getting metrics:', error);
            res.status(500).json({
                error: {
                    message: 'Error getting metrics',
                    code: 'METRICS_ERROR',
                    statusCode: 500,
                },
            });
        }
    }
}
exports.MetricsController = MetricsController;
//# sourceMappingURL=MetricsController.js.map