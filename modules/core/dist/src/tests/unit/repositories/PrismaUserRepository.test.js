"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const PrismaUserRepository_1 = require("../../../infrastructure/database/PrismaUserRepository");
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
const User_1 = require("../../../domain/entities/User");
jest.mock('@prisma/client');
describe('PrismaUserRepository', () => {
    let prisma;
    let userRepository;
    let mockUser;
    let mockPrismaUser;
    beforeEach(() => {
        const mockPrismaClient = {
            user: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                count: jest.fn(),
            }
        };
        prisma = mockPrismaClient;
        userRepository = new PrismaUserRepository_1.PrismaUserRepository(prisma);
        mockUser = new User_1.User({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            isEmailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        mockPrismaUser = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedPassword',
            role: client_1.UserRole.USER,
            status: client_1.UserStatus.ACTIVE,
            isEmailVerified: true,
            createdAt: mockUser.createdAt,
            updatedAt: mockUser.updatedAt
        };
    });
    describe('create', () => {
        it('deve criar um novo usuário', async () => {
            prisma.user.create.mockResolvedValue(mockPrismaUser);
            const result = await userRepository.create(mockUser);
            expect(result).toEqual(expect.objectContaining({
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                password: mockUser.password,
                role: mockUser.role,
                status: mockUser.status,
                isEmailVerified: mockUser.isEmailVerified
            }));
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    id: mockUser.id,
                    name: mockUser.name,
                    email: mockUser.email,
                    password: mockUser.password,
                    role: client_1.UserRole.USER,
                    status: client_1.UserStatus.ACTIVE,
                    isEmailVerified: mockUser.isEmailVerified,
                    createdAt: mockUser.createdAt,
                    updatedAt: mockUser.updatedAt
                }
            });
        });
    });
    describe('findByEmail', () => {
        it('deve encontrar um usuário pelo email', async () => {
            prisma.user.findUnique.mockResolvedValue(mockPrismaUser);
            const result = await userRepository.findByEmail(mockUser.email);
            expect(result).toEqual(expect.objectContaining({
                id: mockUser.id,
                email: mockUser.email,
                role: mockUser.role,
                status: mockUser.status
            }));
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: mockUser.email }
            });
        });
        it('deve retornar null quando o usuário não for encontrado', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            const result = await userRepository.findByEmail('nonexistent@example.com');
            expect(result).toBeNull();
        });
    });
    describe('findById', () => {
        it('deve encontrar um usuário pelo ID', async () => {
            prisma.user.findUnique.mockResolvedValue(mockPrismaUser);
            const result = await userRepository.findById(mockUser.id);
            expect(result).toEqual(expect.objectContaining({
                id: mockUser.id,
                email: mockUser.email,
                role: mockUser.role,
                status: mockUser.status
            }));
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: mockUser.id }
            });
        });
        it('deve retornar null quando o usuário não for encontrado', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            const result = await userRepository.findById('nonexistent-id');
            expect(result).toBeNull();
        });
    });
    describe('update', () => {
        it('deve atualizar um usuário existente', async () => {
            const updatedPrismaUser = {
                ...mockPrismaUser,
                name: 'John Updated'
            };
            prisma.user.update.mockResolvedValue(updatedPrismaUser);
            const result = await userRepository.update(mockUser.id, { name: 'John Updated' });
            expect(result).toEqual(expect.objectContaining({
                id: mockUser.id,
                name: 'John Updated',
                email: mockUser.email,
                role: mockUser.role,
                status: mockUser.status
            }));
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: mockUser.id },
                data: expect.objectContaining({
                    name: 'John Updated',
                    updatedAt: expect.any(Date)
                })
            });
        });
    });
    describe('delete', () => {
        it('deve excluir um usuário existente', async () => {
            prisma.user.delete.mockResolvedValue(mockPrismaUser);
            await userRepository.delete(mockUser.id);
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { id: mockUser.id }
            });
        });
    });
    describe('findAll', () => {
        it('deve retornar todos os usuários', async () => {
            const mockPrismaUsers = [mockPrismaUser];
            prisma.user.findMany.mockResolvedValue(mockPrismaUsers);
            const options = {
                skip: 0,
                take: 10,
                where: {
                    role: UserRole_1.UserRole.USER,
                    status: UserStatus_1.UserStatus.ACTIVE
                },
                orderBy: {
                    createdAt: 'desc'
                }
            };
            const result = await userRepository.findAll(options);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(expect.objectContaining({
                id: mockUser.id,
                email: mockUser.email,
                role: mockUser.role,
                status: mockUser.status
            }));
            expect(prisma.user.findMany).toHaveBeenCalledWith({
                skip: options.skip,
                take: options.take,
                where: {
                    role: client_1.UserRole.USER,
                    status: client_1.UserStatus.ACTIVE
                },
                orderBy: options.orderBy
            });
        });
    });
    describe('countUsers', () => {
        it('deve retornar o número total de usuários', async () => {
            const mockCount = 1;
            prisma.user.count.mockResolvedValue(mockCount);
            const options = {
                where: {
                    role: UserRole_1.UserRole.USER,
                    status: UserStatus_1.UserStatus.ACTIVE
                }
            };
            const result = await userRepository.countUsers(options);
            expect(result).toBe(mockCount);
            expect(prisma.user.count).toHaveBeenCalledWith({
                where: {
                    role: client_1.UserRole.USER,
                    status: client_1.UserStatus.ACTIVE
                }
            });
        });
    });
});
//# sourceMappingURL=PrismaUserRepository.test.js.map