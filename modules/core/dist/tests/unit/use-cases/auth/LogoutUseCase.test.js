"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogoutUseCase_1 = require("../../../../application/use-cases/auth/LogoutUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
describe('LogoutUseCase', () => {
    let logoutUseCase;
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
            verifyToken: jest.fn(),
            revokeToken: jest.fn()
        };
        logoutUseCase = new LogoutUseCase_1.LogoutUseCase(userRepository, jwtTokenService);
    });
    it('should successfully logout user', async () => {
        const userId = '1';
        const token = 'validToken';
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
            type: 'access'
        });
        jwtTokenService.revokeToken.mockResolvedValue(true);
        await logoutUseCase.execute(userId, token);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(jwtTokenService.verifyToken).toHaveBeenCalledWith(token);
        expect(jwtTokenService.revokeToken).toHaveBeenCalledWith(token);
    });
    it('should throw error when user is not found', async () => {
        const userId = '1';
        const token = 'validToken';
        userRepository.findById.mockResolvedValue(null);
        await expect(logoutUseCase.execute(userId, token))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when token is invalid', async () => {
        const userId = '1';
        const token = 'invalidToken';
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
        jwtTokenService.verifyToken.mockRejectedValue(new Error('Invalid token'));
        await expect(logoutUseCase.execute(userId, token))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid token', 'INVALID_TOKEN', 401));
    });
    it('should throw error when token type is not access', async () => {
        const userId = '1';
        const token = 'refreshToken';
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
        await expect(logoutUseCase.execute(userId, token))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid token type', 'INVALID_TOKEN_TYPE', 401));
    });
    it('should throw error when token revocation fails', async () => {
        const userId = '1';
        const token = 'validToken';
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
            type: 'access'
        });
        jwtTokenService.revokeToken.mockRejectedValue(new Error('Revocation failed'));
        await expect(logoutUseCase.execute(userId, token))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error revoking token', 'TOKEN_REVOCATION_ERROR', 500));
    });
});
