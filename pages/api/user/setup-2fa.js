import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

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

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a secret for the user
    const secret = authenticator.generateSecret();
    
    // Store the secret temporarily (it will be confirmed later)
    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        twoFactorSecret: secret,
        twoFactorEnabled: false
      },
      create: {
        userId,
        type: user.role === 'ADMIN' ? 'CLIENT' : 'FREELANCER',
        twoFactorSecret: secret,
        twoFactorEnabled: false
      }
    });

    // Generate a QR code URL
    const serviceName = 'VacancyApp';
    const otpauth = authenticator.keyuri(user.email, serviceName, secret);
    const qrCode = await QRCode.toDataURL(otpauth);

    return res.status(200).json({ qrCode });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 