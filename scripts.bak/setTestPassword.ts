import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('123456', 10);
  const emails = [
    'elonbettor@gmail.com',
    'admin@wfcred.solutions',
    'admin@vacancy.services',
    'lojista@wfcred.com',
    'dorva@vons.com'
  ];
  for (const email of emails) {
    await prisma.user.update({
      where: { email },
      data: { password: hash }
    });
    console.log(`Senha de teste atualizada para ${email} (123456)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 