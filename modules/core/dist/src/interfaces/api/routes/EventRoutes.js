"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRouter = void 0;
const express_1 = require("express");
const EventsController_1 = require("../EventsController");
const paginationMiddleware_1 = require("../middlewares/paginationMiddleware");
exports.eventsRouter = (0, express_1.Router)();
const eventsController = new EventsController_1.EventsController();
exports.eventsRouter.get('/metrics', eventsController.getMetrics);
exports.eventsRouter.get('/dlq/types', eventsController.getDeadLetterQueueEventTypes);
exports.eventsRouter.get('/dlq/:eventType', paginationMiddleware_1.paginationMiddleware, eventsController.getDeadLetterQueueEvents);
exports.eventsRouter.post('/dlq/:eventType/:eventId/reprocess', eventsController.reprocessDeadLetterQueueEvent);
exports.eventsRouter.delete('/dlq/:eventType', eventsController.purgeDeadLetterQueueEvents);
exports.default = exports.eventsRouter;
//# sourceMappingURL=EventRoutes.js.map