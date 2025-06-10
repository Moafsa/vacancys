import { User } from './User';

/**
 * Interface for user data persistence operations
 */
export interface UserRepository {
  /**
   * Creates a new user in the repository
   * @param user User data to be created
   * @returns Created user with generated ID
   */
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;

  /**
   * Updates an existing user in the repository
   * @param id User ID
   * @param user Updated user data
   * @returns Updated user data
   */
  update(id: string, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User>;

  /**
   * Finds a user by their ID
   * @param id User ID
   * @returns User data if found, null otherwise
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their email address
   * @param email User email
   * @returns User data if found, null otherwise
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Lists all users in the repository
   * @returns Array of users
   */
  findAll(): Promise<User[]>;

  /**
   * Deletes a user from the repository
   * @param id User ID
   * @returns true if user was deleted, false if user was not found
   */
  delete(id: string): Promise<boolean>;
} 