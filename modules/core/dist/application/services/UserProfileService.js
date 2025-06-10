"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
class UserProfileService {
    constructor(userProfileRepository, userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }
    async createProfile(userId, profileData) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const existingProfile = await this.userProfileRepository.findByUserId(userId);
        if (existingProfile) {
            throw new Error('User already has a profile');
        }
        return this.userProfileRepository.create({
            userId,
            type: profileData.type,
            bio: profileData.bio,
            title: profileData.title,
            company: profileData.company,
            website: profileData.website,
            location: profileData.location,
            phone: profileData.phone,
            socialLinks: profileData.socialLinks,
            skills: profileData.skills,
            hourlyRate: profileData.hourlyRate,
            availability: profileData.availability,
        });
    }
    async updateProfile(userId, profileData) {
        const profile = await this.userProfileRepository.findByUserId(userId);
        if (!profile) {
            throw new Error('Profile not found');
        }
        return this.userProfileRepository.update(profile.id, profileData);
    }
    async getProfile(userId) {
        return this.userProfileRepository.findByUserId(userId);
    }
    async deleteProfile(userId) {
        const profile = await this.userProfileRepository.findByUserId(userId);
        if (!profile) {
            return;
        }
        await this.userProfileRepository.delete(profile.id);
    }
}
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=UserProfileService.js.map