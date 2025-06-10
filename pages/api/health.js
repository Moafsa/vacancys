import { prisma } from '../../src/lib/prisma';
import { getRedisClient } from '../../lib/redis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'checking',
      redis: 'checking'
    }
  };

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'degraded';
    console.error('Database health check failed:', error);
  }

  // Check Redis connection
  try {
    const redis = getRedisClient();
    if (redis && redis.ping) {
      await redis.ping();
      health.services.redis = 'healthy';
    } else {
      health.services.redis = 'not configured';
    }
  } catch (error) {
    health.services.redis = 'unhealthy';
    health.status = 'degraded';
    console.error('Redis health check failed:', error);
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(health);
} 