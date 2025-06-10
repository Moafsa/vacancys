import { Router, Request, Response } from 'express';
import { AuthService, RegisterData } from '../../../application/services/AuthService';
import { createValidateToken, requireRole } from '../middleware/auth';
import { UserRole } from '../../../domain/enums/UserRole';
import { IUserRepository, UserRepository } from '../../repositories/UserRepository';
import { validate } from '../middleware/validate';
import { z } from 'zod';
import { prisma } from '@lib/prisma';
import { PrismaAdapter } from '../../adapters/PrismaAdapter';

export class AuthRoutes {
  private router: Router;
  private authService: AuthService;
  private userRepository: IUserRepository;
  private validateToken: ReturnType<typeof createValidateToken>;

  constructor(authService?: AuthService, userRepository?: IUserRepository) {
    this.router = Router();
    this.userRepository = userRepository || new UserRepository(prisma);
    this.authService = authService || new AuthService(this.userRepository);
    this.validateToken = createValidateToken(this.userRepository);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/v1/auth/login:
     *   post:
     *     tags: [Authentication]
     *     summary: Login user
     *     description: Authenticate user and return JWT token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 format: password
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *       401:
     *         description: Invalid credentials
     *       400:
     *         description: Invalid request body
     */
    this.router.post(
      '/login',
      validate(
        z.object({
          email: z.string().email(),
          password: z.string().min(6)
        })
      ),
      async (req, res) => {
        try {
          const { email, password } = req.body;
          const result = await this.authService.login(email, password);
          res.json({ success: true, token: result.token, user: result.user });
        } catch (error) {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    );

    /**
     * @swagger
     * /api/v1/auth/register:
     *   post:
     *     tags: [Authentication]
     *     summary: Register new user
     *     description: Create a new user account
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - name
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 format: password
     *               name:
     *                 type: string
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid request body or email already exists
     */
    this.router.post(
      '/register',
      validate(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
          name: z.string().min(2)
        })
      ),
      async (req, res) => {
        try {
          const { email, password, name } = req.body;
          const registerData: RegisterData = { email, password, name };
          const user = await this.authService.register(registerData);
          res.status(201).json(user);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      }
    );

    // Verificação de email e reset de senha
    this.router.post('/verify-email', this.verifyEmail);
    this.router.post('/reset-password/request', this.requestPasswordReset);
    this.router.post('/reset-password/confirm', this.confirmPasswordReset);

    // Rotas protegidas de exemplo
    this.router.get(
      '/admin',
      this.validateToken,
      requireRole([UserRole.ADMIN]),
      this.adminRoute
    );

    /**
     * @swagger
     * /api/v1/auth/me:
     *   get:
     *     tags: [Authentication]
     *     summary: Get current user
     *     description: Get the currently authenticated user's information
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Current user information
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       401:
     *         description: Not authenticated
     */
    this.router.get('/me', this.validateToken, async (req: Request, res: Response) => {
      try {
        if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
        const user = await this.userRepository.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        const domainUser = PrismaAdapter.toDomainUser(user);
        return res.json(domainUser.toJSON());
      } catch (error) {
        console.error('Error getting user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  }

  private register = async (req: any, res: any): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const user = await this.authService.register({ name, email, password });
      res.status(201).json(user.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  private login = async (req: any, res: any): Promise<void> => {
    try {
      const { email, password } = req.body;
      const response = await this.authService.login(email, password);
      res.json(response);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };

  private verifyEmail = async (req: any, res: any): Promise<void> => {
    try {
      const { userId } = req.body;
      await this.authService.verifyEmail(userId);
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  private requestPasswordReset = async (req: any, res: any): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.resetPassword(email);
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  private confirmPasswordReset = async (req: any, res: any): Promise<void> => {
    try {
      const { token } = req.body;
      await this.authService.validateToken(token);
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  private adminRoute = async (req: any, res: any): Promise<void> => {
    res.json({ message: 'Admin route accessed successfully' });
  };

  public getRouter(): Router {
    return this.router;
  }
} 