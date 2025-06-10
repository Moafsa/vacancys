import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../../../lib/email';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  console.log(`[FORGOT-PASSWORD] Request received:`, { email, ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`[FORGOT-PASSWORD] User not found:`, { email });
      return res.status(404).json({ error: 'User not found' });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
    await sendVerificationEmail(email, resetUrl); // Você pode criar um sendPasswordResetEmail se quiser template diferente
    console.log(`[FORGOT-PASSWORD] Password reset email sent:`, { email });
    return res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(`[FORGOT-PASSWORD] Error:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 