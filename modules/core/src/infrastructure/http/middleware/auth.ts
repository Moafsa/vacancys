import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../repositories/UserRepository';
import { UserRole } from '../../../domain/enums/UserRole';
import { PrismaAdapter } from '../../adapters/PrismaAdapter';

interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const createValidateToken = (userRepository: IUserRepository): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authentication token is required' });
      }

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Invalid token format' });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET is not configured');
        return res.status(500).json({ message: 'Internal server error' });
      }

      const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
      
      try {
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
      }

      req.user = {
        userId: user.id,
        email: user.email,
        role: PrismaAdapter.toDomainUserRole(user.role)
      };

      next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid authentication token' });
      }
      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export const requireRole = (roles: UserRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
}; 