"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const inversify_1 = require("inversify");
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
let EmailService = class EmailService {
    constructor(userRepository) {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        this.userRepository = userRepository || new UserRepository_1.UserRepository();
    }
    getUserRepository() {
        return this.userRepository;
    }
    async send(params) {
        const { to, subject, body, template, data } = params;
        let htmlContent = body;
        if (template) {
            htmlContent = await this.processTemplate(template, data || {});
        }
        try {
            await Promise.all(to.map(recipient => this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: recipient,
                subject,
                html: htmlContent,
            })));
        }
        catch (error) {
            throw new Error('Failed to send email');
        }
    }
    async listTemplates() {
        return [
            {
                id: 'welcome',
                name: 'Welcome Email',
                description: 'Template for welcoming new users'
            },
            {
                id: 'reset-password',
                name: 'Reset Password',
                description: 'Template for password reset emails'
            },
            {
                id: 'verification',
                name: 'Email Verification',
                description: 'Template for email verification'
            }
        ];
    }
    async processTemplate(templateId, data) {
        return `Template ${templateId} processed with data: ${JSON.stringify(data)}`;
    }
    async verifyEmail(token) {
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        }
        catch (error) {
            throw new Error('Invalid verification token');
        }
        const user = await this.userRepository.findByEmail(decoded.email);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isEmailVerified) {
            throw new Error('Email is already verified');
        }
        await this.userRepository.update(user.id, {
            isEmailVerified: true
        });
    }
    async resendVerificationEmail(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isEmailVerified) {
            throw new Error('Email already verified');
        }
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET || '', { expiresIn: '24h' });
        await this.send({
            to: [email],
            subject: 'Email Verification',
            body: `Please verify your email by clicking on this link: ${process.env.APP_URL}/verify-email?token=${token}`
        });
    }
    async sendPasswordResetEmail(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        await this.send({
            to: [email],
            subject: 'Password Reset',
            body: `Click this link to reset your password: ${process.env.APP_URL}/reset-password?token=${token}`
        });
    }
    async resetPassword(token, newPassword) {
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        }
        catch (error) {
            throw new Error('Invalid reset token');
        }
        const user = await this.userRepository.findByEmail(decoded.email);
        if (!user) {
            throw new Error('User not found');
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await this.userRepository.update(user.id, {
            password: hashedPassword
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], EmailService);
//# sourceMappingURL=EmailService.js.map