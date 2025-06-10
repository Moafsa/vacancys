import { Router } from 'express';
import { UserProfileService } from '../../../application/services/UserProfileService';
import { createValidateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';
import { IUserRepository } from '../../repositories/UserRepository';
import { IUserProfileRepository } from '../../repositories/UserProfileRepository';
import { FileUploadService } from '../../../application/services/FileUploadService';
import { ProfileType } from '../../../domain/enums/ProfileType';

const router = Router();

// Schema de validação para criação de perfil
const createProfileSchema = z.object({
  type: z.enum(['FREELANCER', 'CLIENT']),
  bio: z.string().min(10).max(500).optional(),
  title: z.string().min(3).max(100).optional(),
  company: z.string().min(2).max(100).optional(),
  website: z.string().url().optional(),
  location: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(20).optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }).optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
  availability: z.boolean().optional(),
  avatarUrl: z.string().optional(),
});

// Schema de validação para atualização de perfil
const updateProfileSchema = createProfileSchema.partial().omit({ type: true });

export function profileRoutes(
  userProfileService: UserProfileService,
  userRepository: IUserRepository,
  _userProfileRepository: IUserProfileRepository
) {
  const authMiddleware = createValidateToken(userRepository);
  const fileUploadService = new FileUploadService();

  // Criar perfil
  router.post('/', 
    authMiddleware,
    validate(createProfileSchema),
    async (req, res) => {
      try {
        const profile = await userProfileService.createProfile(req.user!.userId, req.body);
        res.status(201).json(profile.toJSON());
      } catch (error) {
        console.error('Error creating profile:', error);
        if (error.message === 'User already has a profile') {
          return res.status(409).json({ message: error.message });
        }
        if (error.message === 'User not found') {
          return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  );

  // Atualizar perfil
  router.put('/', 
    authMiddleware,
    validate(updateProfileSchema),
    async (req, res) => {
      try {
        const profile = await userProfileService.updateProfile(req.user!.userId, req.body);
        res.json(profile.toJSON());
      } catch (error) {
        console.error('Error updating profile:', error);
        if (error.message === 'Profile not found') {
          return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  );

  // Upload de avatar
  router.post('/avatar', 
    authMiddleware,
    async (req, res) => {
      try {
        if (req.body instanceof Buffer) {
          return res.status(415).json({ message: 'Request body already parsed. bodyParser should be disabled for this route.' });
        }
        const { files, fields } = await fileUploadService.parseRequest(req);
        if (!files || !files.avatar) {
          return res.status(400).json({ message: 'No avatar file uploaded' });
        }
        const type = (fields && fields.type) || req.query.type || req.body.type;
        if (!type || !Object.values(ProfileType).includes(type)) {
          return res.status(400).json({ message: 'Profile type (FREELANCER or CLIENT) is required' });
        }
        const profile = await userProfileService.uploadAvatar(req.user!.userId, type as ProfileType, files.avatar);
        res.json({ 
          message: 'Avatar uploaded successfully',
          avatarUrl: profile.avatarUrl,
          profile: profile.toJSON()
        });
      } catch (error) {
        console.error('Error uploading avatar:', error);
        if (error.message === 'Profile not found') {
          return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  );

  // Obter perfil do usuário logado
  router.get('/', 
    authMiddleware,
    async (req, res) => {
      try {
        const typeRaw = req.query.type;
        const type = Array.isArray(typeRaw) ? typeRaw[0] : typeRaw;
        if (!type || !Object.values(ProfileType).includes(type as ProfileType)) {
          return res.status(400).json({ message: 'Profile type (FREELANCER or CLIENT) is required' });
        }
        const profile = await userProfileService.getProfile(req.user!.userId, type as ProfileType);
        if (!profile) {
          return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile.toJSON());
      } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  );

  // Obter perfil público de um usuário
  router.get('/:userId', async (req, res) => {
    try {
      const typeRaw = req.query.type;
      const type = Array.isArray(typeRaw) ? typeRaw[0] : typeRaw;
      if (!type || !Object.values(ProfileType).includes(type as ProfileType)) {
        return res.status(400).json({ message: 'Profile type (FREELANCER or CLIENT) is required' });
      }
      const profile = await userProfileService.getProfile(req.params.userId, type as ProfileType);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json(profile.toJSON());
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Deletar perfil
  router.delete('/', 
    authMiddleware,
    async (req, res) => {
      try {
        const typeRaw = req.query.type;
        const type = Array.isArray(typeRaw) ? typeRaw[0] : typeRaw;
        if (!type || !Object.values(ProfileType).includes(type as ProfileType)) {
          return res.status(400).json({ message: 'Profile type (FREELANCER or CLIENT) is required' });
        }
        await userProfileService.deleteProfile(req.user!.userId, type as ProfileType);
        res.status(204).send();
      } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  );

  return router;
} 