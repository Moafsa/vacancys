import { PrismaClient, RolePermission, Permission, Role } from '@prisma/client';
import { prisma } from 'lib/prisma';

export class RoleService {
  async getAllRoles(): Promise<Role[]> {
    return Object.values(Role);
  }

  async getPermissionsByRole(role: Role): Promise<Permission[]> {
    const rolePerms = await prisma.rolePermission.findMany({
      where: { role },
      include: { permission: true },
    });
    return rolePerms.map(rp => rp.permission);
  }

  async assignPermissionToRole(role: Role, permissionId: string): Promise<RolePermission> {
    return prisma.rolePermission.create({ data: { role, permissionId } });
  }

  async removePermissionFromRole(role: Role, permissionId: string): Promise<RolePermission> {
    return prisma.rolePermission.delete({ where: { role_permissionId: { role, permissionId } } });
  }
} 