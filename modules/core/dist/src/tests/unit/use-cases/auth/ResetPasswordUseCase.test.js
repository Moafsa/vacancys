"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResetPasswordUseCase_1 = require("../../../../application/use-cases/auth/ResetPasswordUseCase");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
describe('ResetPasswordUseCase', () => {
    let resetPasswordUseCase;
    let userRepository;
    let passwordHashService;
    let jwtTokenService;
    beforeEach(() => {
        userRepository = {
            findById: jest.fn(),
            update: jest.fn()
        };
        passwordHashService = {
            hash: jest.fn(),
            compare: jest.fn()
        };
        jwtTokenService = {
            verifyToken: jest.fn()
        };
        resetPasswordUseCase = new ResetPasswordUseCase_1.ResetPasswordUseCase(userRepository, passwordHashService, jwtTokenService);
    });
    it('should reset password successfully', async () => {
        const token = 'valid-token';
        const newPassword = 'new-password';
        const hashedNewPassword = 'hashed-new-password';
        const userId = 'user-id';
        const email = 'user@example.com';
        const decodedToken = {
            userId,
            email,
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE
        };
        const mockUser = new User_1.UserEntity(userId, 'Test User', email, 'old-password', UserRole_1.UserRole.USER, UserStatus_1.UserStatus.ACTIVE, new Date(), new Date());
        jwtTokenService.verifyToken.mockResolvedValue(decodedToken);
        userRepository.findById.mockResolvedValue(mockUser);
        passwordHashService.hash.mockResolvedValue(hashedNewPassword);
        userRepository.update.mockResolvedValue(new User_1.UserEntity(userId, 'Test User', email, hashedNewPassword, UserRole_1.UserRole.USER, UserStatus_1.UserStatus.ACTIVE, new Date(), new Date()));
        await resetPasswordUseCase.execute(token, newPassword);
        expect(jwtTokenService.verifyToken).toHaveBeenCalledWith(token);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(passwordHashService.hash).toHaveBeenCalledWith(newPassword);
        expect(userRepository.update).toHaveBeenCalledWith(userId, {
            password: hashedNewPassword
        });
    });
    it('should throw error if token is invalid', async () => {
        const token = 'invalid-token';
        const newPassword = 'new-password';
        jwtTokenService.verifyToken.mockRejectedValue(new Error('Invalid token'));
        await expect(resetPasswordUseCase.execute(token, newPassword)).rejects.toThrow(new ApplicationError_1.ApplicationError('INVALID_TOKEN', 'Invalid or expired token', 401));
    });
    it('should throw error if user not found', async () => {
        const token = 'valid-token';
        const newPassword = 'new-password';
        const userId = 'user-id';
        const email = 'user@example.com';
        const decodedToken = {
            userId,
            email,
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE
        };
        jwtTokenService.verifyToken.mockResolvedValue(decodedToken);
        userRepository.findById.mockResolvedValue(null);
        await expect(resetPasswordUseCase.execute(token, newPassword)).rejects.toThrow(new ApplicationError_1.ApplicationError('USER_NOT_FOUND', 'User not found', 404));
    });
    it('should throw error if user is inactive', async () => {
        const token = 'valid-token';
        const newPassword = 'new-password';
        const userId = 'user-id';
        const email = 'user@example.com';
        const decodedToken = {
            userId,
            email,
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.INACTIVE
        };
        const mockUser = new User_1.UserEntity(userId, 'Test User', email, 'old-password', UserRole_1.UserRole.USER, UserStatus_1.UserStatus.INACTIVE, new Date(), new Date());
        jwtTokenService.verifyToken.mockResolvedValue(decodedToken);
        userRepository.findById.mockResolvedValue(mockUser);
        await expect(resetPasswordUseCase.execute(token, newPassword)).rejects.toThrow(new ApplicationError_1.ApplicationError('INACTIVE_USER', 'User is inactive', 403));
    });
    it('should throw error if update fails', async () => {
        const token = 'valid-token';
        const newPassword = 'new-password';
        const userId = 'user-id';
        const email = 'user@example.com';
        const decodedToken = {
            userId,
            email,
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE
        };
        const mockUser = new User_1.UserEntity(userId, 'Test User', email, 'old-password', UserRole_1.UserRole.USER, UserStatus_1.UserStatus.ACTIVE, new Date(), new Date());
        jwtTokenService.verifyToken.mockResolvedValue(decodedToken);
        userRepository.findById.mockResolvedValue(mockUser);
        passwordHashService.hash.mockResolvedValue('hashed-new-password');
        userRepository.update.mockRejectedValue(new Error('Update failed'));
        await expect(resetPasswordUseCase.execute(token, newPassword)).rejects.toThrow(new ApplicationError_1.ApplicationError('UPDATE_FAILED', 'Failed to update password', 500));
    });
});
//# sourceMappingURL=ResetPasswordUseCase.test.js.map