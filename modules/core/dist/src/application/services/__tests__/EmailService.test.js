"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = require("../EmailService");
const UserRepository_1 = require("../../../infrastructure/repositories/UserRepository");
const User_1 = require("../../../domain/entities/User");
const UserRole_1 = require("../../../domain/enums/UserRole");
const UserStatus_1 = require("../../../domain/enums/UserStatus");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
jest.mock('nodemailer');
jest.mock('../../../infrastructure/repositories/UserRepository');
describe('EmailService', () => {
    let emailService;
    let mockUserRepository;
    let mockTransporter;
    const JWT_SECRET = 'test-secret';
    let originalJwtSecret;
    const anotherMockUser = new User_1.User({
        id: '456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedPassword',
        role: UserRole_1.UserRole.USER,
        status: UserStatus_1.UserStatus.ACTIVE,
        isEmailVerified: false,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    beforeAll(() => {
        originalJwtSecret = process.env.JWT_SECRET;
        process.env.JWT_SECRET = JWT_SECRET;
        process.env.SMTP_HOST = 'smtp.test.com';
        process.env.SMTP_PORT = '587';
        process.env.SMTP_USER = 'test@test.com';
        process.env.SMTP_PASS = 'test123';
        process.env.SMTP_FROM = 'noreply@test.com';
        process.env.APP_URL = 'http://localhost:3000';
    });
    afterAll(() => {
        process.env.JWT_SECRET = originalJwtSecret;
    });
    beforeEach(() => {
        mockTransporter = {
            sendMail: jest.fn().mockResolvedValue(true)
        };
        nodemailer_1.default.createTransport.mockReturnValue(mockTransporter);
        mockUserRepository = new UserRepository_1.UserRepository();
        emailService = new EmailService_1.EmailService(mockUserRepository);
    });
    afterEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = JWT_SECRET;
    });
    describe('Constructor', () => {
        it('should create instance with default SMTP port when not provided', () => {
            delete process.env.SMTP_PORT;
            const service = new EmailService_1.EmailService(mockUserRepository);
            expect(service).toBeDefined();
        });
        it('should create instance with secure SMTP when configured', () => {
            process.env.SMTP_SECURE = 'true';
            const service = new EmailService_1.EmailService(mockUserRepository);
            expect(service).toBeDefined();
            process.env.SMTP_SECURE = 'false';
        });
    });
    describe('getUserRepository', () => {
        it('should return the user repository instance', () => {
            const repository = emailService.getUserRepository();
            expect(repository).toBe(mockUserRepository);
        });
        it('should create a new repository if none was provided in constructor', () => {
            const serviceWithoutRepo = new EmailService_1.EmailService();
            const repository = serviceWithoutRepo.getUserRepository();
            expect(repository).toBeInstanceOf(UserRepository_1.UserRepository);
        });
    });
    describe('verifyEmail', () => {
        it('should verify user email when token is valid', async () => {
            const mockUserRepository = {
                findByEmail: jest.fn().mockResolvedValue(anotherMockUser),
                update: jest.fn().mockResolvedValue(anotherMockUser),
            };
            emailService.userRepository = mockUserRepository;
            const token = jsonwebtoken_1.default.sign({ email: anotherMockUser.email }, JWT_SECRET);
            await emailService.verifyEmail(token);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(anotherMockUser.email);
            expect(mockUserRepository.update).toHaveBeenCalledWith(anotherMockUser.id, {
                isEmailVerified: true
            });
        });
        it('should throw error for invalid token', async () => {
            const invalidToken = 'invalid-token';
            await expect(emailService.verifyEmail(invalidToken)).rejects.toThrow('Invalid verification token');
        });
        it('should throw error for non-existent user', async () => {
            const token = jsonwebtoken_1.default.sign({ email: 'nonexistent@example.com' }, JWT_SECRET);
            mockUserRepository.findByEmail.mockResolvedValue(null);
            await expect(emailService.verifyEmail(token)).rejects.toThrow('User not found');
        });
        it('should throw error when JWT_SECRET is not configured', async () => {
            const originalSecret = process.env.JWT_SECRET;
            delete process.env.JWT_SECRET;
            const token = 'any-token';
            await expect(emailService.verifyEmail(token)).rejects.toThrow('Invalid verification token');
            process.env.JWT_SECRET = originalSecret;
        });
        it('should throw error when email is already verified', async () => {
            const mockUser = new User_1.User({
                id: 'user-id',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed-password',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                isEmailVerified: true,
                lastLoginAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const token = jsonwebtoken_1.default.sign({ email: mockUser.email }, JWT_SECRET);
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            await expect(emailService.verifyEmail(token))
                .rejects.toThrow('Email is already verified');
        });
    });
    describe('resendVerificationEmail', () => {
        it('should resend verification email successfully', async () => {
            const user = new User_1.User({
                id: '123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed_password',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                isEmailVerified: false,
                lastLoginAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockUserRepository.findByEmail.mockResolvedValue(user);
            await emailService.resendVerificationEmail(user.email);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(user.email);
            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: process.env.SMTP_FROM,
                to: user.email,
                subject: 'Email Verification',
                html: expect.stringContaining('/verify-email?token=')
            });
        });
        it('should throw error for non-existent user', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            await expect(emailService.resendVerificationEmail('nonexistent@example.com'))
                .rejects.toThrow('User not found');
        });
        it('should throw error if email is already verified', async () => {
            const verifiedUser = new User_1.User({
                id: '123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed_password',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                isEmailVerified: true,
                lastLoginAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockUserRepository.findByEmail.mockResolvedValue(verifiedUser);
            await expect(emailService.resendVerificationEmail(verifiedUser.email))
                .rejects.toThrow('Email already verified');
        });
    });
    describe('send', () => {
        it('should send email successfully', async () => {
            const emailParams = {
                to: ['test@example.com'],
                subject: 'Test Subject',
                body: 'Test Body'
            };
            await emailService.send(emailParams);
            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: process.env.SMTP_FROM,
                to: emailParams.to[0],
                subject: emailParams.subject,
                html: emailParams.body
            });
        });
        it('should send email to multiple recipients', async () => {
            const emailParams = {
                to: ['test1@example.com', 'test2@example.com'],
                subject: 'Test Subject',
                body: 'Test Body'
            };
            await emailService.send(emailParams);
            expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: process.env.SMTP_FROM,
                to: emailParams.to[0],
                subject: emailParams.subject,
                html: emailParams.body
            });
            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: process.env.SMTP_FROM,
                to: emailParams.to[1],
                subject: emailParams.subject,
                html: emailParams.body
            });
        });
        it('should throw error if sending fails', async () => {
            mockTransporter.sendMail.mockRejectedValue(new Error('Failed to send'));
            const emailParams = {
                to: ['test@example.com'],
                subject: 'Test Subject',
                body: 'Test Body'
            };
            await expect(emailService.send(emailParams)).rejects.toThrow('Failed to send email');
        });
        it('should process template if provided', async () => {
            const emailParams = {
                to: ['test@example.com'],
                subject: 'Test Subject',
                body: 'Test Body',
                template: 'welcome',
                data: { name: 'Test User' }
            };
            await emailService.send(emailParams);
            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: process.env.SMTP_FROM,
                to: emailParams.to[0],
                subject: emailParams.subject,
                html: expect.stringContaining('welcome')
            });
        });
    });
    describe('listTemplates', () => {
        it('should return list of available templates', async () => {
            const templates = await emailService.listTemplates();
            expect(templates).toEqual([
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
            ]);
        });
    });
    describe('sendPasswordResetEmail', () => {
        it('should send password reset email successfully', async () => {
            const user = new User_1.User({
                id: '123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashed_password',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                isEmailVerified: true,
                lastLoginAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockUserRepository.findByEmail.mockResolvedValue(user);
            await emailService.sendPasswordResetEmail(user.email);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(user.email);
            expect(mockTransporter.sendMail).toHaveBeenCalledWith({
                from: process.env.SMTP_FROM,
                to: user.email,
                subject: 'Password Reset',
                html: expect.stringContaining('/reset-password?token=')
            });
        });
        it('should throw error for non-existent user', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            await expect(emailService.sendPasswordResetEmail('nonexistent@example.com'))
                .rejects.toThrow('User not found');
        });
    });
    describe('resetPassword', () => {
        it('should reset password successfully', async () => {
            const user = new User_1.User({
                id: '123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'old_password',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                isEmailVerified: true,
                lastLoginAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const token = jsonwebtoken_1.default.sign({ email: user.email }, JWT_SECRET);
            mockUserRepository.findByEmail.mockResolvedValue(user);
            mockUserRepository.update.mockResolvedValue(user);
            await emailService.resetPassword(token, 'new_password');
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(user.email);
            expect(mockUserRepository.update).toHaveBeenCalledWith(user.id, {
                password: expect.any(String)
            });
        });
        it('should throw error for invalid token', async () => {
            await expect(emailService.resetPassword('invalid-token', 'new_password'))
                .rejects.toThrow('Invalid reset token');
        });
        it('should throw error for non-existent user', async () => {
            const token = jsonwebtoken_1.default.sign({ email: 'nonexistent@example.com' }, JWT_SECRET);
            mockUserRepository.findByEmail.mockResolvedValue(null);
            await expect(emailService.resetPassword(token, 'new_password'))
                .rejects.toThrow('User not found');
        });
    });
});
//# sourceMappingURL=EmailService.test.js.map