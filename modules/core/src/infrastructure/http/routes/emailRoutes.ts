import { Router } from 'express';
import { EmailService } from '../../../application/services/EmailService';
import { createValidateToken, requireRole } from '../middleware/auth';
import { UserRole } from '../../../domain/enums/UserRole';
import { IUserRepository, UserRepository } from '../../repositories/UserRepository';
import { validate } from '../middleware/validate';
import { z } from 'zod';
import { prisma } from '@lib/prisma';

export class EmailRoutes {
  private router: Router;
  private emailService: EmailService;
  private validateToken: ReturnType<typeof createValidateToken>;
  private userRepository: IUserRepository;

  constructor(emailService?: EmailService, userRepository?: IUserRepository) {
    this.router = Router();
    this.userRepository = userRepository || new UserRepository(prisma);
    this.emailService = emailService || new EmailService(this.userRepository);
    const repository = this.userRepository;
    this.validateToken = createValidateToken(repository);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/v1/email/send:
     *   post:
     *     tags: [Email]
     *     summary: Send email
     *     description: Send an email to a user or multiple users
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - to
     *               - subject
     *               - body
     *             properties:
     *               to:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: email
     *               subject:
     *                 type: string
     *               body:
     *                 type: string
     *               template:
     *                 type: string
     *               data:
     *                 type: object
     *     responses:
     *       200:
     *         description: Email sent successfully
     *       400:
     *         description: Invalid request body
     *       401:
     *         description: Not authenticated
     */
    this.router.post(
      '/send',
      validate(
        z.object({
          to: z.array(z.string().email()),
          subject: z.string(),
          body: z.string(),
          template: z.string().optional(),
          data: z.record(z.any()).optional()
        })
      ),
      this.validateToken,
      requireRole([UserRole.ADMIN]),
      this.sendEmail.bind(this)
    );

    /**
     * @swagger
     * /api/v1/email/templates:
     *   get:
     *     tags: [Email]
     *     summary: List email templates
     *     description: Get a list of available email templates
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of email templates
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   name:
     *                     type: string
     *                   description:
     *                     type: string
     *       401:
     *         description: Not authenticated
     */
    this.router.get(
      '/templates',
      this.validateToken,
      requireRole([UserRole.ADMIN]),
      this.listTemplates.bind(this)
    );

    // Public routes
    this.router.post('/verify', this.verifyEmail.bind(this));
    this.router.post('/resend-verification', this.resendVerificationEmail.bind(this));
    this.router.post('/forgot-password', this.forgotPassword.bind(this));
    this.router.post('/reset-password', this.resetPassword.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async verifyEmail(req: any, res: any): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        throw new Error('Invalid verification token');
      }
      await this.emailService.verifyEmail(token);
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  private async resendVerificationEmail(req: any, res: any): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error('Email is required');
      }
      await this.emailService.resendVerificationEmail(email);
      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  private async forgotPassword(req: any, res: any): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error('Email is required');
      }
      await this.emailService.sendPasswordResetEmail(email, '');
      res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  private async resetPassword(req: any, res: any): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        throw new Error('Token and new password are required');
      }
      await this.emailService.resetPassword(token, newPassword);
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  private async sendEmail(req: any, res: any): Promise<void> {
    try {
      const { to, subject, body, template, data } = req.body;
      await this.emailService.send({
        to: Array.isArray(to) ? to : [to],
        subject,
        body,
        template,
        data
      });
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  private async listTemplates(req: any, res: any): Promise<void> {
    try {
      const templates = await this.emailService.listTemplates();
      res.json(templates);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
} 