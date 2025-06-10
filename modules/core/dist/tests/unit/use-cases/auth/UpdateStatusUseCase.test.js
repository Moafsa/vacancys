"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateStatusUseCase_1 = require("../../../../application/use-cases/auth/UpdateStatusUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
const Status_1 = require("../../../../domain/entities/Status");
describe('UpdateStatusUseCase', () => {
    let updateStatusUseCase;
    let userRepository;
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
        updateStatusUseCase = new UpdateStatusUseCase_1.UpdateStatusUseCase(userRepository, emailService, config);
    });
    it('should successfully update user status', async () => {
        const userId = '1';
        const status = Status_1.Status.ACTIVE;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            status: UserStatus_1.UserStatus.ACTIVE
        });
        await updateStatusUseCase.execute(userId, status);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(userRepository.update).toHaveBeenCalledWith(userId, {
            status: UserStatus_1.UserStatus.ACTIVE
        });
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            to: mockUser.email,
            from: config.email.from,
            subject: 'Account Status Updated',
            html: expect.stringContaining('account has been activated')
        });
    });
    it('should throw error when user is not found', async () => {
        const userId = '1';
        const status = Status_1.Status.ACTIVE;
        userRepository.findById.mockResolvedValue(null);
        await expect(updateStatusUseCase.execute(userId, status))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when status is invalid', async () => {
        const userId = '1';
        const status = 'INVALID_STATUS';
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        await expect(updateStatusUseCase.execute(userId, status))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid status', 'INVALID_STATUS', 400));
    });
    it('should throw error when user update fails', async () => {
        const userId = '1';
        const status = Status_1.Status.ACTIVE;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockRejectedValue(new Error('Database error'));
        await expect(updateStatusUseCase.execute(userId, status))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error updating user status', 'STATUS_UPDATE_ERROR', 500));
    });
    it('should throw error when email sending fails', async () => {
        const userId = '1';
        const status = Status_1.Status.ACTIVE;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            status: UserStatus_1.UserStatus.ACTIVE
        });
        emailService.sendEmail.mockRejectedValue(new Error('Email sending failed'));
        await expect(updateStatusUseCase.execute(userId, status))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error sending status update email', 'EMAIL_SENDING_ERROR', 500));
    });
    it('should send appropriate email for inactive status', async () => {
        const userId = '1';
        const status = Status_1.Status.INACTIVE;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            status: UserStatus_1.UserStatus.INACTIVE
        });
        await updateStatusUseCase.execute(userId, status);
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            to: mockUser.email,
            from: config.email.from,
            subject: 'Account Status Updated',
            html: expect.stringContaining('account has been deactivated')
        });
    });
    it('should send appropriate email for blocked status', async () => {
        const userId = '1';
        const status = Status_1.Status.BLOCKED;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            status: UserStatus_1.UserStatus.BLOCKED
        });
        await updateStatusUseCase.execute(userId, status);
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            to: mockUser.email,
            from: config.email.from,
            subject: 'Account Status Updated',
            html: expect.stringContaining('account has been blocked')
        });
    });
});
