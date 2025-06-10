import { UserRole } from '../enums/UserRole';

/**
 * Interface representing a user in the system
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;

  /**
   * User's email address (unique)
   */
  email: string;

  /**
   * User's full name
   */
  name: string;

  /**
   * Hashed password
   */
  password: string;

  /**
   * User's role in the system
   */
  role: UserRole;

  /**
   * Flag indicating if the user's email is verified
   */
  isEmailVerified: boolean;

  /**
   * Flag indicating if the user is active
   */
  isActive: boolean;

  /**
   * Timestamp when the user was created
   */
  createdAt: Date;

  /**
   * Timestamp when the user was last updated
   */
  updatedAt: Date;
} 