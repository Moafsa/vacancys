import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createValidateToken, requireRole } from '../auth';
import { UserRole } from '../../../../domain/enums/UserRole';
import { TokenPayload } from '../../../../domain/types/TokenPayload';
import { UserRepository } from '../../../../domain/user/UserRepository';
import { User } from '../../../../domain/entities/User';
import { IUserRepository } from '../../../repositories/UserRepository';

jest.mock('../../../repositories/UserRepository');

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn().mockResolvedValue({ users: [], total: 0 }),
    } as any;

    process.env.JWT_SECRET = 'test-secret';
  });

  describe('createValidateToken', () => {
    it('should validate token and set user in request', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      } as User;

      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email, role: mockUser.role },
        process.env.JWT_SECRET!
      );

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const validateTokenMiddleware = createValidateToken(mockUserRepository);
      await validateTokenMiddleware(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toEqual({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should return 401 if no authorization header', async () => {
      const validateTokenMiddleware = createValidateToken(mockUserRepository);
      await validateTokenMiddleware(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Authentication token is required',
      });
    });

    it('should return 401 if invalid token format', async () => {
      mockReq.headers = {
        authorization: 'InvalidToken',
      };

      const validateTokenMiddleware = createValidateToken(mockUserRepository);
      await validateTokenMiddleware(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid token format',
      });
    });

    it('should return 401 if user not found', async () => {
      const token = jwt.sign(
        { userId: 'invalid-user', email: 'test@example.com', role: UserRole.USER },
        process.env.JWT_SECRET!
      );

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      mockUserRepository.findById.mockResolvedValue(null);

      const validateTokenMiddleware = createValidateToken(mockUserRepository);
      await validateTokenMiddleware(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid user',
      });
    });

    it('should return 500 if JWT_SECRET is not configured', async () => {
      const token = jwt.sign(
        { userId: 'user-123', email: 'test@example.com', role: UserRole.USER },
        'some-secret'
      );

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      process.env.JWT_SECRET = '';

      const validateTokenMiddleware = createValidateToken(mockUserRepository);
      await validateTokenMiddleware(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });

      // Restore JWT_SECRET for other tests
      process.env.JWT_SECRET = 'test-secret';
    });

    it('should return 401 if token is invalid', async () => {
      mockReq.headers = {
        authorization: 'Bearer invalid.token.here',
      };

      const validateTokenMiddleware = createValidateToken(mockUserRepository);
      await validateTokenMiddleware(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid authentication token',
      });
    });

    it('should return 500 if repository throws error', async () => {
      const token = jwt.sign(
        { userId: 'user-123', email: 'test@example.com', role: UserRole.USER },
        process.env.JWT_SECRET!
      );

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      mockUserRepository.findById.mockRejectedValue(new Error('Database error'));

      const validateTokenMiddleware = createValidateToken(mockUserRepository);
      await validateTokenMiddleware(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });

  describe('requireRole', () => {
    it('should allow access if user has required role', () => {
      mockReq.user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      };

      const roleMiddleware = requireRole([UserRole.ADMIN]);
      roleMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 if no user in request', () => {
      const roleMiddleware = requireRole([UserRole.ADMIN]);
      roleMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Authentication required',
      });
    });

    it('should return 403 if user lacks required role', () => {
      mockReq.user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      const roleMiddleware = requireRole([UserRole.ADMIN]);
      roleMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Insufficient permissions',
      });
    });

    it('should allow access if user has one of multiple required roles', () => {
      mockReq.user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      };

      const roleMiddleware = requireRole([UserRole.USER, UserRole.ADMIN]);
      roleMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle empty roles array', () => {
      mockReq.user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      const roleMiddleware = requireRole([]);
      roleMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Insufficient permissions',
      });
    });
  });
}); 