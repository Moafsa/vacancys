"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdatePasswordUseCase_1 = require("../../../../application/use-cases/auth/UpdatePasswordUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
describe('UpdatePasswordUseCase', () => {
    let updatePasswordUseCase;
    let userRepository;
    let passwordHashService;
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
        passwordHashService = {
            hash: jest.fn(),
            compare: jest.fn()
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
        updatePasswordUseCase = new UpdatePasswordUseCase_1.UpdatePasswordUseCase(userRepository, passwordHashService, emailService, config);
    });
    it('should successfully update user password', async () => {
        const userId = '1';
        const currentPassword = 'currentPassword123!';
        const newPassword = 'newPassword123!';
        const hashedNewPassword = 'hashedNewPassword123';
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedCurrentPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findById.mockResolvedValue(mockUser);
        passwordHashService.compare.mockResolvedValue(true);
        passwordHashService.hash.mockResolvedValue(hashedNewPassword);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            password: hashedNewPassword
        });
        await updatePasswordUseCase.execute(userId, currentPassword, newPassword);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(passwordHashService.compare).toHaveBeenCalledWith(currentPassword, mockUser.password);
        expect(passwordHashService.hash).toHaveBeenCalledWith(newPassword);
        expect(userRepository.update).toHaveBeenCalledWith(userId, {
            password: hashedNewPassword
        });
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            to: mockUser.email,
            from: config.email.from,
            subject: 'Password Update Confirmation',
            html: expect.stringContaining('password has been updated')
        });
    });
    it('should throw error when user is not found', async () => {
        const userId = '1';
        const currentPassword = 'currentPassword123!';
        const newPassword = 'newPassword123!';
        userRepository.findById.mockResolvedValue(null);
        await expect(updatePasswordUseCase.execute(userId, currentPassword, newPassword))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when current password is incorrect', async () => {
        const userId = '1';
        const currentPassword = 'wrongPassword';
        const newPassword = 'newPassword123!';
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedCurrentPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        passwordHashService.compare.mockResolvedValue(false);
        await expect(updatePasswordUseCase.execute(userId, currentPassword, newPassword))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Current password is incorrect', 'INVALID_CURRENT_PASSWORD', 400));
    });
    it('should throw error when user account is inactive', async () => {
        const userId = '1';
        const currentPassword = 'currentPassword123!';
        const newPassword = 'newPassword123!';
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedCurrentPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.INACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        await expect(updatePasswordUseCase.execute(userId, currentPassword, newPassword))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User account is not active', 'USER_INACTIVE', 403));
    });
    it('should throw error when new password is invalid', async () => {
        const userId = '1';
        const currentPassword = 'currentPassword123!';
        const newPassword = 'weak';
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedCurrentPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        passwordHashService.compare.mockResolvedValue(true);
        await expect(updatePasswordUseCase.execute(userId, currentPassword, newPassword))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid password format', 'INVALID_PASSWORD', 400));
    });
    it('should throw error when password hashing fails', async () => {
        const userId = '1';
        const currentPassword = 'currentPassword123!';
        const newPassword = 'newPassword123!';
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedCurrentPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        passwordHashService.compare.mockResolvedValue(true);
        passwordHashService.hash.mockRejectedValue(new Error('Hashing failed'));
        await expect(updatePasswordUseCase.execute(userId, currentPassword, newPassword))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error hashing password', 'PASSWORD_HASH_ERROR', 500));
    });
    it('should throw error when user update fails', async () => {
        const userId = '1';
        const currentPassword = 'currentPassword123!';
        const newPassword = 'newPassword123!';
        const hashedNewPassword = 'hashedNewPassword123';
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedCurrentPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        passwordHashService.compare.mockResolvedValue(true);
        passwordHashService.hash.mockResolvedValue(hashedNewPassword);
        userRepository.update.mockRejectedValue(new Error('Database error'));
        await expect(updatePasswordUseCase.execute(userId, currentPassword, newPassword))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error updating password', 'PASSWORD_UPDATE_ERROR', 500));
    });
    it('should throw error when email sending fails', async () => {
        const userId = '1';
        const currentPassword = 'currentPassword123!';
        const newPassword = 'newPassword123!';
        const hashedNewPassword = 'hashedNewPassword123';
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedCurrentPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        passwordHashService.compare.mockResolvedValue(true);
        passwordHashService.hash.mockResolvedValue(hashedNewPassword);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            password: hashedNewPassword
        });
        emailService.sendEmail.mockRejectedValue(new Error('Email sending failed'));
        await expect(updatePasswordUseCase.execute(userId, currentPassword, newPassword))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error sending confirmation email', 'EMAIL_SENDING_ERROR', 500));
    });
});
//# sourceMappingURL=UpdatePasswordUseCase.test.js.map