import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../../../lib/email';
import { UserRepository } from '../../../modules/core/src/infrastructure/repositories/UserRepository';
import { prisma } from '../../../lib/prisma';

const prismaClient = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  console.log(`[REGISTER] Request received:`, { email, name, ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress });

  try {
    const userRepository = new UserRepository(prismaClient);
    const existing = await prismaClient.user.findUnique({ where: { email } });
    if (existing) {
      console.warn(`[REGISTER] Email already registered:`, { email });
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashedPassword = await hash(password, 10);
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'USER',
      status: 'PENDING',
      isEmailVerified: false,
    });
    console.log(`[REGISTER] User created:`, { id: user.id, email: user.email, status: user.status });

    // Gerar token de verificação
    const token = jwt.sign({ email }, process.env.JWT_SECRET || '', { expiresIn: '24h' });
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
    await sendVerificationEmail(email, verifyUrl);
    console.log(`[REGISTER] Verification email sent:`, { email });

    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error(`[REGISTER] Error:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 