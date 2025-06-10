"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusRouter = void 0;
const express_1 = require("express");
const StatusController_1 = require("../controllers/StatusController");
const PrismaClient_1 = require("../../../infrastructure/database/PrismaClient");
const statusRouter = (0, express_1.Router)();
exports.statusRouter = statusRouter;
const statusController = new StatusController_1.StatusController(PrismaClient_1.prisma);
statusRouter.get('/', statusController.serveStatusPage.bind(statusController));
statusRouter.get('/json', statusController.getStatus.bind(statusController));
statusRouter.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
//# sourceMappingURL=statusRoutes.js.map