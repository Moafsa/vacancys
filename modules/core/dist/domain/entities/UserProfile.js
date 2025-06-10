"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
class UserProfile {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.type = data.type;
        this.bio = data.bio;
        this.title = data.title;
        this.company = data.company;
        this.website = data.website;
        this.location = data.location;
        this.phone = data.phone;
        this.socialLinks = data.socialLinks;
        this.skills = data.skills;
        this.hourlyRate = data.hourlyRate;
        this.availability = data.availability;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            type: this.type,
            bio: this.bio,
            title: this.title,
            company: this.company,
            website: this.website,
            location: this.location,
            phone: this.phone,
            socialLinks: this.socialLinks,
            skills: this.skills,
            hourlyRate: this.hourlyRate,
            availability: this.availability,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
exports.UserProfile = UserProfile;
//# sourceMappingURL=UserProfile.js.map