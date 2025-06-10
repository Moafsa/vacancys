"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailRoutes = void 0;
const express_1 = require("express");
const EmailService_1 = require("../../../application/services/EmailService");
const auth_1 = require("../middleware/auth");
const UserRole_1 = require("../../../domain/enums/UserRole");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
class EmailRoutes {
    constructor(emailService, userRepository) {
        this.router = (0, express_1.Router)();
        this.emailService = emailService || new EmailService_1.EmailService();
        this.userRepository = userRepository;
        const repository = userRepository || this.emailService.getUserRepository();
        this.validateToken = (0, auth_1.createValidateToken)(repository);
        this.setupRoutes();
    }
    setupRoutes() {
        this.router.post('/send', (0, validate_1.validate)(zod_1.z.object({
            to: zod_1.z.array(zod_1.z.string().email()),
            subject: zod_1.z.string(),
            body: zod_1.z.string(),
            template: zod_1.z.string().optional(),
            data: zod_1.z.record(zod_1.z.any()).optional()
        })), this.validateToken, (0, auth_1.requireRole)([UserRole_1.UserRole.ADMIN]), this.sendEmail.bind(this));
        this.router.get('/templates', this.validateToken, (0, auth_1.requireRole)([UserRole_1.UserRole.ADMIN]), this.listTemplates.bind(this));
        this.router.post('/verify', this.verifyEmail.bind(this));
        this.router.post('/resend-verification', this.resendVerificationEmail.bind(this));
        this.router.post('/forgot-password', this.forgotPassword.bind(this));
        this.router.post('/reset-password', this.resetPassword.bind(this));
    }
    getRouter() {
        return this.router;
    }
    async verifyEmail(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                throw new Error('Invalid verification token');
            }
            await this.emailService.verifyEmail(token);
            res.status(200).json({ message: 'Email verified successfully' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async resendVerificationEmail(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                throw new Error('Email is required');
            }
            await this.emailService.resendVerificationEmail(email);
            res.status(200).json({ message: 'Verification email sent successfully' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                throw new Error('Email is required');
            }
            await this.emailService.sendPasswordResetEmail(email);
            res.status(200).json({ message: 'Password reset email sent successfully' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                throw new Error('Token and new password are required');
            }
            await this.emailService.resetPassword(token, newPassword);
            res.status(200).json({ message: 'Password reset successfully' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async sendEmail(req, res) {
        try {
            const { to, subject, body, template, data } = req.body;
            await this.emailService.send({
                to: Array.isArray(to) ? to : [to],
                subject,
                body,
                template,
                data
            });
            res.status(200).json({ message: 'Email sent successfully' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async listTemplates(req, res) {
        try {
            const templates = await this.emailService.listTemplates();
            res.json(templates);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.EmailRoutes = EmailRoutes;
//# sourceMappingURL=emailRoutes.js.map