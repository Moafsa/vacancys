import { ClientProfile, User } from '@prisma/client';
import { saveFile } from '../fileUpload';
import { prisma } from 'lib/prisma';

/**
 * Interface for profile data
 */
interface ProfileData {
  name?: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  companyWebsite?: string;
  bio?: string;
  [key: string]: any;
}

/**
 * Service class for handling client profile related operations
 */
export class ClientProfileService {
  /**
   * Get a client profile by user ID
   * @param {string} userId - The user ID
   * @returns {Promise<ClientProfile>} - The client profile
   */
  async getClientProfile(userId: string): Promise<ClientProfile> {
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    });
    
    if (!clientProfile) {
      throw new Error('Client profile not found');
    }
    
    return clientProfile;
  }
  
  /**
   * Update or create a client profile
   * @param {string} userId - The user ID
   * @param {ProfileData} profileData - The profile data to update
   * @param {any} avatar - The avatar file object (optional)
   * @returns {Promise<User & { clientProfile: ClientProfile | null }>} - The updated user with client profile
   */
  async updateClientProfile(
    userId: string, 
    profileData: ProfileData, 
    avatar: any = null
  ): Promise<User & { clientProfile: ClientProfile | null }> {
    console.log('Updating client profile for user:', userId);
    
    // Check if profile exists
    const existingProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    });
    
    // Prepare data for Prisma
    const data: { [key: string]: any } = {
      companyName: profileData.companyName,
      industry: profileData.industry,
      companySize: profileData.companySize,
      companyWebsite: profileData.companyWebsite,
    };
    console.log('Dados enviados para o Prisma (updateClientProfile):', data);
    
    // Filter undefined values
    Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });
    
    // Check if profile should be marked as complete
    if (
      (data.companyName || existingProfile?.companyName) && 
      (data.industry || existingProfile?.industry)
    ) {
      data.profileComplete = true;
    }
    
    let clientProfile;
    
    if (existingProfile) {
      // Update existing profile
      clientProfile = await prisma.clientProfile.update({
        where: { userId },
        data
      });
    } else {
      // Create new profile
      clientProfile = await prisma.clientProfile.create({
        data: {
          ...data,
          user: { connect: { id: userId } }
        }
      });
    }
    
    // Process avatar if provided
    if (avatar) {
      console.log('Processing client avatar upload');
      try {
        const savedFile = await saveFile(avatar);
        // Avatar processing logic can be extended, but avatarUrl is no longer saved in clientProfile
        // Se necessário, salve em outro local ou ignore
      } catch (fileError) {
        console.error('Error saving avatar file:', fileError);
        // Continue without avatar update
      }
    }
    
    // Update user name if provided
    if (profileData.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: profileData.name }
      });
    }
    
    // Get complete user with profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: true
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  /**
   * Create a new client profile
   * @param {string} userId - The user ID
   * @param {ProfileData} profileData - The profile data
   * @param {any} avatar - The avatar file object (optional)
   * @returns {Promise<User & { clientProfile: ClientProfile | null }>} - The created user with client profile
   */
  async createClientProfile(
    userId: string, 
    profileData: ProfileData, 
    avatar: any = null
  ): Promise<User & { clientProfile: ClientProfile | null }> {
    console.log('Creating new client profile');
    
    // Check if profile already exists
    const existingProfile = await prisma.clientProfile.findUnique({
      where: { userId }
    });
    
    if (existingProfile) {
      throw new Error('Client profile already exists');
    }
    
    // Create data object for Prisma
    const data: { [key: string]: any } = {
      userId,
      companyName: profileData.companyName,
      industry: profileData.industry,
      companySize: profileData.companySize,
      companyWebsite: profileData.companyWebsite,
    };
    console.log('Dados enviados para o Prisma (createClientProfile):', data);
    
    // Set profile as complete if we have enough data
    if (data.companyName && data.industry) {
      data.profileComplete = true;
    }
    
    // Create profile
    let clientProfile = await prisma.clientProfile.create({
      data: {
        ...data,
        user: { connect: { id: userId } }
      }
    });
    
    // Process avatar if provided
    if (avatar) {
      console.log('Processing client avatar upload for new profile');
      try {
        const savedFile = await saveFile(avatar);
        // Avatar processing logic can be extended, but avatarUrl is no longer saved in clientProfile
        // Se necessário, salve em outro local ou ignore
      } catch (fileError) {
        console.error('Error saving avatar file:', fileError);
        // Continue without avatar update
      }
    }
    
    // Update user role if needed
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: 'USER' // Or CLIENT if you have that role
      }
    });
    
    // Get complete user with profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: true
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
} 