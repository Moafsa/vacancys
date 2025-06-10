"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const client_1 = require("@prisma/client");
const tsyringe_1 = require("tsyringe");
const User_1 = require("../../domain/entities/User");
const UserStatus_1 = require("../../domain/enums/UserStatus");
let PrismaUserRepository = class PrismaUserRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    mapToDomain(prismaUser) {
        return new User_1.User({
            id: prismaUser.id,
            name: prismaUser.name,
            email: prismaUser.email,
            password: prismaUser.password,
            role: prismaUser.role,
            status: prismaUser.status,
            isEmailVerified: prismaUser.isEmailVerified,
            emailVerifiedAt: prismaUser.emailVerifiedAt,
            isTwoFactorEnabled: prismaUser.isTwoFactorEnabled,
            twoFactorSecret: prismaUser.twoFactorSecret,
            backupCodes: prismaUser.backupCodes,
            lastLoginAt: prismaUser.lastLoginAt,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt
        });
    }
    buildPagination(params) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        return {
            skip: (page - 1) * limit,
            take: limit,
            page,
            limit
        };
    }
    async create(user) {
        const prismaUser = await this.prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                status: user.status,
                isEmailVerified: user.isEmailVerified,
                emailVerifiedAt: user.emailVerifiedAt,
                isTwoFactorEnabled: user.isTwoFactorEnabled,
                twoFactorSecret: user.twoFactorSecret,
                backupCodes: user.backupCodes || [],
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
        return this.mapToDomain(prismaUser);
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        return user ? this.mapToDomain(user) : null;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        return user ? this.mapToDomain(user) : null;
    }
    async update(id, userData) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...userData,
                updatedAt: new Date()
            }
        });
        return this.mapToDomain(user);
    }
    async delete(id) {
        await this.prisma.user.delete({
            where: { id }
        });
    }
    async findAll(params) {
        const { skip, take, page, limit } = this.buildPagination(params);
        const where = {
            ...(params.role && { role: params.role }),
            ...(params.status && { status: params.status })
        };
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.user.count({ where })
        ]);
        return {
            users: users.map(this.mapToDomain),
            total,
            page,
            limit
        };
    }
    async findByRole(role, params) {
        return this.findAll({ ...params, role });
    }
    async findByStatus(status, params) {
        return this.findAll({ ...params, status });
    }
    async findActiveUsers(params) {
        return this.findByStatus(UserStatus_1.UserStatus.ACTIVE, params);
    }
    async findInactiveUsers(params) {
        return this.findByStatus(UserStatus_1.UserStatus.INACTIVE, params);
    }
    async findUnverifiedUsers(params) {
        const { skip, take, page, limit } = this.buildPagination(params);
        const where = { isEmailVerified: false };
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.user.count({ where })
        ]);
        return {
            users: users.map(this.mapToDomain),
            total,
            page,
            limit
        };
    }
    async findUsersWithTwoFactor(params) {
        const { skip, take, page, limit } = this.buildPagination(params);
        const where = { isTwoFactorEnabled: true };
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.user.count({ where })
        ]);
        return {
            users: users.map(this.mapToDomain),
            total,
            page,
            limit
        };
    }
    async search(query, params) {
        const { skip, take, page, limit } = this.buildPagination(params);
        const where = {
            OR: [
                { email: { contains: query, mode: 'insensitive' } },
                { name: { contains: query, mode: 'insensitive' } }
            ],
            ...(params.role && { role: params.role }),
            ...(params.status && { status: params.status })
        };
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.user.count({ where })
        ]);
        return {
            users: users.map(this.mapToDomain),
            total,
            page,
            limit
        };
    }
    async countUsers(filters) {
        return this.prisma.user.count({
            where: {
                ...((filters === null || filters === void 0 ? void 0 : filters.role) && { role: filters.role }),
                ...((filters === null || filters === void 0 ? void 0 : filters.status) && { status: filters.status })
            }
        });
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], PrismaUserRepository);
//# sourceMappingURL=PrismaUserRepository.js.map