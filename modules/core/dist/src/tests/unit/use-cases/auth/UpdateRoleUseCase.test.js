"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateRoleUseCase_1 = require("../../../../application/use-cases/auth/UpdateRoleUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
const Role_1 = require("../../../../domain/entities/Role");
describe('UpdateRoleUseCase', () => {
    let updateRoleUseCase;
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
        updateRoleUseCase = new UpdateRoleUseCase_1.UpdateRoleUseCase(userRepository, emailService, config);
    });
    it('should successfully update user role', async () => {
        const userId = '1';
        const role = Role_1.Role.RECRUITER;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
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
        userRepository.update.mockResolvedValue({
            ...mockUser,
            role: UserRole_1.UserRole.RECRUITER
        });
        await updateRoleUseCase.execute(userId, role);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(userRepository.update).toHaveBeenCalledWith(userId, {
            role: UserRole_1.UserRole.RECRUITER
        });
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            to: mockUser.email,
            from: config.email.from,
            subject: 'Role Update Confirmation',
            html: expect.stringContaining('role has been updated')
        });
    });
    it('should throw error when user is not found', async () => {
        const userId = '1';
        const role = Role_1.Role.RECRUITER;
        userRepository.findById.mockResolvedValue(null);
        await expect(updateRoleUseCase.execute(userId, role))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when role is invalid', async () => {
        const userId = '1';
        const role = 'INVALID_ROLE';
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
        await expect(updateRoleUseCase.execute(userId, role))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid role', 'INVALID_ROLE', 400));
    });
    it('should throw error when user account is inactive', async () => {
        const userId = '1';
        const role = Role_1.Role.RECRUITER;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.INACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        await expect(updateRoleUseCase.execute(userId, role))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User account is not active', 'USER_INACTIVE', 403));
    });
    it('should throw error when user update fails', async () => {
        const userId = '1';
        const role = Role_1.Role.RECRUITER;
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
        userRepository.update.mockRejectedValue(new Error('Database error'));
        await expect(updateRoleUseCase.execute(userId, role))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error updating user role', 'ROLE_UPDATE_ERROR', 500));
    });
    it('should throw error when email sending fails', async () => {
        const userId = '1';
        const role = Role_1.Role.RECRUITER;
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
            role: UserRole_1.UserRole.RECRUITER
        });
        emailService.sendEmail.mockRejectedValue(new Error('Email sending failed'));
        await expect(updateRoleUseCase.execute(userId, role))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error sending role update email', 'EMAIL_SENDING_ERROR', 500));
    });
    it('should update role to admin', async () => {
        const userId = '1';
        const role = Role_1.Role.ADMIN;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.RECRUITER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            role: UserRole_1.UserRole.ADMIN
        });
        await updateRoleUseCase.execute(userId, role);
        expect(userRepository.update).toHaveBeenCalledWith(userId, {
            role: UserRole_1.UserRole.ADMIN
        });
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            to: mockUser.email,
            from: config.email.from,
            subject: 'Role Update Confirmation',
            html: expect.stringContaining('role has been updated to Administrator')
        });
    });
    it('should update role to user', async () => {
        const userId = '1';
        const role = Role_1.Role.USER;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.RECRUITER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            role: UserRole_1.UserRole.USER
        });
        await updateRoleUseCase.execute(userId, role);
        expect(userRepository.update).toHaveBeenCalledWith(userId, {
            role: UserRole_1.UserRole.USER
        });
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            to: mockUser.email,
            from: config.email.from,
            subject: 'Role Update Confirmation',
            html: expect.stringContaining('role has been updated to User')
        });
    });
});
//# sourceMappingURL=UpdateRoleUseCase.test.js.map