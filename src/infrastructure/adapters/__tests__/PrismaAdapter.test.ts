import { PrismaAdapter } from '../PrismaAdapter';
import { User as PrismaUser } from '@prisma/client';
import { UserRole } from '../../../domain/enums/UserRole';
import { UserStatus } from '../../../domain/enums/UserStatus';
import { ProfileType } from '../../../domain/enums/ProfileType';

describe('PrismaAdapter', () => {
  // ... existing code ...

  describe('toDomainUserProfile', () => {
    it('should convert PrismaUserProfile to domain UserProfile', async () => {
      const prismaProfile = {
        id: '123',
        userId: '456',
        type: ProfileType.FREELANCER,
        bio: 'Test bio',
        title: 'Test title',
        company: 'Test company',
        website: 'https://test.com',
        location: 'Test location',
        phone: '+1234567890',
        socialLinks: { linkedin: 'https://linkedin.com/test' },
        skills: ['JavaScript', 'TypeScript'],
        hourlyRate: 50,
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const domainProfile = PrismaAdapter.toDomainUserProfile(prismaProfile);

      expect(domainProfile.id).toBe(prismaProfile.id);
      expect(domainProfile.userId).toBe(prismaProfile.userId);
      expect(domainProfile.type).toBe(ProfileType.FREELANCER);
      expect(domainProfile.bio).toBe(prismaProfile.bio);
      expect(domainProfile.title).toBe(prismaProfile.title);
      expect(domainProfile.company).toBe(prismaProfile.company);
      expect(domainProfile.website).toBe(prismaProfile.website);
      expect(domainProfile.location).toBe(prismaProfile.location);
      expect(domainProfile.phone).toBe(prismaProfile.phone);
      expect(domainProfile.socialLinks).toEqual(prismaProfile.socialLinks);
      expect(domainProfile.skills).toEqual(prismaProfile.skills);
      expect(domainProfile.hourlyRate).toBe(prismaProfile.hourlyRate);
      expect(domainProfile.availability).toBe(prismaProfile.availability);
      expect(domainProfile.createdAt).toBe(prismaProfile.createdAt);
      expect(domainProfile.updatedAt).toBe(prismaProfile.updatedAt);
    });

    it('should handle optional fields as undefined', async () => {
      const prismaProfile = {
        id: '123',
        userId: '456',
        type: ProfileType.CLIENT,
        bio: null,
        title: null,
        company: null,
        website: null,
        location: null,
        phone: null,
        socialLinks: null,
        skills: [],
        hourlyRate: null,
        availability: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const domainProfile = PrismaAdapter.toDomainUserProfile(prismaProfile);

      expect(domainProfile.bio).toBeUndefined();
      expect(domainProfile.title).toBeUndefined();
      expect(domainProfile.company).toBeUndefined();
      expect(domainProfile.website).toBeUndefined();
      expect(domainProfile.location).toBeUndefined();
      expect(domainProfile.phone).toBeUndefined();
      expect(domainProfile.hourlyRate).toBeUndefined();
    });

    it('should handle edge cases for numeric and formatted fields', async () => {
      const prismaProfile = {
        id: '123',
        userId: '456',
        type: ProfileType.FREELANCER,
        bio: 'Test bio',
        title: 'Test title',
        company: 'Test company',
        website: 'invalid-url',
        location: '',
        phone: 'invalid-phone',
        socialLinks: {},
        skills: [],
        hourlyRate: 0,
        availability: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const domainProfile = PrismaAdapter.toDomainUserProfile(prismaProfile);

      expect(domainProfile.website).toBe(prismaProfile.website);
      expect(domainProfile.location).toBe(prismaProfile.location);
      expect(domainProfile.phone).toBe(prismaProfile.phone);
      expect(domainProfile.hourlyRate).toBe(prismaProfile.hourlyRate);
    });
  });
}); 