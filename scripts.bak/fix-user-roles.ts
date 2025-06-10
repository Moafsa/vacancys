import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Atualizar todos os usuários com role diferente de ADMIN para USER
    const usersToUpdate = await prisma.user.findMany({
      where: {
        role: { not: 'ADMIN' }
      }
    });

    for (const user of usersToUpdate) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'USER' }
      });
      console.log(`Updated user ${user.email} to USER`);
    }

    console.log('All non-ADMIN roles updated to USER.');

    // 2. Verificar e atualizar senhas que não estão com hash bcrypt
    const allUsers = await prisma.user.findMany();
    console.log(`Found ${allUsers.length} total users`);

    for (const user of allUsers) {
      // Verifica se a senha já está com hash bcrypt
      if (!user.password.startsWith('$2')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
        console.log(`Updated password hash for user ${user.email}`);
      }
    }

    console.log('User roles and passwords have been updated successfully');
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 