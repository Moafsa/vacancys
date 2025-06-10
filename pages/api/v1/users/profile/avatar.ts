import { NextApiRequest, NextApiResponse } from 'next';
import { UserProfileService } from '../../../../../modules/core/src/application/services/UserProfileService';
import { UserRepository } from '../../../../../modules/core/src/infrastructure/repositories/UserRepository';
import { UserProfileRepository } from '../../../../../modules/core/src/infrastructure/repositories/UserProfileRepository';
import { FileUploadService } from '../../../../../modules/core/src/application/services/FileUploadService';
import { prisma } from '../../../../../src/lib/prisma';
import { ProfileType } from '../../../../../modules/core/src/domain/enums/ProfileType';
import jwt from 'jsonwebtoken';

// Instancia os serviços
const userRepository = new UserRepository(prisma);
const userProfileRepository = new UserProfileRepository(prisma);
const fileUploadService = new FileUploadService({
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
});
const userProfileService = new UserProfileService(userProfileRepository, userRepository, fileUploadService);

// Configuração para desabilitar o bodyParser para fazer upload de arquivos
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    
    // Verificar o token
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;

    // Parse do formulário de upload
    const { files } = await fileUploadService.parseRequest(req as any);
    
    if (!files || !files.avatar) {
      return res.status(400).json({ message: 'No avatar file uploaded' });
    }
    
    // Upload do avatar
    const profile = await userProfileService.uploadAvatar(userId, ProfileType.FREELANCER, files.avatar);
    
    return res.status(200).json({
      message: 'Avatar uploaded successfully',
      avatarUrl: profile.avatarUrl,
      profile: profile.toJSON()
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
} 