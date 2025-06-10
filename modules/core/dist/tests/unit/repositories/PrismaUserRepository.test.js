"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PrismaUserRepository_1 = require("../../../infrastructure/database/PrismaUserRepository");
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
const jest_mock_extended_1 = require("jest-mock-extended");
describe('PrismaUserRepository', () => {
    let prisma;
    let repository;
    beforeEach(() => {
        prisma = (0, jest_mock_extended_1.mockDeep)();
        repository = new PrismaUserRepository_1.PrismaUserRepository(prisma);
    });
    describe('create', () => {
        it('should create a user and return mapped domain user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE
            };
            const prismaUser = {
                id: '1',
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role.toString(),
                status: userData.status.toString(),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            prisma.user.create.mockResolvedValue(prismaUser);
            const result = await repository.create(userData);
            expect(result).toEqual({
                ...prismaUser,
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                toJSON: expect.any(Function)
            });
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    ...userData,
                    role: userData.role.toString(),
                    status: userData.status.toString()
                }
            });
        });
    });
    describe('findByEmail', () => {
        it('should return null when user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            const result = await repository.findByEmail('nonexistent@example.com');
            expect(result).toBeNull();
        });
        it('should return mapped domain user when found', async () => {
            const prismaUser = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'USER',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            prisma.user.findUnique.mockResolvedValue(prismaUser);
            const result = await repository.findByEmail('test@example.com');
            expect(result).toEqual({
                ...prismaUser,
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                toJSON: expect.any(Function)
            });
        });
    });
    describe('findAll', () => {
        it('should return mapped domain users with filters', async () => {
            const prismaUsers = [
                {
                    id: '1',
                    name: 'User 1',
                    email: 'user1@example.com',
                    password: 'hash1',
                    role: 'USER',
                    status: 'ACTIVE',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '2',
                    name: 'User 2',
                    email: 'user2@example.com',
                    password: 'hash2',
                    role: 'ADMIN',
                    status: 'ACTIVE',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            prisma.user.findMany.mockResolvedValue(prismaUsers);
            const result = await repository.findAll({
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                skip: 0,
                take: 10
            });
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                ...prismaUsers[0],
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                toJSON: expect.any(Function)
            });
        });
    });
    describe('update', () => {
        it('should update user and return mapped domain user', async () => {
            const updateData = {
                name: 'Updated Name',
                role: UserRole_1.UserRole.ADMIN
            };
            const prismaUser = {
                id: '1',
                name: updateData.name,
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'ADMIN',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            prisma.user.update.mockResolvedValue(prismaUser);
            const result = await repository.update('1', updateData);
            expect(result).toEqual({
                ...prismaUser,
                role: UserRole_1.UserRole.ADMIN,
                status: UserStatus_1.UserStatus.ACTIVE,
                toJSON: expect.any(Function)
            });
        });
    });
    describe('delete', () => {
        it('should call prisma delete with correct id', async () => {
            await repository.delete('1');
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });
    });
    describe('countUsers', () => {
        it('should return count with filters', async () => {
            prisma.user.count.mockResolvedValue(2);
            const result = await repository.countUsers({
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE
            });
            expect(result).toBe(2);
            expect(prisma.user.count).toHaveBeenCalledWith({
                where: {
                    role: UserRole_1.UserRole.USER.toString(),
                    status: UserStatus_1.UserStatus.ACTIVE.toString()
                }
            });
        });
    });
});
