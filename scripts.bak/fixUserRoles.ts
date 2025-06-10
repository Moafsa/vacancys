import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Atualizar todos os usuários que não são admin para USER
  await prisma.user.updateMany({
    where: { role: { not: 'ADMIN' } },
    data: { role: 'USER' }
  });

  // Atualizar admins explicitamente (opcional, caso queira garantir)
  await prisma.user.updateMany({
    where: { email: { contains: 'admin' } },
    data: { role: 'ADMIN' }
  });

  console.log('User roles updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 