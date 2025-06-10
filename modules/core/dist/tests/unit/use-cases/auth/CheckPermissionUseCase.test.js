"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CheckPermissionUseCase_1 = require("../../../../application/use-cases/auth/CheckPermissionUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
const Permission_1 = require("../../../../domain/entities/Permission");
describe('CheckPermissionUseCase', () => {
    let checkPermissionUseCase;
    let userRepository;
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
        checkPermissionUseCase = new CheckPermissionUseCase_1.CheckPermissionUseCase(userRepository);
    });
    it('should successfully check user permission', async () => {
        const userId = '1';
        const permission = Permission_1.Permission.CREATE_VACANCY;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.ADMIN,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.ADMIN,
                status: UserStatus_1.UserStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findById.mockResolvedValue(mockUser);
        const result = await checkPermissionUseCase.execute(userId, permission);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should throw error when user is not found', async () => {
        const userId = '1';
        const permission = Permission_1.Permission.CREATE_VACANCY;
        userRepository.findById.mockResolvedValue(null);
        await expect(checkPermissionUseCase.execute(userId, permission))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when user account is inactive', async () => {
        const userId = '1';
        const permission = Permission_1.Permission.CREATE_VACANCY;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.INACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.INACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findById.mockResolvedValue(mockUser);
        await expect(checkPermissionUseCase.execute(userId, permission))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User account is not active', 'USER_INACTIVE', 403));
    });
    it('should return false when user does not have permission', async () => {
        const userId = '1';
        const permission = Permission_1.Permission.MANAGE_USERS;
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
        const result = await checkPermissionUseCase.execute(userId, permission);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(false);
    });
    it('should return true for admin role with any permission', async () => {
        const userId = '1';
        const permission = Permission_1.Permission.MANAGE_USERS;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.ADMIN,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.ADMIN,
                status: UserStatus_1.UserStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findById.mockResolvedValue(mockUser);
        const result = await checkPermissionUseCase.execute(userId, permission);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should return true for recruiter role with vacancy permissions', async () => {
        const userId = '1';
        const permission = Permission_1.Permission.CREATE_VACANCY;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.RECRUITER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.RECRUITER,
                status: UserStatus_1.UserStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findById.mockResolvedValue(mockUser);
        const result = await checkPermissionUseCase.execute(userId, permission);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should return false for recruiter role with non-vacancy permissions', async () => {
        const userId = '1';
        const permission = Permission_1.Permission.MANAGE_USERS;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.RECRUITER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.RECRUITER,
                status: UserStatus_1.UserStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findById.mockResolvedValue(mockUser);
        const result = await checkPermissionUseCase.execute(userId, permission);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(false);
    });
});
