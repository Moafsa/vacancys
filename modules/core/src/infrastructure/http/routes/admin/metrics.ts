import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireServiceAuth } from '../../../../auth/serviceAuth';

const router = Router();
const prisma = new PrismaClient();

router.get('/metrics', requireServiceAuth('admin.metrics.read'), async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalFreelancers,
      totalClients,
      pendingVerifications,
      totalProjects,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users
      prisma.user.count({
        where: {
          status: 'ACTIVE',
        },
      }),
      
      // Total freelancers
      prisma.freelancerProfile.count(),
      
      // Total clients
      prisma.clientProfile.count(),
      
      // Pending verifications
      prisma.user.count({
        where: {
          isEmailVerified: false,
        },
      }),
      
      // Total projects (this will need to be fetched from the projects module)
      Promise.resolve(0), // Placeholder until projects module is integrated
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalFreelancers,
      totalClients,
      pendingVerifications,
      totalProjects,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

export default router; 