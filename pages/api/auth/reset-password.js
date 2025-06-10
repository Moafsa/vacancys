import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }
  console.log(`[RESET-PASSWORD] Request received:`, { token, ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    const email = decoded.email;
    if (!email) {
      console.warn(`[RESET-PASSWORD] Invalid token payload:`, { token });
      return res.status(400).json({ error: 'Invalid token' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`[RESET-PASSWORD] User not found:`, { email });
      return res.status(404).json({ error: 'User not found' });
    }
    const hashedPassword = await hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    console.log(`[RESET-PASSWORD] Password reset successfully:`, { email });
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(`[RESET-PASSWORD] Error:`, error);
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
} 