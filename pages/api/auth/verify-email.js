import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  console.log(`[VERIFY-EMAIL] Request received:`, { token, ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    const email = decoded.email;
    if (!email) {
      console.warn(`[VERIFY-EMAIL] Invalid token payload:`, { token });
      return res.status(400).json({ error: 'Invalid token' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`[VERIFY-EMAIL] User not found:`, { email });
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.isEmailVerified) {
      console.log(`[VERIFY-EMAIL] Email already verified:`, { email });
      return res.status(200).json({ message: 'Email already verified' });
    }
    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true, status: 'ACTIVE' },
    });
    console.log(`[VERIFY-EMAIL] Email verified successfully:`, { email });
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(`[VERIFY-EMAIL] Error:`, error);
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
} 