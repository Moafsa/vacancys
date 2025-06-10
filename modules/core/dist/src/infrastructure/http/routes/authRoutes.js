"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const AuthService_1 = require("../../../application/services/AuthService");
const auth_1 = require("../middleware/auth");
const UserRole_1 = require("../../../domain/enums/UserRole");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
class AuthRoutes {
    constructor(authService, userRepository) {
        this.register = async (req, res) => {
            try {
                const { name, email, password } = req.body;
                const user = await this.authService.register({ name, email, password });
                res.status(201).json(user.toJSON());
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const response = await this.authService.login(email, password);
                res.json(response);
            }
            catch (error) {
                res.status(401).json({ error: error.message });
            }
        };
        this.verifyEmail = async (req, res) => {
            try {
                const { userId } = req.body;
                await this.authService.verifyEmail(userId);
                res.json({ message: 'Email verified successfully' });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.requestPasswordReset = async (req, res) => {
            try {
                const { email } = req.body;
                await this.authService.resetPassword(email);
                res.json({ message: 'Password reset email sent' });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.confirmPasswordReset = async (req, res) => {
            try {
                const { token } = req.body;
                await this.authService.validateToken(token);
                res.json({ message: 'Password reset successful' });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.adminRoute = async (req, res) => {
            res.json({ message: 'Admin route accessed successfully' });
        };
        this.router = (0, express_1.Router)();
        this.authService = authService || new AuthService_1.AuthService();
        this.userRepository = userRepository || this.authService.getUserRepository();
        this.validateToken = (0, auth_1.createValidateToken)(this.userRepository);
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.post('/login', (0, validate_1.validate)(zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6)
        })), async (req, res) => {
            try {
                const { email, password } = req.body;
                const result = await this.authService.login(email, password);
                res.json(result);
            }
            catch (error) {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
        this.router.post('/register', (0, validate_1.validate)(zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
            name: zod_1.z.string().min(2)
        })), async (req, res) => {
            try {
                const { email, password, name } = req.body;
                const registerData = { email, password, name };
                const user = await this.authService.register(registerData);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.router.post('/verify-email', this.verifyEmail);
        this.router.post('/reset-password/request', this.requestPasswordReset);
        this.router.post('/reset-password/confirm', this.confirmPasswordReset);
        this.router.get('/admin', this.validateToken, (0, auth_1.requireRole)([UserRole_1.UserRole.ADMIN]), this.adminRoute);
        this.router.get('/me', this.validateToken, async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ error: 'User not authenticated' });
                }
                const user = await this.userRepository.findById(req.user.userId);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                return res.json(user.toJSON());
            }
            catch (error) {
                console.error('Error getting user profile:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=authRoutes.js.map