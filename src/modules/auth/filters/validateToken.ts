import { verify } from 'jsonwebtoken';

export function validateToken(token: string): any {
  try {
    return verify(token, process.env.JWT_SECRET || 'default-secret');
  } catch (error) {
    return null;
  }
} 