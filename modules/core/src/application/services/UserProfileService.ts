import { UserProfile } from '../../domain/entities/UserProfile';
import { ProfileType } from '../../domain/enums/ProfileType';
import { IUserProfileRepository } from '../../infrastructure/repositories/UserProfileRepository';
import { IUserRepository } from '../../infrastructure/repositories/UserRepository';
import { FileUploadService } from './FileUploadService';

export class UserProfileService {
  private fileUploadService: FileUploadService;

  constructor(
    private userProfileRepository: IUserProfileRepository,
    private userRepository: IUserRepository,
    fileUploadService?: FileUploadService
  ) {
    this.fileUploadService = fileUploadService || new FileUploadService();
  }

  async createProfile(userId: string, profileData: {
    type: ProfileType;
    bio?: string;
    title?: string;
    company?: string;
    website?: string;
    location?: string;
    phone?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
    skills?: string[];
    hourlyRate?: number;
    availability?: boolean;
    avatarUrl?: string;
  }): Promise<UserProfile> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verificar se o usuário já tem um perfil do tipo correto
    let existingProfile;
    if (profileData.type === ProfileType.FREELANCER) {
      existingProfile = await this.userProfileRepository.findFreelancerProfileByUserId(userId);
    } else if (profileData.type === ProfileType.CLIENT) {
      existingProfile = await this.userProfileRepository.findClientProfileByUserId(userId);
    } else {
      throw new Error('Invalid profile type');
    }
    if (existingProfile) {
      throw new Error('User already has a profile of this type');
    }

    // Criar o perfil
    if (profileData.type === ProfileType.FREELANCER) {
      return this.userProfileRepository.createFreelancerProfile({
        userId,
        ...profileData,
      });
    } else if (profileData.type === ProfileType.CLIENT) {
      return this.userProfileRepository.createClientProfile({
      userId,
        ...profileData,
      });
    } else {
      throw new Error('Invalid profile type');
    }
  }

  async updateProfile(userId: string, profileData: {
    type: ProfileType;
    bio?: string;
    title?: string;
    company?: string;
    website?: string;
    location?: string;
    phone?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
    };
    skills?: string[];
    hourlyRate?: number;
    availability?: boolean;
    avatarUrl?: string;
  }): Promise<UserProfile> {
    let profile;
    if (profileData.type === ProfileType.FREELANCER) {
      profile = await this.userProfileRepository.findFreelancerProfileByUserId(userId);
    } else if (profileData.type === ProfileType.CLIENT) {
      profile = await this.userProfileRepository.findClientProfileByUserId(userId);
    } else {
      throw new Error('Invalid profile type');
    }
    if (!profile) {
      throw new Error('Profile not found');
    }
    if (profileData.type === ProfileType.FREELANCER) {
      return this.userProfileRepository.updateFreelancerProfile(profile.id, profileData);
    } else if (profileData.type === ProfileType.CLIENT) {
      return this.userProfileRepository.updateClientProfile(profile.id, profileData);
    } else {
      throw new Error('Invalid profile type');
    }
  }

  async uploadAvatar(userId: string, type: ProfileType, file: any): Promise<UserProfile> {
    let profile;
    if (type === ProfileType.FREELANCER) {
      profile = await this.userProfileRepository.findFreelancerProfileByUserId(userId);
    } else if (type === ProfileType.CLIENT) {
      profile = await this.userProfileRepository.findClientProfileByUserId(userId);
    } else {
      throw new Error('Invalid profile type');
    }
    if (!profile) {
      throw new Error('Profile not found');
    }
    if (profile.avatarUrl && profile.avatarUrl.startsWith('/uploads/')) {
      try {
        await this.fileUploadService.deleteFile(profile.avatarUrl);
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }
    const uploadedFile = await this.fileUploadService.saveFile(file);
    if (type === ProfileType.FREELANCER) {
      return this.userProfileRepository.updateFreelancerProfile(profile.id, { avatarUrl: uploadedFile.publicPath });
    } else if (type === ProfileType.CLIENT) {
      return this.userProfileRepository.updateClientProfile(profile.id, { avatarUrl: uploadedFile.publicPath });
    } else {
      throw new Error('Invalid profile type');
    }
  }

  async getProfile(userId: string, type: ProfileType): Promise<UserProfile | null> {
    if (type === ProfileType.FREELANCER) {
      return this.userProfileRepository.findFreelancerProfileByUserId(userId);
    } else if (type === ProfileType.CLIENT) {
      return this.userProfileRepository.findClientProfileByUserId(userId);
    } else {
      throw new Error('Invalid profile type');
    }
  }

  async deleteProfile(userId: string, type: ProfileType): Promise<void> {
    let profile;
    if (type === ProfileType.FREELANCER) {
      profile = await this.userProfileRepository.findFreelancerProfileByUserId(userId);
    } else if (type === ProfileType.CLIENT) {
      profile = await this.userProfileRepository.findClientProfileByUserId(userId);
    } else {
      throw new Error('Invalid profile type');
    }
    if (!profile) {
      return;
    }
    if (profile.avatarUrl && profile.avatarUrl.startsWith('/uploads/')) {
      try {
        await this.fileUploadService.deleteFile(profile.avatarUrl);
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
    }
    if (type === ProfileType.FREELANCER) {
      await this.userProfileRepository.deleteFreelancerProfile(profile.id);
    } else if (type === ProfileType.CLIENT) {
      await this.userProfileRepository.deleteClientProfile(profile.id);
    } else {
      throw new Error('Invalid profile type');
    }
  }
} 