"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const AuthService_1 = require("../../domain/services/AuthService");
const PrismaUserRepository_1 = require("../../infrastructure/database/PrismaUserRepository");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
const authService = new AuthService_1.AuthService(userRepository);
const authController = new AuthController_1.AuthController(authService);
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/verify-email/:token', (req, res) => authController.verifyEmail(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password/:token', (req, res) => authController.resetPassword(req, res));
//# sourceMappingURL=auth.routes.js.map