import { prisma } from '../../../lib/prisma';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: '1d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    token
  };
} 