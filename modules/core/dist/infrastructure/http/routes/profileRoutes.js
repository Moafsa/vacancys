"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoutes = profileRoutes;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createProfileSchema = zod_1.z.object({
    type: zod_1.z.enum(['FREELANCER', 'CLIENT']),
    bio: zod_1.z.string().min(10).max(500).optional(),
    title: zod_1.z.string().min(3).max(100).optional(),
    company: zod_1.z.string().min(2).max(100).optional(),
    website: zod_1.z.string().url().optional(),
    location: zod_1.z.string().min(2).max(100).optional(),
    phone: zod_1.z.string().min(10).max(20).optional(),
    socialLinks: zod_1.z.object({
        linkedin: zod_1.z.string().url().optional(),
        github: zod_1.z.string().url().optional(),
        twitter: zod_1.z.string().url().optional(),
    }).optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    hourlyRate: zod_1.z.number().min(0).optional(),
    availability: zod_1.z.boolean().optional(),
});
const updateProfileSchema = createProfileSchema.partial().omit({ type: true });
function profileRoutes(userProfileService, userRepository, userProfileRepository) {
    const authMiddleware = (0, auth_1.createValidateToken)(userRepository);
    router.post('/', authMiddleware, (0, validate_1.validate)(createProfileSchema), async (req, res) => {
        try {
            const profile = await userProfileService.createProfile(req.user.userId, req.body);
            res.status(201).json(profile.toJSON());
        }
        catch (error) {
            console.error('Error creating profile:', error);
            if (error.message === 'User already has a profile') {
                return res.status(409).json({ message: error.message });
            }
            if (error.message === 'User not found') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.put('/', authMiddleware, (0, validate_1.validate)(updateProfileSchema), async (req, res) => {
        try {
            const profile = await userProfileService.updateProfile(req.user.userId, req.body);
            res.json(profile.toJSON());
        }
        catch (error) {
            console.error('Error updating profile:', error);
            if (error.message === 'Profile not found') {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.get('/', authMiddleware, async (req, res) => {
        try {
            const profile = await userProfileService.getProfile(req.user.userId);
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.json(profile.toJSON());
        }
        catch (error) {
            console.error('Error getting profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.get('/:userId', async (req, res) => {
        try {
            const profile = await userProfileService.getProfile(req.params.userId);
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            res.json(profile.toJSON());
        }
        catch (error) {
            console.error('Error getting profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.delete('/', authMiddleware, async (req, res) => {
        try {
            await userProfileService.deleteProfile(req.user.userId);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error deleting profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    return router;
}
//# sourceMappingURL=profileRoutes.js.map