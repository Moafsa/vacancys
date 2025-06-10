const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

console.log('Starting seed script...');

async function main() {
  try {
    const password = await bcrypt.hash('Admin123!', 10);
    console.log('Hashed password:', password);
    await prisma.user.upsert({
      where: { email: 'admin@vacancy.services' },
      update: {},
      create: {
        email: 'admin@vacancy.services',
        name: 'Admin',
        password,
        role: 'ADMIN',
        status: 'ACTIVE',
        isEmailVerified: true,
      },
    });
    console.log('Admin user seeded!');

    // Seed de permissões básicas
    const permissions = [
      { name: 'user:create', description: 'Create users' },
      { name: 'user:read', description: 'Read users' },
      { name: 'user:update', description: 'Update users' },
      { name: 'user:delete', description: 'Delete users' },
      { name: 'profile:read', description: 'Read profiles' },
      { name: 'profile:update', description: 'Update profiles' },
      { name: 'role:assign', description: 'Assign roles to users' },
      { name: 'permission:assign', description: 'Assign permissions to users' },
    ];
    for (const perm of permissions) {
      await prisma.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      });
    }
    console.log('Permissions seeded!');

    // Seed de role_permissions para ADMIN
    const allPermissions = await prisma.permission.findMany();
    for (const perm of allPermissions) {
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role: 'ADMIN', permissionId: perm.id } },
        update: {},
        create: { role: 'ADMIN', permissionId: perm.id },
      });
    }
    console.log('RolePermissions for ADMIN seeded!');

    // Seed de user_roles para admin
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@vacancy.services' } });
    if (adminUser) {
      await prisma.userRole.upsert({
        where: { userId_role: { userId: adminUser.id, role: 'ADMIN' } },
        update: {},
        create: { userId: adminUser.id, role: 'ADMIN' },
      });
      console.log('UserRole for admin seeded!');
    }
  } catch (e) {
    console.error('Seed error:', e);
    process.exit(1);
  }
}

main()
  .catch(e => { console.error('Main catch:', e); process.exit(1); })
  .finally(() => prisma.$disconnect()); 