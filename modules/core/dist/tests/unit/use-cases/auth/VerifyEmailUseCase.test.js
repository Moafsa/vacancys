"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VerifyEmailUseCase_1 = require("../../../../application/use-cases/auth/VerifyEmailUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
describe('VerifyEmailUseCase', () => {
    let verifyEmailUseCase;
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
        verifyEmailUseCase = new VerifyEmailUseCase_1.VerifyEmailUseCase(userRepository, jwtTokenService);
    });
    it('should successfully verify user email', async () => {
        const token = 'valid.verification.token';
        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING,
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
        const decodedToken = {
            userId: mockUser.id,
            email: mockUser.email,
            type: 'email_verification'
        };
        jwtTokenService.verifyToken.mockResolvedValue(decodedToken);
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue({
            ...mockUser,
            status: UserStatus_1.UserStatus.ACTIVE
        });
        const result = await verifyEmailUseCase.execute(token);
        expect(result).toEqual({
            ...mockUser.toJSON(),
            status: UserStatus_1.UserStatus.ACTIVE
        });
        expect(jwtTokenService.verifyToken).toHaveBeenCalledWith(token);
        expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
        expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, {
            status: UserStatus_1.UserStatus.ACTIVE
        });
    });
    it('should throw error when token is invalid', async () => {
        const token = 'invalid.token';
        jwtTokenService.verifyToken.mockRejectedValue(new Error('Invalid token'));
        await expect(verifyEmailUseCase.execute(token))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid verification token', 'INVALID_TOKEN', 400));
    });
    it('should throw error when token type is not email verification', async () => {
        const token = 'valid.token';
        const decodedToken = {
            userId: '1',
            email: 'test@example.com',
            type: 'password_reset'
        };
        jwtTokenService.verifyToken.mockResolvedValue(decodedToken);
        await expect(verifyEmailUseCase.execute(token))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid token type', 'INVALID_TOKEN_TYPE', 400));
    });
    it('should throw error when user is not found', async () => {
        const token = 'valid.token';
        const decodedToken = {
            userId: '1',
            email: 'test@example.com',
            type: 'email_verification'
        };
        jwtTokenService.verifyToken.mockResolvedValue(decodedToken);
        userRepository.findById.mockResolvedValue(null);
        await expect(verifyEmailUseCase.execute(token))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when user is already verified', async () => {
        const token = 'valid.token';
        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        const decodedToken = {
            userId: mockUser.id,
            email: mockUser.email,
            type: 'email_verification'
        };
        jwtTokenService.verifyToken.mockResolvedValue(decodedToken);
        userRepository.findById.mockResolvedValue(mockUser);
        await expect(verifyEmailUseCase.execute(token))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Email already verified', 'EMAIL_ALREADY_VERIFIED', 400));
    });
    it('should throw error when user update fails', async () => {
        const token = 'valid.token';
        const mockUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        };
        const decodedToken = {
            userId: mockUser.id,
            email: mockUser.email,
            type: 'email_verification'
        };
        jwtTokenService.verifyToken.mockResolvedValue(decodedToken);
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockRejectedValue(new Error('Database error'));
        await expect(verifyEmailUseCase.execute(token))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error updating user status', 'USER_UPDATE_ERROR', 500));
    });
});
