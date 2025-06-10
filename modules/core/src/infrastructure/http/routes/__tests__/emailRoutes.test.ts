import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { EmailRoutes } from '../emailRoutes';
import { EmailService } from '../../../../application/services/EmailService';
import { UserRole } from '../../../../domain/enums/UserRole';
import { IUserRepository } from '../../../repositories/UserRepository';
import { User } from '../../../../domain/entities/User';
import { UserStatus } from '../../../../domain/enums/UserStatus';
import { UserRepository } from '../../../repositories/UserRepository';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '../../../adapters/PrismaAdapter';

jest.mock('../../../../application/services/EmailService');

describe('EmailRoutes', () => {
  let app: express.Application;
  let emailService: jest.Mocked<EmailService>;
  let mockPrisma: jest.Mocked<PrismaClient>;
  let mockPrismaAdapter: jest.Mocked<PrismaAdapter>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  const JWT_SECRET = 'test-secret';

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    } as unknown as jest.Mocked<PrismaClient>;

    mockPrismaAdapter = {
      toDomainUser: jest.fn(),
      toPrismaUser: jest.fn()
    } as unknown as jest.Mocked<PrismaAdapter>;

    emailService = new EmailService() as jest.Mocked<EmailService>;
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn()
    };

    const routes = new EmailRoutes(emailService, mockUserRepository);
    app = express();
    app.use(express.json());
    app.use('/email', routes.getRouter());
  });

  describe('POST /email/verify', () => {
    const verifyData = {
      token: 'valid-verification-token'
    };

    it('should verify email successfully', async () => {
      emailService.verifyEmail.mockResolvedValue();

      const response = await request(app)
        .post('/email/verify')
        .send({ token: 'valid-token' })
        .expect(200);

      expect(response.body).toEqual({
        message: 'Email verified successfully'
      });
      expect(emailService.verifyEmail).toHaveBeenCalledWith('valid-token');
    });

    it('should handle invalid token', async () => {
      emailService.verifyEmail.mockRejectedValue(new Error('Invalid token'));

      const response = await request(app)
        .post('/email/verify')
        .send({ token: 'invalid-token' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid token'
      });
    });

    it('should handle missing token', async () => {
      emailService.verifyEmail.mockRejectedValue(new Error('Invalid verification token'));

      const response = await request(app)
        .post('/email/verify')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid verification token'
      });
    });
  });

  describe('POST /email/resend-verification', () => {
    const resendData = {
      email: 'test@example.com'
    };

    it('should resend verification email successfully', async () => {
      emailService.resendVerificationEmail.mockResolvedValue();

      const response = await request(app)
        .post('/email/resend-verification')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body).toEqual({
        message: 'Verification email sent successfully'
      });
      expect(emailService.resendVerificationEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle missing email', async () => {
      emailService.resendVerificationEmail.mockRejectedValue(new Error('Email is required'));

      const response = await request(app)
        .post('/email/resend-verification')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'Email is required'
      });
    });

    it('should handle invalid email', async () => {
      emailService.resendVerificationEmail.mockRejectedValue(new Error('Invalid email'));

      const response = await request(app)
        .post('/email/resend-verification')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid email'
      });
    });
  });

  describe('POST /email/forgot-password', () => {
    const forgotPasswordData = {
      email: 'test@example.com'
    };

    it('should send password reset email successfully', async () => {
      emailService.sendPasswordResetEmail.mockResolvedValue();

      const response = await request(app)
        .post('/email/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body).toEqual({
        message: 'Password reset email sent successfully'
      });
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle missing email', async () => {
      emailService.sendPasswordResetEmail.mockRejectedValue(new Error('Email is required'));

      const response = await request(app)
        .post('/email/forgot-password')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'Email is required'
      });
    });

    it('should handle invalid email', async () => {
      emailService.sendPasswordResetEmail.mockRejectedValue(new Error('Invalid email'));

      const response = await request(app)
        .post('/email/forgot-password')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid email'
      });
    });
  });

  describe('POST /email/reset-password', () => {
    const resetPasswordData = {
      token: 'valid-reset-token',
      newPassword: 'newPassword123'
    };

    it('should reset password successfully', async () => {
      emailService.resetPassword.mockResolvedValue();

      const response = await request(app)
        .post('/email/reset-password')
        .send({
          token: 'valid-token',
          newPassword: 'newPassword123'
        })
        .expect(200);

      expect(response.body).toEqual({
        message: 'Password reset successfully'
      });
      expect(emailService.resetPassword).toHaveBeenCalledWith('valid-token', 'newPassword123');
    });

    it('should handle missing token or password', async () => {
      emailService.resetPassword.mockRejectedValue(new Error('Token and new password are required'));

      const response = await request(app)
        .post('/email/reset-password')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'Token and new password are required'
      });
    });

    it('should handle invalid token', async () => {
      emailService.resetPassword.mockRejectedValue(new Error('Invalid reset token'));

      const response = await request(app)
        .post('/email/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'newPassword123'
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Invalid reset token'
      });
    });
  });

  describe('POST /email/send', () => {
    const sendEmailData = {
      to: ['test@example.com'],
      subject: 'Test Subject',
      body: 'Test Body',
      template: 'welcome',
      data: { name: 'John' }
    };

    const adminUser = new User({
      id: '123',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const regularUser = new User({
      id: '456',
      name: 'Regular User',
      email: 'user@example.com',
      password: 'hashed_password',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    it('should allow admin to send email', async () => {
      const token = jwt.sign(
        { userId: adminUser.id, email: adminUser.email, role: adminUser.role },
        JWT_SECRET
      );

      mockUserRepository.findById.mockResolvedValue(adminUser);
      emailService.send.mockResolvedValue();

      const response = await request(app)
        .post('/email/send')
        .set('Authorization', `Bearer ${token}`)
        .send(sendEmailData)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Email sent successfully'
      });
      expect(emailService.send).toHaveBeenCalledWith(sendEmailData);
    });

    it('should deny access for non-admin users', async () => {
      const token = jwt.sign(
        { userId: regularUser.id, email: regularUser.email, role: regularUser.role },
        JWT_SECRET
      );

      mockUserRepository.findById.mockResolvedValue(regularUser);

      const response = await request(app)
        .post('/email/send')
        .set('Authorization', `Bearer ${token}`)
        .send(sendEmailData)
        .expect(403);

      expect(response.body).toEqual({
        message: 'Insufficient permissions'
      });
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/email/send')
        .send(sendEmailData)
        .expect(401);

      expect(response.body).toEqual({
        message: 'Authentication token is required'
      });
    });

    it('should handle email sending error', async () => {
      const token = jwt.sign({ userId: adminUser.id }, JWT_SECRET);
      mockUserRepository.findById.mockResolvedValue(adminUser);
      emailService.send.mockRejectedValue(new Error('Failed to send email'));

      const response = await request(app)
        .post('/email/send')
        .set('Authorization', `Bearer ${token}`)
        .send(sendEmailData)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Failed to send email'
      });
      expect(emailService.send).toHaveBeenCalledWith(sendEmailData);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/email/send')
        .send({
          to: 'test@example.com',
          subject: 'Test',
          body: 'Test'
        })
        .expect(401);

      expect(response.body).toEqual({
        message: 'Authentication token is required'
      });
    });

    it('should return 403 when user is not admin', async () => {
      const regularUser = new User({
        id: '456',
        name: 'Regular User',
        email: 'user@example.com',
        password: 'hashed_password',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const token = jwt.sign({ userId: regularUser.id }, JWT_SECRET);
      mockUserRepository.findById.mockResolvedValue(regularUser);

      const response = await request(app)
        .post('/email/send')
        .set('Authorization', `Bearer ${token}`)
        .send({
          to: 'test@example.com',
          subject: 'Test',
          body: 'Test'
        })
        .expect(403);

      expect(response.body).toEqual({
        message: 'Insufficient permissions'
      });
    });

    it('should return 400 when required fields are missing', async () => {
      const adminUser = new User({
        id: '123',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashed_password',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const token = jwt.sign({ userId: adminUser.id }, JWT_SECRET);
      mockUserRepository.findById.mockResolvedValue(adminUser);

      const response = await request(app)
        .post('/email/send')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            expected: 'array',
            message: 'Required',
            path: ['to'],
            received: 'undefined'
          },
          {
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
            path: ['subject'],
            received: 'undefined'
          },
          {
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
            path: ['body'],
            received: 'undefined'
          }
        ]
      });
    });
  });

  describe('Constructor', () => {
    it('should create instance with default dependencies', () => {
      const routes = new EmailRoutes();
      expect(routes).toBeInstanceOf(EmailRoutes);
    });

    it('should create instance with provided dependencies', () => {
      const emailService = new EmailService();
      const userRepository = new UserRepository();
      const routes = new EmailRoutes(emailService, userRepository);
      expect(routes).toBeInstanceOf(EmailRoutes);
    });
  });
}); 