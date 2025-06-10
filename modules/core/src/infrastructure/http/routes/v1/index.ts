import { Router } from 'express';
import { AuthRoutes } from '../authRoutes';
import { EmailRoutes } from '../emailRoutes';
import { userRoutes } from '../userRoutes';
import { profileRoutes } from '../profileRoutes';
import { UserService } from '../../../../application/services/UserService';
import { AuthService } from '../../../../application/services/AuthService';
import { EmailService } from '../../../../application/services/EmailService';
import { UserProfileService } from '../../../../application/services/UserProfileService';
import { UserRepository } from '../../../repositories/UserRepository';
import { UserProfileRepository } from '../../../repositories/UserProfileRepository';
import { EventEmitter } from 'events';
import { prisma } from '@lib/prisma';

const router = Router();

// Initialize services and repositories
const eventEmitter = new EventEmitter();
const userRepository = new UserRepository(prisma);
const userProfileRepository = new UserProfileRepository(prisma);
const userService = new UserService(userRepository, eventEmitter);
const authService = new AuthService(userRepository);
const emailService = new EmailService(userRepository);
const userProfileService = new UserProfileService(userProfileRepository, userRepository);

// Initialize route handlers
const authRoutes = new AuthRoutes(authService, userRepository);
const emailRoutes = new EmailRoutes(emailService, userRepository);

// Mount routes
router.use('/auth', authRoutes.getRouter());
router.use('/email', emailRoutes.getRouter());
router.use('/users', userRoutes(userService, userRepository));
router.use('/profiles', profileRoutes(userProfileService, userRepository, userProfileRepository));

export default router; 