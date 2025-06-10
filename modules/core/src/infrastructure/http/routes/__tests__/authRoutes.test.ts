import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { AuthRoutes } from '../authRoutes';
import { AuthService, LoginResponse } from '../../../../application/services/AuthService';
import { UserRole } from '../../../../domain/enums/UserRole';
import { UserStatus } from '../../../../domain/enums/UserStatus';
import { User } from '../../../../domain/entities/User';
import { IUserRepository } from '../../../repositories/UserRepository';

// Mock do AuthService
const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  validateToken: jest.fn(),
  verifyEmail: jest.fn(),
  resetPassword: jest.fn()
} as unknown as jest.Mocked<AuthService>;

// Mock do UserRepository
const mockUserRepository: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  list: jest.fn()
};

// Mock do construtor do AuthService
jest.mock('../../../../application/services/AuthService', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => mockAuthService)
  };
});

describe('AuthRoutes', () => {
  let app: express.Application;
  let authRoutes: AuthRoutes;
  const JWT_SECRET = 'test-secret';

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    jest.clearAllMocks();

    // Configurar o router antes de cada teste
    authRoutes = new AuthRoutes(mockAuthService, mockUserRepository);
    app.use('/auth', authRoutes.getRouter());
  });

  describe('Constructor', () => {
    it('should create instance with provided authService and userRepository', () => {
      const authRoutes = new AuthRoutes(mockAuthService, mockUserRepository);
      expect(authRoutes.getRouter()).toBeDefined();
    });

    it('should create instance with default authService', () => {
      const authRoutes = new AuthRoutes(undefined, mockUserRepository);
      expect(authRoutes.getRouter()).toBeDefined();
      expect(AuthService).toHaveBeenCalled();
    });

    it('should create instance with default repository from authService', () => {
      const mockGetUserRepo = jest.fn().mockReturnValue(mockUserRepository);
      const mockAuthServiceWithRepo = {
        ...mockAuthService,
        getUserRepository: mockGetUserRepo
      } as unknown as AuthService;

      const authRoutes = new AuthRoutes(mockAuthServiceWithRepo);
      expect(authRoutes.getRouter()).toBeDefined();
      expect(mockGetUserRepo).toHaveBeenCalled();
    });
  });

  describe('POST /auth/register', () => {
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should register a new user successfully', async () => {
      const mockUser = new User({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: false,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      mockAuthService.register.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      expect(response.body).toEqual({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: false,
        lastLoginAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should return 400 when email is already registered', async () => {
      mockAuthService.register.mockRejectedValue(new Error('Email already registered'));

      const response = await request(app)
        .post('/auth/register')
        .send(registerData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Email already registered'
      });
    });
  });

  describe('POST /auth/login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should login successfully', async () => {
      const mockUser = new User({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: false,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const mockLoginResponse: LoginResponse = {
        user: mockUser.toJSON(),
        token: 'jwt-token'
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toEqual({
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          isEmailVerified: false,
          lastLoginAt: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        },
        token: 'jwt-token'
      });
    });

    it('should return 401 for invalid credentials', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toEqual({
        error: 'Invalid credentials'
      });
    });
  });

  describe('POST /auth/verify-email', () => {
    const userId = '123';

    it('should verify email successfully', async () => {
      mockAuthService.verifyEmail.mockResolvedValue(undefined);

        const response = await request(app)
        .post('/auth/verify-email')
        .send({ userId })
          .expect(200);

      expect(response.body).toEqual({
        message: 'Email verified successfully'
      });
      });

    it('should return 400 for verification error', async () => {
      mockAuthService.verifyEmail.mockRejectedValue(new Error('Verification failed'));

        const response = await request(app)
        .post('/auth/verify-email')
        .send({ userId })
          .expect(400);

      expect(response.body).toEqual({
        error: 'Verification failed'
      });
    });
  });

  describe('GET /auth/me', () => {
    it('should return 401 when not authenticated', async () => {
        const response = await request(app)
        .get('/auth/me')
          .expect(401);

      expect(response.body).toEqual({
        message: 'Authentication token is required'
      });
    });

    it('should return 404 when user not found', async () => {
      const token = jwt.sign({ userId: 'non-existent-id', email: 'test@example.com', role: UserRole.USER }, JWT_SECRET);
      mockUserRepository.findById.mockResolvedValue(null);

        const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toEqual({
        error: 'User not found'
    });
  });

    it('should return current user when authenticated', async () => {
      const mockUser = new User({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const token = jwt.sign({ userId: mockUser.id }, JWT_SECRET);

        const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        lastLoginAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });
  });

    describe('POST /auth/reset-password/request', () => {
      it('should request password reset successfully', async () => {
        mockAuthService.resetPassword.mockResolvedValue(undefined);

        const response = await request(app)
          .post('/auth/reset-password/request')
        .send({ email: 'test@example.com' })
          .expect(200);

        expect(response.body).toEqual({
        message: 'Password reset email sent'
        });
      });

    it('should return 400 for reset request error', async () => {
      mockAuthService.resetPassword.mockRejectedValue(new Error('Reset request failed'));

        const response = await request(app)
          .post('/auth/reset-password/request')
        .send({ email: 'test@example.com' })
        .expect(400);

        expect(response.body).toEqual({
        error: 'Reset request failed'
      });
    });
  });

  describe('POST /auth/reset-password/confirm', () => {
    it('should confirm password reset successfully', async () => {
      mockAuthService.validateToken.mockResolvedValue(undefined);

        const response = await request(app)
        .post('/auth/reset-password/confirm')
        .send({ token: 'valid-token' })
          .expect(200);

      expect(response.body).toEqual({
        message: 'Password reset successful'
      });
    });

    it('should return 400 for invalid reset token', async () => {
      mockAuthService.validateToken.mockRejectedValue(new Error('Invalid token'));

        const response = await request(app)
        .post('/auth/reset-password/confirm')
        .send({ token: 'invalid-token' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid token'
      });
    });
  });
}); 