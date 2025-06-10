import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UserStatus } from '../src/domain/enums/UserStatus';

async function createAdmin() {
  const prisma = new PrismaClient();

  try {
    const adminData = {
      email: 'admin@vacancy.services',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      isTwoFactorEnabled: false,
      backupCodes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const admin = await prisma.user.create({
      data: adminData
    });

    console.log('Admin user created successfully:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // await prisma.$disconnect();
  }); 