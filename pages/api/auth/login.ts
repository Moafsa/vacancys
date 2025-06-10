import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    console.log(`[LOGIN] Request received:`, { email, ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`[LOGIN] User not found:`, { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.status !== 'ACTIVE') {
      console.warn(`[LOGIN] User not active:`, { email, status: user.status });
      return res.status(403).json({ error: 'Account not active. Please verify your email.' });
    }
    if (!user.isEmailVerified) {
      console.warn(`[LOGIN] Email not verified:`, { email });
      return res.status(403).json({ error: 'Email not verified. Please check your inbox.' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.warn(`[LOGIN] Invalid password:`, { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1d' }
    );
    console.log(`[LOGIN] Success:`, { email, id: user.id });
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error(`[LOGIN] Error:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 