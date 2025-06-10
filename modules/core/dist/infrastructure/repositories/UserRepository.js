"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const UserRole_1 = require("../../domain/enums/UserRole");
const UserStatus_1 = require("../../domain/enums/UserStatus");
const PrismaAdapter_1 = require("../adapters/PrismaAdapter");
class UserRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async create(userData) {
        const user = await this.prisma.user.create({
            data: {
                ...userData,
                role: userData.role || UserRole_1.UserRole.USER,
                status: userData.status || UserStatus_1.UserStatus.ACTIVE,
                isEmailVerified: userData.isEmailVerified || false,
            }
        });
        return PrismaAdapter_1.PrismaAdapter.toDomainUser(user);
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        return user ? PrismaAdapter_1.PrismaAdapter.toDomainUser(user) : null;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        return user ? PrismaAdapter_1.PrismaAdapter.toDomainUser(user) : null;
    }
    async update(id, data) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
        return PrismaAdapter_1.PrismaAdapter.toDomainUser(user);
    }
    async delete(id) {
        try {
            await this.prisma.user.delete({
                where: { id }
            });
        }
        catch (error) {
            if (error.code === 'P2025' || error.message.includes('Record to delete does not exist')) {
                return;
            }
            throw error;
        }
    }
    async list({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.user.count()
        ]);
        return {
            users: users.map(user => PrismaAdapter_1.PrismaAdapter.toDomainUser(user)),
            total
        };
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map