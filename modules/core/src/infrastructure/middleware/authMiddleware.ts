import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { UserRole } from '../../domain/enums/UserRole';
import { UserRepository } from '../repositories/UserRepository';
import { prisma } from '@lib/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    const userRepository = new UserRepository(prisma);
    this.authService = new AuthService(userRepository);
  }

  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const [, token] = authHeader.split(' ');
      if (!token) {
        res.status(401).json({ error: 'Invalid token format' });
        return;
      }

      const payload = await this.authService.validateToken(token);
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  requireRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    };
  };
} 