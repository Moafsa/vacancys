"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const serviceAuth_1 = require("../../../../auth/serviceAuth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/activities', (0, serviceAuth_1.requireServiceAuth)('admin.activities.read'), async (req, res) => {
    try {
        const userActivities = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                status: true
            }
        });
        const emailVerifications = await prisma.user.findMany({
            where: {
                isEmailVerified: true,
                updatedAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: 10,
            select: {
                id: true,
                name: true,
                email: true,
                updatedAt: true
            }
        });
        const activities = [
            ...userActivities.map(user => ({
                id: `user-${user.id}`,
                type: 'USER_CREATED',
                description: 'registered an account',
                user: {
                    id: user.id,
                    name: user.name
                },
                timestamp: user.createdAt.toISOString(),
                metadata: {
                    status: user.status
                }
            })),
            ...emailVerifications.map(user => ({
                id: `verification-${user.id}`,
                type: 'VERIFICATION_COMPLETED',
                description: 'verified their email',
                user: {
                    id: user.id,
                    name: user.name
                },
                timestamp: user.updatedAt.toISOString()
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
        res.json(activities);
    }
    catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});
exports.default = router;
//# sourceMappingURL=activities.js.map