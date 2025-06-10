"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsRouter = void 0;
const express_1 = require("express");
const MetricsController_1 = require("../controllers/MetricsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authMiddleware_2 = require("../middlewares/authMiddleware");
const UserRole_1 = require("../../../domain/entities/UserRole");
const metricsRouter = (0, express_1.Router)();
exports.metricsRouter = metricsRouter;
const metricsController = new MetricsController_1.MetricsController();
metricsRouter.get('/', authMiddleware_1.authMiddleware, (0, authMiddleware_2.authorize)([UserRole_1.UserRole.ADMIN]), metricsController.getMetrics.bind(metricsController));
//# sourceMappingURL=metricsRoutes.js.map