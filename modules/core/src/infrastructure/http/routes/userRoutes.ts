import { Router } from 'express';
import { UserService } from '../../../application/services/UserService';
import { createValidateToken, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';
import { UserRole } from '../../../domain/enums/UserRole';
import { IUserRepository } from '../../repositories/UserRepository';
import { PrismaAdapter } from '../../adapters/PrismaAdapter';

const router = Router();

// Schema de validação para atualização de perfil
const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
});

export function userRoutes(userService: UserService, userRepository: IUserRepository) {
  const authMiddleware = createValidateToken(userRepository);
  const adminMiddleware = requireRole([UserRole.ADMIN]);

  // Obter perfil do usuário logado
  router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await userService.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(PrismaAdapter.toDomainUser(user).toJSON());
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Atualizar perfil do usuário logado
  router.put('/me', 
    authMiddleware, 
    validate(updateProfileSchema),
    async (req, res) => {
      try {
        const user = await userService.updateUser(req.user!.userId, req.body);
        res.json(PrismaAdapter.toDomainUser(user).toJSON());
      } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  );

  // Obter perfil público de um usuário
  router.get('/:id', async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(PrismaAdapter.toDomainUser(user).toJSON());
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Atualizar perfil de um usuário (admin only)
  router.put('/:id/profile',
    authMiddleware,
    adminMiddleware,
    validate(updateProfileSchema),
    async (req, res) => {
      try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(PrismaAdapter.toDomainUser(user).toJSON());
      } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  );

  // Listar usuários (admin only)
  router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await userService.getUsers({ page, limit });
      res.json({
        users: result.users.map(user => PrismaAdapter.toDomainUser(user).toJSON()),
        total: result.total,
        page,
        limit,
      });
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Ativar usuário (admin only)
  router.post('/:id/activate', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const user = await userService.updateUserStatus(req.params.id, 'ACTIVE');
      res.json(PrismaAdapter.toDomainUser(user).toJSON());
    } catch (error) {
      console.error('Error activating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Desativar usuário (admin only)
  router.post('/:id/deactivate', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const user = await userService.updateUserStatus(req.params.id, 'INACTIVE');
      res.json(PrismaAdapter.toDomainUser(user).toJSON());
    } catch (error) {
      console.error('Error deactivating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
} 