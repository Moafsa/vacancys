"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestPasswordResetUseCase_1 = require("../../../../application/use-cases/auth/RequestPasswordResetUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
describe('RequestPasswordResetUseCase', () => {
    let requestPasswordResetUseCase;
    let userRepository;
    let jwtTokenService;
    let emailService;
    let config;
    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            countUsers: jest.fn()
        };
        jwtTokenService = {
            generateToken: jest.fn(),
            verifyToken: jest.fn()
        };
        emailService = {
            sendEmail: jest.fn()
        };
        config = {
            app: {
                name: 'Vacancy Service',
                url: 'https://vacancy.service'
            },
            email: {
                from: 'noreply@vacancy.service'
            }
        };
        requestPasswordResetUseCase = new RequestPasswordResetUseCase_1.RequestPasswordResetUseCase(userRepository, jwtTokenService, emailService, config);
    });
    it('should successfully request password reset', async () => {
        const email = 'test@example.com';
        const mockUser = {
            id: '1',
            name: 'Test User',
            email,
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: '1',
                name: 'Test User',
                email,
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        const resetToken = 'valid.reset.token';
        userRepository.findByEmail.mockResolvedValue(mockUser);
        jwtTokenService.generateToken.mockResolvedValue(resetToken);
        await requestPasswordResetUseCase.execute(email);
        expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
        expect(jwtTokenService.generateToken).toHaveBeenCalledWith({
            userId: mockUser.id,
            email: mockUser.email,
            type: 'password_reset'
        });
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            to: email,
            from: config.email.from,
            subject: 'Password Reset Request',
            html: expect.stringContaining(resetToken)
        });
    });
    it('should throw error when user is not found', async () => {
        const email = 'nonexistent@example.com';
        userRepository.findByEmail.mockResolvedValue(null);
        await expect(requestPasswordResetUseCase.execute(email))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when user account is inactive', async () => {
        const email = 'test@example.com';
        const mockUser = {
            id: '1',
            name: 'Test User',
            email,
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.INACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findByEmail.mockResolvedValue(mockUser);
        await expect(requestPasswordResetUseCase.execute(email))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User account is not active', 'USER_INACTIVE', 403));
    });
    it('should throw error when token generation fails', async () => {
        const email = 'test@example.com';
        const mockUser = {
            id: '1',
            name: 'Test User',
            email,
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findByEmail.mockResolvedValue(mockUser);
        jwtTokenService.generateToken.mockRejectedValue(new Error('Token generation failed'));
        await expect(requestPasswordResetUseCase.execute(email))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error generating reset token', 'TOKEN_GENERATION_ERROR', 500));
    });
    it('should throw error when email sending fails', async () => {
        const email = 'test@example.com';
        const mockUser = {
            id: '1',
            name: 'Test User',
            email,
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        const resetToken = 'valid.reset.token';
        userRepository.findByEmail.mockResolvedValue(mockUser);
        jwtTokenService.generateToken.mockResolvedValue(resetToken);
        emailService.sendEmail.mockRejectedValue(new Error('Email sending failed'));
        await expect(requestPasswordResetUseCase.execute(email))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error sending reset email', 'EMAIL_SENDING_ERROR', 500));
    });
});
//# sourceMappingURL=RequestPasswordResetUseCase.test.js.map