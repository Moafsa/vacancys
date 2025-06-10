import { UserRole } from '../../domain/user/UserRole';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
} 