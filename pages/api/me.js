import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    let payload;
    
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        clientProfile: true,
        freelancerProfile: true,
        accountVerification: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({
      ...user,
      clientProfile: user.clientProfile || null,
      freelancerProfile: user.freelancerProfile || null,
      accountVerification: user.accountVerification || null
    });
  } catch (error) {
    console.error('Error in /api/me:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 