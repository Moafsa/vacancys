import { UserProfile } from '../UserProfile';
import { ProfileType } from '../../enums/ProfileType';

describe('UserProfile', () => {
  const mockDate = new Date();
  const mockProfileData = {
    id: '123',
    userId: '456',
    type: ProfileType.FREELANCER,
    bio: 'Test bio',
    title: 'Software Engineer',
    company: 'Test Company',
    website: 'https://test.com',
    location: 'Test Location',
    phone: '+1234567890',
    socialLinks: {
      linkedin: 'https://linkedin.com/test',
      github: 'https://github.com/test',
      twitter: 'https://twitter.com/test'
    },
    skills: ['JavaScript', 'TypeScript'],
    hourlyRate: 50,
    availability: true,
    createdAt: mockDate,
    updatedAt: mockDate
  };

  describe('constructor', () => {
    it('should create a UserProfile instance with all properties', () => {
      const profile = new UserProfile(mockProfileData);

      expect(profile.id).toBe(mockProfileData.id);
      expect(profile.userId).toBe(mockProfileData.userId);
      expect(profile.type).toBe(mockProfileData.type);
      expect(profile.bio).toBe(mockProfileData.bio);
      expect(profile.title).toBe(mockProfileData.title);
      expect(profile.company).toBe(mockProfileData.company);
      expect(profile.website).toBe(mockProfileData.website);
      expect(profile.location).toBe(mockProfileData.location);
      expect(profile.phone).toBe(mockProfileData.phone);
      expect(profile.socialLinks).toEqual(mockProfileData.socialLinks);
      expect(profile.skills).toEqual(mockProfileData.skills);
      expect(profile.hourlyRate).toBe(mockProfileData.hourlyRate);
      expect(profile.availability).toBe(mockProfileData.availability);
      expect(profile.createdAt).toBe(mockProfileData.createdAt);
      expect(profile.updatedAt).toBe(mockProfileData.updatedAt);
    });

    it('should create a UserProfile instance with minimal required properties', () => {
      const minimalData = {
        id: '123',
        userId: '456',
        type: ProfileType.CLIENT,
        createdAt: mockDate,
        updatedAt: mockDate
      };

      const profile = new UserProfile(minimalData);

      expect(profile.id).toBe(minimalData.id);
      expect(profile.userId).toBe(minimalData.userId);
      expect(profile.type).toBe(minimalData.type);
      expect(profile.bio).toBeUndefined();
      expect(profile.title).toBeUndefined();
      expect(profile.company).toBeUndefined();
      expect(profile.website).toBeUndefined();
      expect(profile.location).toBeUndefined();
      expect(profile.phone).toBeUndefined();
      expect(profile.socialLinks).toBeUndefined();
      expect(profile.skills).toBeUndefined();
      expect(profile.hourlyRate).toBeUndefined();
      expect(profile.availability).toBeUndefined();
      expect(profile.createdAt).toBe(minimalData.createdAt);
      expect(profile.updatedAt).toBe(minimalData.updatedAt);
    });

    it('should create a UserProfile instance with partial social links', () => {
      const dataWithPartialSocialLinks = {
        ...mockProfileData,
        socialLinks: {
          linkedin: 'https://linkedin.com/test'
        }
      };

      const profile = new UserProfile(dataWithPartialSocialLinks);

      expect(profile.socialLinks).toEqual({
        linkedin: 'https://linkedin.com/test'
      });
    });
  });

  describe('toJSON', () => {
    it('should return a plain object representation with all properties', () => {
      const profile = new UserProfile(mockProfileData);
      const json = profile.toJSON();

      expect(json).toEqual(mockProfileData);
    });

    it('should return a plain object representation with minimal properties', () => {
      const minimalData = {
        id: '123',
        userId: '456',
        type: ProfileType.CLIENT,
        createdAt: mockDate,
        updatedAt: mockDate
      };

      const profile = new UserProfile(minimalData);
      const json = profile.toJSON();

      expect(json).toEqual(minimalData);
    });

    it('should handle undefined optional properties correctly', () => {
      const profile = new UserProfile({
        id: '123',
        userId: '456',
        type: ProfileType.FREELANCER,
        skills: [],
        createdAt: mockDate,
        updatedAt: mockDate
      });

      const json = profile.toJSON();

      expect(json.bio).toBeUndefined();
      expect(json.title).toBeUndefined();
      expect(json.company).toBeUndefined();
      expect(json.website).toBeUndefined();
      expect(json.location).toBeUndefined();
      expect(json.phone).toBeUndefined();
      expect(json.socialLinks).toBeUndefined();
      expect(json.hourlyRate).toBeUndefined();
      expect(json.availability).toBeUndefined();
      expect(json.skills).toEqual([]);
    });
  });
}); 