import { UserRole } from '../enums/UserRole';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
} 