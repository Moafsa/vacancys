"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const serviceAuth_1 = require("../../../../auth/serviceAuth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/metrics', (0, serviceAuth_1.requireServiceAuth)('admin.metrics.read'), async (req, res) => {
    try {
        const [totalUsers, activeUsers, totalFreelancers, totalClients, pendingVerifications, totalProjects,] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: {
                    status: 'ACTIVE',
                },
            }),
            prisma.freelancerProfile.count(),
            prisma.clientProfile.count(),
            prisma.user.count({
                where: {
                    isEmailVerified: false,
                },
            }),
            Promise.resolve(0),
        ]);
        res.json({
            totalUsers,
            activeUsers,
            totalFreelancers,
            totalClients,
            pendingVerifications,
            totalProjects,
        });
    }
    catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});
exports.default = router;
//# sourceMappingURL=metrics.js.map