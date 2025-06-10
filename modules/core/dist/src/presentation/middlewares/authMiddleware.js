"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const AuthService_1 = require("../../domain/services/AuthService");
const PrismaUserRepository_1 = require("../../infrastructure/database/PrismaUserRepository");
const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
const authService = new AuthService_1.AuthService(userRepository);
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const [, token] = authHeader.split(' ');
        if (!token) {
            res.status(401).json({ error: 'Token malformatted' });
            return;
        }
        const user = await authService.validateToken(token);
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'User not authorized' });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authMiddleware.js.map