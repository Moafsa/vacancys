import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';

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

    const { code } = req.body;

    // Validate request body
    if (!code) {
      return res.status(400).json({ message: 'Verification code is required' });
    }

    // Get user with profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user || !user.profile || !user.profile.twoFactorSecret) {
      return res.status(404).json({ message: 'User profile or 2FA setup not found' });
    }

    // Verify the code
    const isValid = authenticator.verify({
      token: code,
      secret: user.profile.twoFactorSecret
    });

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Update the user profile
    await prisma.userProfile.update({
      where: { userId },
      data: {
        twoFactorEnabled: true
      }
    });

    return res.status(200).json({ message: 'Two-factor authentication enabled successfully' });
  } catch (error) {
    console.error('Error confirming 2FA:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 