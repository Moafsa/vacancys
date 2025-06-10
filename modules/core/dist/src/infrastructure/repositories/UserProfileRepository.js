"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileRepository = void 0;
const client_1 = require("@prisma/client");
const PrismaAdapter_1 = require("../adapters/PrismaAdapter");
class UserProfileRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async create(profileData) {
        var _a;
        const profile = await this.prisma.userProfile.create({
            data: {
                userId: profileData.userId,
                type: profileData.type,
                bio: profileData.bio,
                title: profileData.title,
                company: profileData.company,
                website: profileData.website,
                location: profileData.location,
                phone: profileData.phone,
                socialLinks: profileData.socialLinks,
                skills: profileData.skills || [],
                hourlyRate: profileData.hourlyRate,
                availability: (_a = profileData.availability) !== null && _a !== void 0 ? _a : true,
            }
        });
        return PrismaAdapter_1.PrismaAdapter.toDomainUserProfile(profile);
    }
    async update(id, data) {
        const profile = await this.prisma.userProfile.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            }
        });
        return PrismaAdapter_1.PrismaAdapter.toDomainUserProfile(profile);
    }
    async findById(id) {
        const profile = await this.prisma.userProfile.findUnique({
            where: { id }
        });
        return profile ? PrismaAdapter_1.PrismaAdapter.toDomainUserProfile(profile) : null;
    }
    async findByUserId(userId) {
        const profile = await this.prisma.userProfile.findUnique({
            where: { userId }
        });
        return profile ? PrismaAdapter_1.PrismaAdapter.toDomainUserProfile(profile) : null;
    }
    async delete(id) {
        try {
            await this.prisma.userProfile.delete({
                where: { id }
            });
        }
        catch (error) {
            if (error.code === 'P2025' || error.message.includes('Record to delete does not exist')) {
                return;
            }
            throw error;
        }
    }
}
exports.UserProfileRepository = UserProfileRepository;
//# sourceMappingURL=UserProfileRepository.js.map