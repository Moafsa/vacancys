"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAdapter = void 0;
const User_1 = require("../../domain/entities/User");
const UserRole_1 = require("../../domain/enums/UserRole");
const UserStatus_1 = require("../../domain/enums/UserStatus");
const UserProfile_1 = require("../../domain/entities/UserProfile");
const ProfileType_1 = require("../../domain/enums/ProfileType");
class PrismaAdapter {
    static toDomainUser(prismaUser) {
        if (!prismaUser) {
            throw new Error('Cannot convert null or undefined PrismaUser to domain User');
        }
        const userData = {
            id: prismaUser.id,
            name: prismaUser.name,
            email: prismaUser.email,
            password: prismaUser.password,
            role: this.toDomainUserRole(prismaUser.role),
            status: this.toDomainUserStatus(prismaUser.status),
            isEmailVerified: prismaUser.isEmailVerified,
            lastLoginAt: prismaUser.lastLoginAt,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt
        };
        return new User_1.User(userData);
    }
    static toDomainUserProfile(prismaProfile) {
        if (!prismaProfile) {
            throw new Error('Cannot convert null or undefined PrismaUserProfile to domain UserProfile');
        }
        return new UserProfile_1.UserProfile({
            id: prismaProfile.id,
            userId: prismaProfile.userId,
            type: this.toDomainProfileType(prismaProfile.type),
            bio: prismaProfile.bio === null ? undefined : prismaProfile.bio,
            title: prismaProfile.title === null ? undefined : prismaProfile.title,
            company: prismaProfile.company === null ? undefined : prismaProfile.company,
            website: prismaProfile.website === null ? undefined : prismaProfile.website,
            location: prismaProfile.location === null ? undefined : prismaProfile.location,
            phone: prismaProfile.phone === null ? undefined : prismaProfile.phone,
            socialLinks: prismaProfile.socialLinks,
            skills: prismaProfile.skills,
            hourlyRate: prismaProfile.hourlyRate === null ? undefined : prismaProfile.hourlyRate,
            availability: prismaProfile.availability,
            createdAt: prismaProfile.createdAt,
            updatedAt: prismaProfile.updatedAt,
        });
    }
    static toDomainUserRole(prismaRole) {
        switch (prismaRole) {
            case 'ADMIN':
                return UserRole_1.UserRole.ADMIN;
            case 'USER':
                return UserRole_1.UserRole.USER;
            default:
                throw new Error(`Unknown user role: ${prismaRole}`);
        }
    }
    static toDomainUserStatus(prismaStatus) {
        switch (prismaStatus) {
            case 'ACTIVE':
                return UserStatus_1.UserStatus.ACTIVE;
            case 'INACTIVE':
                return UserStatus_1.UserStatus.INACTIVE;
            case 'PENDING':
                return UserStatus_1.UserStatus.PENDING;
            case 'BLOCKED':
                return UserStatus_1.UserStatus.BLOCKED;
            default:
                throw new Error(`Unknown user status: ${prismaStatus}`);
        }
    }
    static toDomainProfileType(prismaType) {
        switch (prismaType) {
            case 'FREELANCER':
                return ProfileType_1.ProfileType.FREELANCER;
            case 'CLIENT':
                return ProfileType_1.ProfileType.CLIENT;
            default:
                throw new Error(`Unknown domain profile type: ${prismaType}`);
        }
    }
    static toPrismaUserRole(domainRole) {
        switch (domainRole) {
            case UserRole_1.UserRole.ADMIN:
                return 'ADMIN';
            case UserRole_1.UserRole.USER:
                return 'USER';
            default:
                throw new Error(`Unknown domain role: ${domainRole}`);
        }
    }
    static toPrismaUserStatus(domainStatus) {
        switch (domainStatus) {
            case UserStatus_1.UserStatus.ACTIVE:
                return 'ACTIVE';
            case UserStatus_1.UserStatus.INACTIVE:
                return 'INACTIVE';
            case UserStatus_1.UserStatus.PENDING:
                return 'PENDING';
            case UserStatus_1.UserStatus.BLOCKED:
                return 'BLOCKED';
            default:
                throw new Error(`Unknown domain status: ${domainStatus}`);
        }
    }
    static toPrismaProfileType(domainType) {
        switch (domainType) {
            case ProfileType_1.ProfileType.FREELANCER:
                return 'FREELANCER';
            case ProfileType_1.ProfileType.CLIENT:
                return 'CLIENT';
            default:
                throw new Error(`Unknown domain profile type: ${domainType}`);
        }
    }
}
exports.PrismaAdapter = PrismaAdapter;
//# sourceMappingURL=PrismaAdapter.js.map