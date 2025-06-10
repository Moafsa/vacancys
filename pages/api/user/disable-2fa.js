import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    const userId = decoded.userId;

    // Get user with profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user || !user.profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Update the user profile
    await prisma.userProfile.update({
      where: { userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null
      }
    });

    return res.status(200).json({ message: 'Two-factor authentication disabled successfully' });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 