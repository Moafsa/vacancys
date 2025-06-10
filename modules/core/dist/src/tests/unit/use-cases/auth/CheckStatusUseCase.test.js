"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CheckStatusUseCase_1 = require("../../../../application/use-cases/auth/CheckStatusUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
const Status_1 = require("../../../../domain/entities/Status");
describe('CheckStatusUseCase', () => {
    let checkStatusUseCase;
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
        checkStatusUseCase = new CheckStatusUseCase_1.CheckStatusUseCase(userRepository);
    });
    it('should successfully check user status', async () => {
        const userId = '1';
        const status = Status_1.Status.ACTIVE;
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
        const result = await checkStatusUseCase.execute(userId, status);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should throw error when user is not found', async () => {
        const userId = '1';
        const status = Status_1.Status.ACTIVE;
        userRepository.findById.mockResolvedValue(null);
        await expect(checkStatusUseCase.execute(userId, status))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404));
    });
    it('should return false when user status does not match', async () => {
        const userId = '1';
        const status = Status_1.Status.ACTIVE;
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
        const result = await checkStatusUseCase.execute(userId, status);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(false);
    });
    it('should return true for active status', async () => {
        const userId = '1';
        const status = Status_1.Status.ACTIVE;
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
        const result = await checkStatusUseCase.execute(userId, status);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should return true for inactive status', async () => {
        const userId = '1';
        const status = Status_1.Status.INACTIVE;
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
        const result = await checkStatusUseCase.execute(userId, status);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should return true for pending status', async () => {
        const userId = '1';
        const status = Status_1.Status.PENDING;
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
        const result = await checkStatusUseCase.execute(userId, status);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
    it('should return true for blocked status', async () => {
        const userId = '1';
        const status = Status_1.Status.BLOCKED;
        const mockUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.BLOCKED,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: userId,
                name: 'Test User',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.BLOCKED,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findById.mockResolvedValue(mockUser);
        const result = await checkStatusUseCase.execute(userId, status);
        expect(userRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toBe(true);
    });
});
//# sourceMappingURL=CheckStatusUseCase.test.js.map