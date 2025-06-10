"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateProfileUseCase_1 = require("../../../../application/use-cases/auth/UpdateProfileUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
describe('UpdateProfileUseCase', () => {
    let updateProfileUseCase;
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
        updateProfileUseCase = new UpdateProfileUseCase_1.UpdateProfileUseCase(userRepository, emailService, config);
    });
    it('should successfully update user profile', async () => {
        const userId = '1';
        const updateData = {
            name: 'Updated Name',
            email: 'updated@example.com'
        };
        const mockUser = {
            id: userId,
            name: 'Old Name',
            email: 'old@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: userId,
                name: updateData.name,
                email: updateData.email,
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            name: updateData.name,
            email: updateData.email
        });
        const result = await updateProfileUseCase.execute(userId, updateData);
        expect(result).toEqual({
            ...mockUser.toJSON(),
            name: updateData.name,
            email: updateData.email
        });
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(userRepository.findByEmail).toHaveBeenCalledWith(updateData.email);
        expect(userRepository.update).toHaveBeenCalledWith(userId, {
            name: updateData.name,
            email: updateData.email
        });
        expect(emailService.sendEmail).toHaveBeenCalledWith({
            to: updateData.email,
            from: config.email.from,
            subject: 'Email Update Confirmation',
            html: expect.stringContaining(updateData.email)
        });
    });
    it('should throw error when user is not found', async () => {
        const userId = '1';
        const updateData = {
            name: 'Updated Name',
            email: 'updated@example.com'
        };
        userRepository.findById.mockResolvedValue(null);
        await expect(updateProfileUseCase.execute(userId, updateData))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when new email is already in use', async () => {
        const userId = '1';
        const updateData = {
            name: 'Updated Name',
            email: 'existing@example.com'
        };
        const mockUser = {
            id: userId,
            name: 'Old Name',
            email: 'old@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.findByEmail.mockResolvedValue({
            id: '2',
            email: updateData.email,
            name: 'Existing User',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        });
        await expect(updateProfileUseCase.execute(userId, updateData))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Email already in use', 'EMAIL_ALREADY_IN_USE', 400));
    });
    it('should throw error when user account is inactive', async () => {
        const userId = '1';
        const updateData = {
            name: 'Updated Name',
            email: 'updated@example.com'
        };
        const mockUser = {
            id: userId,
            name: 'Old Name',
            email: 'old@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.INACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        await expect(updateProfileUseCase.execute(userId, updateData))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User account is not active', 'USER_INACTIVE', 403));
    });
    it('should throw error when user update fails', async () => {
        const userId = '1';
        const updateData = {
            name: 'Updated Name',
            email: 'updated@example.com'
        };
        const mockUser = {
            id: userId,
            name: 'Old Name',
            email: 'old@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.update.mockRejectedValue(new Error('Database error'));
        await expect(updateProfileUseCase.execute(userId, updateData))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error updating profile', 'PROFILE_UPDATE_ERROR', 500));
    });
    it('should throw error when email sending fails', async () => {
        const userId = '1';
        const updateData = {
            name: 'Updated Name',
            email: 'updated@example.com'
        };
        const mockUser = {
            id: userId,
            name: 'Old Name',
            email: 'old@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            name: updateData.name,
            email: updateData.email
        });
        emailService.sendEmail.mockRejectedValue(new Error('Email sending failed'));
        await expect(updateProfileUseCase.execute(userId, updateData))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error sending confirmation email', 'EMAIL_SENDING_ERROR', 500));
    });
});
//# sourceMappingURL=UpdateProfileUseCase.test.js.map