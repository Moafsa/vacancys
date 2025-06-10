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
  console.log(`[RESEND-VERIFICATION] Request received:`, { email, ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`[RESEND-VERIFICATION] User not found:`, { email });
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.isEmailVerified) {
      console.log(`[RESEND-VERIFICATION] Email already verified:`, { email });
      return res.status(400).json({ error: 'Email already verified' });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET || '', { expiresIn: '24h' });
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
    await sendVerificationEmail(email, verifyUrl);
    console.log(`[RESEND-VERIFICATION] Verification email sent:`, { email });
    return res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error(`[RESEND-VERIFICATION] Error:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 