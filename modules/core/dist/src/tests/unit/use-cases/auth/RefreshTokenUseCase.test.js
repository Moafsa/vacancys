"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RefreshTokenUseCase_1 = require("../../../../application/use-cases/auth/RefreshTokenUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
describe('RefreshTokenUseCase', () => {
    let refreshTokenUseCase;
    let userRepository;
    let jwtTokenService;
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
        refreshTokenUseCase = new RefreshTokenUseCase_1.RefreshTokenUseCase(userRepository, jwtTokenService);
    });
    it('should successfully refresh token', async () => {
        const userId = '1';
        const refreshToken = 'validRefreshToken';
        const newAccessToken = 'newAccessToken';
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
        jwtTokenService.verifyToken.mockResolvedValue({
            userId,
            type: 'refresh'
        });
        jwtTokenService.generateToken.mockResolvedValue(newAccessToken);
        const result = await refreshTokenUseCase.execute(refreshToken);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(jwtTokenService.verifyToken).toHaveBeenCalledWith(refreshToken);
        expect(jwtTokenService.generateToken).toHaveBeenCalledWith({
            userId,
            type: 'access'
        });
        expect(result).toBe(newAccessToken);
    });
    it('should throw error when token is invalid', async () => {
        const refreshToken = 'invalidToken';
        jwtTokenService.verifyToken.mockRejectedValue(new Error('Invalid token'));
        await expect(refreshTokenUseCase.execute(refreshToken))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid token', 'INVALID_TOKEN', 401));
    });
    it('should throw error when token type is not refresh', async () => {
        const refreshToken = 'accessToken';
        jwtTokenService.verifyToken.mockResolvedValue({
            userId: '1',
            type: 'access'
        });
        await expect(refreshTokenUseCase.execute(refreshToken))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid token type', 'INVALID_TOKEN_TYPE', 401));
    });
    it('should throw error when user is not found', async () => {
        const refreshToken = 'validRefreshToken';
        jwtTokenService.verifyToken.mockResolvedValue({
            userId: '1',
            type: 'refresh'
        });
        userRepository.findById.mockResolvedValue(null);
        await expect(refreshTokenUseCase.execute(refreshToken))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when user account is inactive', async () => {
        const refreshToken = 'validRefreshToken';
        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.INACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.INACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        jwtTokenService.verifyToken.mockResolvedValue({
            userId: '1',
            type: 'refresh'
        });
        userRepository.findById.mockResolvedValue(mockUser);
        await expect(refreshTokenUseCase.execute(refreshToken))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User account is not active', 'USER_INACTIVE', 403));
    });
    it('should throw error when token generation fails', async () => {
        const refreshToken = 'validRefreshToken';
        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        jwtTokenService.verifyToken.mockResolvedValue({
            userId: '1',
            type: 'refresh'
        });
        userRepository.findById.mockResolvedValue(mockUser);
        jwtTokenService.generateToken.mockRejectedValue(new Error('Token generation failed'));
        await expect(refreshTokenUseCase.execute(refreshToken))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error generating token', 'TOKEN_GENERATION_ERROR', 500));
    });
});
//# sourceMappingURL=RefreshTokenUseCase.test.js.map