import { PrismaClient, UserRole, Role } from '@prisma/client';
import { prisma } from 'lib/prisma';

export class UserRoleService {
  constructor(prisma?: PrismaClient) {
    // The constructor is now empty as the prisma instance is always the global one
  }

  async assignRoleToUser(userId: string, role: Role): Promise<UserRole> {
    return prisma.userRole.create({ data: { userId, role } });
  }

  async removeRoleFromUser(userId: string, role: Role): Promise<UserRole> {
    return prisma.userRole.delete({ where: { userId_role: { userId, role } } });
  }

  async getRolesOfUser(userId: string): Promise<Role[]> {
    const userRoles = await prisma.userRole.findMany({ where: { userId } });
    return userRoles.map(ur => ur.role);
  }
} 