"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const UserRole_1 = require("../../../domain/enums/UserRole");
const router = (0, express_1.Router)();
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
    isTwoFactorEnabled: zod_1.z.boolean().optional(),
});
function userRoutes(userService, userRepository) {
    const authMiddleware = (0, auth_1.createValidateToken)(userRepository);
    const adminMiddleware = (0, auth_1.requireRole)([UserRole_1.UserRole.ADMIN]);
    router.get('/me', authMiddleware, async (req, res) => {
        try {
            const user = await userService.getProfile(req.user.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user.toJSON());
        }
        catch (error) {
            console.error('Error getting user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.put('/me', authMiddleware, (0, validate_1.validate)(updateProfileSchema), async (req, res) => {
        try {
            const user = await userService.updateProfile(req.user.userId, req.body);
            res.json(user.toJSON());
        }
        catch (error) {
            console.error('Error updating user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.get('/:id', async (req, res) => {
        try {
            const user = await userService.getProfile(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user.toJSON());
        }
        catch (error) {
            console.error('Error getting user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.put('/:id/profile', authMiddleware, adminMiddleware, (0, validate_1.validate)(updateProfileSchema), async (req, res) => {
        try {
            const user = await userService.updateProfile(req.params.id, req.body);
            res.json(user.toJSON());
        }
        catch (error) {
            console.error('Error updating user profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await userService.listUsers(page, limit);
            res.json({
                users: result.users.map(user => user.toJSON()),
                total: result.total,
                page,
                limit,
            });
        }
        catch (error) {
            console.error('Error listing users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.post('/:id/activate', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const user = await userService.activateUser(req.params.id);
            res.json(user.toJSON());
        }
        catch (error) {
            console.error('Error activating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    router.post('/:id/deactivate', authMiddleware, adminMiddleware, async (req, res) => {
        try {
            const user = await userService.deactivateUser(req.params.id);
            res.json(user.toJSON());
        }
        catch (error) {
            console.error('Error deactivating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    return router;
}
//# sourceMappingURL=userRoutes.js.map