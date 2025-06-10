"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paginationMiddleware_1 = require("../middlewares/paginationMiddleware");
const router = express_1.default.Router();
router.get('/pagination-test', paginationMiddleware_1.paginationMiddleware, (req, res) => {
    const mockEvents = Array.from({ length: 25 }, (_, i) => ({
        id: `event-${i}`,
        originalEvent: {
            type: 'TEST_EVENT',
            payload: { message: `Test message ${i}` },
            createdAt: new Date().toISOString()
        },
        failureReason: 'Test failure',
        attemptCount: 5,
        lastAttemptAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
    }));
    const { page, limit, skip } = req.pagination;
    const paginatedEvents = mockEvents.slice(skip, skip + limit);
    const paginationMeta = {
        total: mockEvents.length,
        page,
        limit,
        pages: Math.ceil(mockEvents.length / limit),
        hasNext: page * limit < mockEvents.length,
        hasPrev: page > 1
    };
    res.status(200).json({
        status: 'success',
        data: {
            events: paginatedEvents,
            count: paginatedEvents.length
        },
        pagination: paginationMeta
    });
});
exports.default = router;
//# sourceMappingURL=testRoutes.js.map