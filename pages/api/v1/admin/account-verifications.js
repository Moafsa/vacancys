import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Apenas GET permitido
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  // (Opcional: checar se é admin pelo token)
  try {
    const verifications = await prisma.accountVerification.findMany({
      orderBy: { submittedAt: 'desc' }
    });
    res.status(200).json(verifications);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 