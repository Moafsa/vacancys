import { PrismaClient } from '@prisma/client';
import { UserProfile, IUserProfile } from '../../domain/entities/UserProfile';
import { PrismaAdapter } from '../adapters/PrismaAdapter';

export interface IUserProfileRepository {
  createFreelancerProfile(profile: Omit<IUserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile>;
  updateFreelancerProfile(id: string, data: Partial<Omit<IUserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<UserProfile>;
  findFreelancerProfileById(id: string): Promise<UserProfile | null>;
  findFreelancerProfileByUserId(userId: string): Promise<UserProfile | null>;
  deleteFreelancerProfile(id: string): Promise<void>;

  createClientProfile(profile: Omit<IUserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile>;
  updateClientProfile(id: string, data: Partial<Omit<IUserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<UserProfile>;
  findClientProfileById(id: string): Promise<UserProfile | null>;
  findClientProfileByUserId(userId: string): Promise<UserProfile | null>;
  deleteClientProfile(id: string): Promise<void>;
}

export class UserProfileRepository implements IUserProfileRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Métodos para FreelancerProfile
  async createFreelancerProfile(profileData: any): Promise<UserProfile> {
    const profile = await this.prisma.freelancerProfile.create({
      data: {
        userId: profileData.userId,
        headline: profileData.title,
        skills: profileData.skills || [],
        hourlyRate: profileData.hourlyRate,
        availability: profileData.availability === undefined ? 'AVAILABLE' : (profileData.availability ? 'AVAILABLE' : 'UNAVAILABLE'),
        experienceYears: profileData.experienceYears,
        englishLevel: profileData.englishLevel,
        portfolioWebsite: profileData.portfolioWebsite,
        profileComplete: profileData.profileComplete ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    return PrismaAdapter.toDomainUserProfile(profile);
  }

  async updateFreelancerProfile(id: string, data: any): Promise<UserProfile> {
    const updateData = { ...data, updatedAt: new Date() };
    if (updateData.availability !== undefined) {
      updateData.availability = updateData.availability ? 'AVAILABLE' : 'UNAVAILABLE';
    }
    const profile = await this.prisma.freelancerProfile.update({
      where: { id },
      data: updateData,
    });
    return PrismaAdapter.toDomainUserProfile(profile);
  }

  async findFreelancerProfileById(id: string): Promise<UserProfile | null> {
    const profile = await this.prisma.freelancerProfile.findUnique({
      where: { id }
    });
    return profile ? PrismaAdapter.toDomainUserProfile(profile) : null;
  }

  async findFreelancerProfileByUserId(userId: string): Promise<UserProfile | null> {
    const profile = await this.prisma.freelancerProfile.findUnique({
      where: { userId }
    });
    return profile ? PrismaAdapter.toDomainUserProfile(profile) : null;
  }

  async deleteFreelancerProfile(id: string): Promise<void> {
    try {
      await this.prisma.freelancerProfile.delete({
        where: { id }
      });
    } catch (error) {
      if (error.code === 'P2025' || error.message.includes('Record to delete does not exist')) {
        return;
      }
      throw error;
    }
  }

  // Métodos para ClientProfile
  async createClientProfile(profileData: any): Promise<UserProfile> {
    const profile = await this.prisma.clientProfile.create({
      data: {
        userId: profileData.userId,
        companyName: profileData.companyName,
        industry: profileData.industry,
        companySize: profileData.companySize,
        companyWebsite: profileData.companyWebsite,
        profileComplete: profileData.profileComplete ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    return PrismaAdapter.toDomainUserProfile(profile);
  }

  async updateClientProfile(id: string, data: Partial<Omit<IUserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<UserProfile> {
    const profile = await this.prisma.clientProfile.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    });
    return PrismaAdapter.toDomainUserProfile(profile);
  }

  async findClientProfileById(id: string): Promise<UserProfile | null> {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { id }
    });
    return profile ? PrismaAdapter.toDomainUserProfile(profile) : null;
  }

  async findClientProfileByUserId(userId: string): Promise<UserProfile | null> {
    const profile = await this.prisma.clientProfile.findUnique({
      where: { userId }
    });
    return profile ? PrismaAdapter.toDomainUserProfile(profile) : null;
  }

  async deleteClientProfile(id: string): Promise<void> {
    try {
      await this.prisma.clientProfile.delete({
        where: { id }
      });
    } catch (error) {
      if (error.code === 'P2025' || error.message.includes('Record to delete does not exist')) {
        return;
      }
      throw error;
    }
  }
} 