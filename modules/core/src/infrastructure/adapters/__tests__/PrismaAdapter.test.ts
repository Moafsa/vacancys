import { PrismaAdapter } from '../PrismaAdapter';
import { User as PrismaUser, ProfileType as PrismaProfileType } from '@prisma/client';
import { UserRole } from '../../../domain/enums/UserRole';
import { UserStatus } from '../../../domain/enums/UserStatus';
import { ProfileType } from '../../../domain/enums/ProfileType';

describe('PrismaAdapter', () => {
  describe('toDomainUser', () => {
    it('should convert PrismaUser to domain User', () => {
      const prismaUser: PrismaUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'USER',
        status: 'ACTIVE',
        isEmailVerified: false,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const domainUser = PrismaAdapter.toDomainUser(prismaUser);

      expect(domainUser.id).toBe(prismaUser.id);
      expect(domainUser.name).toBe(prismaUser.name);
      expect(domainUser.email).toBe(prismaUser.email);
      expect(domainUser.password).toBe(prismaUser.password);
      expect(domainUser.role).toBe(UserRole.USER);
      expect(domainUser.status).toBe(UserStatus.ACTIVE);
      expect(domainUser.isEmailVerified).toBe(prismaUser.isEmailVerified);
      expect(domainUser.lastLoginAt).toBe(prismaUser.lastLoginAt);
      expect(domainUser.createdAt).toBe(prismaUser.createdAt);
      expect(domainUser.updatedAt).toBe(prismaUser.updatedAt);
    });

    it('should throw error for null PrismaUser', () => {
      expect(() => PrismaAdapter.toDomainUser(null as any)).toThrow(
        'Cannot convert null or undefined PrismaUser to domain User'
      );
    });
  });

  describe('toDomainUserRole', () => {
    it('should convert PrismaUserRole to domain UserRole', () => {
      expect(PrismaAdapter.toDomainUserRole('ADMIN')).toBe(UserRole.ADMIN);
      expect(PrismaAdapter.toDomainUserRole('USER')).toBe(UserRole.USER);
    });

    it('should throw error for unknown role', () => {
      expect(() => PrismaAdapter.toDomainUserRole('UNKNOWN' as any)).toThrow(
        'Unknown user role: UNKNOWN'
      );
    });
  });

  describe('toDomainUserStatus', () => {
    it('should convert PrismaUserStatus to domain UserStatus', () => {
      expect(PrismaAdapter.toDomainUserStatus('ACTIVE')).toBe(UserStatus.ACTIVE);
      expect(PrismaAdapter.toDomainUserStatus('INACTIVE')).toBe(UserStatus.INACTIVE);
      expect(PrismaAdapter.toDomainUserStatus('PENDING')).toBe(UserStatus.PENDING);
      expect(PrismaAdapter.toDomainUserStatus('BLOCKED')).toBe(UserStatus.BLOCKED);
    });

    it('should throw error for unknown status', () => {
      expect(() => PrismaAdapter.toDomainUserStatus('UNKNOWN' as any)).toThrow(
        'Unknown user status: UNKNOWN'
      );
    });
  });

  describe('toPrismaUserRole', () => {
    it('should convert domain UserRole to PrismaUserRole', () => {
      expect(PrismaAdapter.toPrismaUserRole(UserRole.ADMIN)).toBe('ADMIN');
      expect(PrismaAdapter.toPrismaUserRole(UserRole.USER)).toBe('USER');
    });

    it('should throw error for unknown role', () => {
      expect(() => PrismaAdapter.toPrismaUserRole('UNKNOWN' as UserRole)).toThrow(
        'Unknown domain role: UNKNOWN'
      );
    });
  });

  describe('toPrismaUserStatus', () => {
    it('should convert domain UserStatus to PrismaUserStatus', () => {
      expect(PrismaAdapter.toPrismaUserStatus(UserStatus.ACTIVE)).toBe('ACTIVE');
      expect(PrismaAdapter.toPrismaUserStatus(UserStatus.INACTIVE)).toBe('INACTIVE');
      expect(PrismaAdapter.toPrismaUserStatus(UserStatus.PENDING)).toBe('PENDING');
      expect(PrismaAdapter.toPrismaUserStatus(UserStatus.BLOCKED)).toBe('BLOCKED');
    });

    it('should throw error for unknown status', () => {
      expect(() => PrismaAdapter.toPrismaUserStatus('UNKNOWN' as UserStatus)).toThrow(
        'Unknown domain status: UNKNOWN'
      );
    });
  });

  describe('toDomainUserProfile', () => {
    it('should convert PrismaUserProfile to domain UserProfile', async () => {
      const prismaProfile = {
        id: '123',
        userId: '456',
        type: 'FREELANCER' as PrismaProfileType,
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
        type: 'CLIENT' as PrismaProfileType,
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
        type: 'FREELANCER' as PrismaProfileType,
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
      expect(domainProfile.location).toBe('');
      expect(domainProfile.phone).toBe(prismaProfile.phone);
      expect(domainProfile.hourlyRate).toBe(prismaProfile.hourlyRate);
    });
  });
}); 