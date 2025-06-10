import { PrismaClient, UserPermission, Permission } from '@prisma/client';
import { prisma } from 'lib/prisma';

export class UserPermissionService {
  constructor(prisma?: PrismaClient) {
    // The constructor is now empty as we're using the global prisma instance
  }

  async assignPermissionToUser(userId: string, permissionId: string): Promise<UserPermission> {
    return prisma.userPermission.create({ data: { userId, permissionId } });
  }

  async removePermissionFromUser(userId: string, permissionId: string): Promise<UserPermission> {
    return prisma.userPermission.delete({ where: { userId_permissionId: { userId, permissionId } } });
  }

  async getPermissionsOfUser(userId: string): Promise<Permission[]> {
    const userPerms = await prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });
    return userPerms.map(up => up.permission);
  }
} 