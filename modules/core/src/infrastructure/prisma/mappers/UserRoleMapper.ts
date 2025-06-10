import { Role as PrismaUserRole } from '@prisma/client';
import { UserRole as DomainUserRole } from '../../../domain/enums/UserRole';

export class UserRoleMapper {
  /**
   * Maps a Prisma UserRole to a Domain UserRole
   */
  static toDomain(prismaRole: PrismaUserRole): DomainUserRole {
    const roleMap: Record<PrismaUserRole, DomainUserRole> = {
      ADMIN: DomainUserRole.ADMIN,
      USER: DomainUserRole.USER,
    };

    return roleMap[prismaRole];
  }

  /**
   * Maps a Domain UserRole to a Prisma UserRole
   */
  static toPrisma(domainRole: DomainUserRole): PrismaUserRole {
    const roleMap: Record<DomainUserRole, PrismaUserRole> = {
      ADMIN: PrismaUserRole.ADMIN,
      USER: PrismaUserRole.USER,
      CLIENT: PrismaUserRole.USER,
      FREELANCER: PrismaUserRole.USER,
    };

    return roleMap[domainRole];
  }
} 