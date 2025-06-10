import { Router } from 'express';
import { AuthRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { EmailRoutes } from './emailRoutes';
import { profileRoutes } from './profileRoutes';
import { AuthService } from '../../../application/services/AuthService';
import { UserService } from '../../../application/services/UserService';
import { EmailService } from '../../../application/services/EmailService';
import { UserProfileService } from '../../../application/services/UserProfileService';
import { UserRepository } from '../../repositories/UserRepository';
import { UserProfileRepository } from '../../repositories/UserProfileRepository';
import { EventEmitter } from 'events';
import v1Router from './v1';
import metricsRoutes from './admin/metrics';
import activitiesRoutes from './admin/activities';
import { prisma } from '@lib/prisma';

const router = Router();
const userRepository = new UserRepository(prisma);
const userProfileRepository = new UserProfileRepository(prisma);
const eventEmitter = new EventEmitter();

const authService = new AuthService(userRepository);
const userService = new UserService(userRepository, eventEmitter);
const emailService = new EmailService(userRepository);
const userProfileService = new UserProfileService(userProfileRepository, userRepository);

const authRoutes = new AuthRoutes(authService, userRepository);
const emailRoutes = new EmailRoutes(emailService, userRepository);

// API version routes
router.use('/v1', v1Router);

router.use('/auth', authRoutes.getRouter());
router.use('/users', userRoutes(userService, userRepository));
router.use('/email', emailRoutes.getRouter());
router.use('/profiles', profileRoutes(userProfileService, userRepository, userProfileRepository));

// Admin routes
router.use('/admin', [metricsRoutes, activitiesRoutes]);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

export default router;