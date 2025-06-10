import { User as PrismaUser } from '@prisma/client';
import { User, IUser } from '../../domain/entities/User';
import { UserRole } from '../../domain/enums/UserRole';
import { UserStatus } from '../../domain/enums/UserStatus';

export class PrismaAdapter {
  static toDomainUser(prismaUser: PrismaUser | null): User {
    if (!prismaUser) {
      throw new Error('Cannot convert null or undefined PrismaUser to domain User');
    }

    const userData: IUser = {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
      role: this.toDomainUserRole(prismaUser.role),
      status: this.toDomainUserStatus(prismaUser.status),
      isEmailVerified: prismaUser.isEmailVerified,
      lastLoginAt: prismaUser.lastLoginAt,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      avatarUrl: prismaUser.avatarUrl || '',
      phone: prismaUser.phone || '',
      location: prismaUser.location || '',
      bio: prismaUser.bio || '',
    };
    return new User(userData);
  }

  static toDomainUserRole(prismaRole: 'ADMIN' | 'USER'): UserRole {
    switch (prismaRole) {
      case 'ADMIN':
        return UserRole.ADMIN;
      case 'USER':
        return UserRole.USER;
      default:
        throw new Error(`Unknown user role: ${prismaRole}`);
    }
  }

  static toDomainUserStatus(prismaStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED'): UserStatus {
    switch (prismaStatus) {
      case 'ACTIVE':
        return UserStatus.ACTIVE;
      case 'INACTIVE':
        return UserStatus.INACTIVE;
      case 'PENDING':
        return UserStatus.PENDING;
      case 'BLOCKED':
        return UserStatus.BLOCKED;
      default:
        throw new Error(`Unknown user status: ${prismaStatus}`);
    }
  }

  static toPrismaUserRole(domainRole: UserRole): 'ADMIN' | 'USER' {
    switch (domainRole) {
      case UserRole.ADMIN:
        return 'ADMIN';
      case UserRole.USER:
        return 'USER';
      default:
        throw new Error(`Unknown domain role: ${domainRole}`);
    }
  }

  static toPrismaUserStatus(domainStatus: UserStatus): 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED' {
    switch (domainStatus) {
      case UserStatus.ACTIVE:
        return 'ACTIVE';
      case UserStatus.INACTIVE:
        return 'INACTIVE';
      case UserStatus.PENDING:
        return 'PENDING';
      case UserStatus.BLOCKED:
        return 'BLOCKED';
      default:
        throw new Error(`Unknown domain status: ${domainStatus}`);
    }
  }

  static toDomainUserProfile(prismaProfile: any): any {
    // TODO: Remover quando toda a base migrar para os métodos específicos
    return prismaProfile; // Retorno direto para não quebrar código legado
  }

  static toDomainFreelancerProfile(prismaProfile: any): any {
    if (!prismaProfile) throw new Error('Cannot convert null Prisma FreelancerProfile');
    return {
      id: prismaProfile.id,
      userId: prismaProfile.userId,
      headline: prismaProfile.headline,
      skills: prismaProfile.skills,
      hourlyRate: prismaProfile.hourlyRate,
      availability: prismaProfile.availability,
      experienceYears: prismaProfile.experienceYears,
      englishLevel: prismaProfile.englishLevel,
      portfolioWebsite: prismaProfile.portfolioWebsite,
      profileComplete: prismaProfile.profileComplete,
      createdAt: prismaProfile.createdAt,
      updatedAt: prismaProfile.updatedAt,
    };
  }

  static toDomainClientProfile(prismaProfile: any): any {
    if (!prismaProfile) throw new Error('Cannot convert null Prisma ClientProfile');
    return {
      id: prismaProfile.id,
      userId: prismaProfile.userId,
      companyName: prismaProfile.companyName,
      industry: prismaProfile.industry,
      companySize: prismaProfile.companySize,
      companyWebsite: prismaProfile.companyWebsite,
      profileComplete: prismaProfile.profileComplete,
      createdAt: prismaProfile.createdAt,
      updatedAt: prismaProfile.updatedAt,
    };
  }
} 