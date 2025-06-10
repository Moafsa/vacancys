import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireServiceAuth } from '../../../../auth/serviceAuth';

const router = Router();
const prisma = new PrismaClient();

// Endpoint para buscar atividades recentes
router.get('/activities', requireServiceAuth('admin.activities.read'), async (req, res) => {
  try {
    // Buscar as últimas atividades do usuário
    const userActivities = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        status: true
      }
    });

    // Buscar os usuários que verificaram email recentemente
    const emailVerifications = await prisma.user.findMany({
      where: {
        isEmailVerified: true,
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    });

    // Formatar as atividades
    const activities = [
      ...userActivities.map(user => ({
        id: `user-${user.id}`,
        type: 'USER_CREATED' as const,
        description: 'registered an account',
        user: {
          id: user.id,
          name: user.name
        },
        timestamp: user.createdAt.toISOString(),
        metadata: {
          status: user.status
        }
      })),
      ...emailVerifications.map(user => ({
        id: `verification-${user.id}`,
        type: 'VERIFICATION_COMPLETED' as const,
        description: 'verified their email',
        user: {
          id: user.id,
          name: user.name
        },
        timestamp: user.updatedAt.toISOString()
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 10);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

export default router; 