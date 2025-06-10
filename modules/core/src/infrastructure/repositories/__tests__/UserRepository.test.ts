import { UserRepository } from '../UserRepository';
import { User, IUser } from '../../../domain/entities/User';
import { UserRole } from '../../../domain/enums/UserRole';
import { UserStatus } from '../../../domain/enums/UserStatus';

// Mock base user for tests
const mockPrismaUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  isEmailVerified: false,
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock do PrismaClient
const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn()
  }
} as any;

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = new UserRepository();
    (userRepository as any).prisma = mockPrisma;

    // Setup default mock implementations
    mockPrisma.user.create.mockResolvedValue(mockPrismaUser);
    mockPrisma.user.findUnique.mockResolvedValue(mockPrismaUser);
    mockPrisma.user.update.mockResolvedValue(mockPrismaUser);
    mockPrisma.user.delete.mockResolvedValue(mockPrismaUser);
    mockPrisma.user.findMany.mockResolvedValue([mockPrismaUser]);
    mockPrisma.user.count.mockResolvedValue(1);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: false,
        lastLoginAt: null
      };

      const result = await userRepository.create(userData);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('1');
      expect(result.email).toBe(userData.email);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining(userData)
      });
    });

    it('should throw error if creation fails', async () => {
      mockPrisma.user.create.mockRejectedValue(new Error('Creation failed'));

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: UserRole.USER,
        status: UserStatus.PENDING,
        isEmailVerified: false,
        lastLoginAt: null,
      };

      await expect(userRepository.create(userData)).rejects.toThrow('Creation failed');
    });

    it('should create a user with default values', async () => {
      const mockUser: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: false,
        lastLoginAt: null,
      };

      const createdUser = {
        ...mockUser,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.create = jest.fn().mockResolvedValue(createdUser);

      const result = await userRepository.create(mockUser);

      expect(result).toBeInstanceOf(User);
      expect(result.role).toBe(UserRole.USER);
      expect(result.status).toBe(UserStatus.ACTIVE);
      expect(result.isEmailVerified).toBe(false);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: mockUser,
      });
    });
  });

  describe('findById', () => {
    it('should find a user by id successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockPrismaUser);

      const result = await userRepository.findById('1');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(mockPrismaUser.id);
    });

    it('should return null when user is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.findById('nonexistent');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockPrismaUser);

      const result = await userRepository.findByEmail('test@example.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe(mockPrismaUser.email);
    });

    it('should return null when user is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.findByEmail('nonexistent@example.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        isEmailVerified: true
      };

      const updatedPrismaUser = {
        ...mockPrismaUser,
        ...updateData,
        updatedAt: new Date()
      };

      mockPrisma.user.update.mockResolvedValue(updatedPrismaUser);

      const result = await userRepository.update('1', updateData);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updateData,
          updatedAt: expect.any(Date)
        }
      });
      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe(updateData.name);
      expect(result.isEmailVerified).toBe(updateData.isEmailVerified);
    });

    it('should throw error if update fails', async () => {
      mockPrisma.user.update.mockRejectedValue(new Error('Update failed'));

      await expect(userRepository.update('1', { name: 'New Name' }))
        .rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      await userRepository.delete('1');

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });

    it('should not throw error if user does not exist', async () => {
      mockPrisma.user.delete.mockRejectedValue({
        code: 'P2025',
        message: 'Record to delete does not exist'
      });

      await expect(userRepository.delete('nonexistent')).resolves.not.toThrow();
    });

    it('should throw error for other delete failures', async () => {
      mockPrisma.user.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(userRepository.delete('1')).rejects.toThrow('Delete failed');
    });
  });

  describe('list', () => {
    it('should list users with pagination', async () => {
      const mockUsers = [
        { ...mockPrismaUser, id: '1' },
        { ...mockPrismaUser, id: '2' }
      ];
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.user.count.mockResolvedValue(2);

      const result = await userRepository.list({ page: 1, limit: 10 });

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' }
      });
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      result.users.forEach(user => {
        expect(user).toBeInstanceOf(User);
      });
    });

    it('should handle empty result', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      const result = await userRepository.list({ page: 1, limit: 10 });

      expect(result.users).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should calculate correct skip value for pagination', async () => {
      await userRepository.list({ page: 2, limit: 5 });

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
    });
  });
}); 