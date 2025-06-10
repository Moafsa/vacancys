"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CheckRoleUseCase_1 = require("../../../../application/use-cases/auth/CheckRoleUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
const Role_1 = require("../../../../domain/entities/Role");
describe('CheckRoleUseCase', () => {
    let checkRoleUseCase;
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
        checkRoleUseCase = new CheckRoleUseCase_1.CheckRoleUseCase(userRepository);
    });
    it('should successfully check user role', async () => {
        const userId = '1';
        const role = Role_1.Role.ADMIN;
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
        const result = await checkRoleUseCase.execute(userId, role);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should throw error when user is not found', async () => {
        const userId = '1';
        const role = Role_1.Role.ADMIN;
        userRepository.findById.mockResolvedValue(null);
        await expect(checkRoleUseCase.execute(userId, role))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should throw error when user account is inactive', async () => {
        const userId = '1';
        const role = Role_1.Role.ADMIN;
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
        await expect(checkRoleUseCase.execute(userId, role))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User account is not active', 'USER_INACTIVE', 403));
    });
    it('should return false when user does not have role', async () => {
        const userId = '1';
        const role = Role_1.Role.ADMIN;
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
        const result = await checkRoleUseCase.execute(userId, role);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(false);
    });
    it('should return true for admin role', async () => {
        const userId = '1';
        const role = Role_1.Role.ADMIN;
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
        const result = await checkRoleUseCase.execute(userId, role);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should return true for recruiter role', async () => {
        const userId = '1';
        const role = Role_1.Role.RECRUITER;
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
        const result = await checkRoleUseCase.execute(userId, role);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should return true for user role', async () => {
        const userId = '1';
        const role = Role_1.Role.USER;
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
        const result = await checkRoleUseCase.execute(userId, role);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
});
