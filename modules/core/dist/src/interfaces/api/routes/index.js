"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statusRoutes_1 = require("./statusRoutes");
const userRoutes_1 = require("./userRoutes");
const EventRoutes_1 = __importDefault(require("./EventRoutes"));
const testRoutes_1 = __importDefault(require("./testRoutes"));
const router = (0, express_1.Router)();
router.use('/status', statusRoutes_1.statusRouter);
router.use('/users', userRoutes_1.userRouter);
router.use('/events', EventRoutes_1.default);
router.use('/test', testRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map