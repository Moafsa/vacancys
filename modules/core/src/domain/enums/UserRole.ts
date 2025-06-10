/**
 * Enum representing possible user roles in the system
 */
export enum UserRole {
  /**
   * Administrator with full system access
   */
  ADMIN = 'ADMIN',
  
  /**
   * Regular user with limited access
   */
  USER = 'USER',

  /**
   * Client user with access to client features
   */
  CLIENT = 'CLIENT',

  /**
   * Freelancer user with access to freelancer features
   */
  FREELANCER = 'FREELANCER',
}
