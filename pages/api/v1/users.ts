// API middleware to forward requests to the real backend API
import { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from '../../../modules/core/src/application/services/UserService';
import { UserRepository } from '../../../modules/core/src/infrastructure/repositories/UserRepository';
import { EventEmitter } from 'events';
import { moduleRegistry } from '../../../modules/core/src/infrastructure/moduleRegistry';
import { registerCoreHooks } from '../../../modules/core/src/hooks';
import { prisma } from '../../../src/lib/prisma';

const userRepository = new UserRepository(prisma);
const eventEmitter = new EventEmitter();
const userService = new UserService(userRepository, eventEmitter);

registerCoreHooks({});

export default async function handler(req, res) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const { page = 1, limit = 10, search, role, status, verified } = req.query;
      const params = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search,
        role,
        status,
        verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
      };
      const result = await moduleRegistry.doAction('core.users.list', params);
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      console.log('[API] /api/v1/users - POST body:', req.body);
      const { name, email, password, role, status } = req.body;
      if (!name || !email || !password || !role || !status) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const user = await moduleRegistry.doAction('core.users.create', { name, email, password, role, status });
      return res.status(201).json(user);
    }

    if (req.method === 'PUT') {
      console.log('[API] /api/v1/users - PUT body:', req.body);
      const { id, data } = req.body;
      if (!id || !data) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      const user = await moduleRegistry.doAction('core.users.update', { id, data });
      return res.status(200).json(user);
    }

    if (req.method === 'DELETE') {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'Missing user ID' });
      }
      await moduleRegistry.doAction('core.users.delete', { id: userId });
      return res.status(204).send();
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('[API] /api/v1/users - ERROR:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    } else {
      res.status(500).json({ message: 'Internal server error', error });
    }
  }
} 