import { prisma } from '../../../../../lib/prisma';

export async function userHasPermission(userId: string, permissionName: string): Promise<boolean> {
  // Permissões diretas
  const userPerm = await prisma.userPermission.findFirst({
    where: {
      userId,
      permission: { name: permissionName },
    },
  });
  if (userPerm) return true;

  // Permissões via papéis
  const userRoles = await prisma.userRole.findMany({ where: { userId } });
  const roles = userRoles.map(ur => ur.role);
  if (roles.length === 0) return false;
  const rolePerm = await prisma.rolePermission.findFirst({
    where: {
      role: { in: roles },
      permission: { name: permissionName },
    },
  });
  return !!rolePerm;
} 