"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.createValidateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createValidateToken = (userRepository) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'Authentication token is required' });
            }
            const [bearer, token] = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) {
                return res.status(401).json({ message: 'Invalid token format' });
            }
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                console.error('JWT_SECRET is not configured');
                return res.status(500).json({ message: 'Internal server error' });
            }
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            try {
                const user = await userRepository.findById(decoded.userId);
                if (!user) {
                    return res.status(401).json({ message: 'Invalid user' });
                }
                req.user = {
                    userId: user.id,
                    email: user.email,
                    role: user.role
                };
                next();
            }
            catch (error) {
                console.error('Auth middleware error:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(401).json({ message: 'Invalid authentication token' });
            }
            console.error('Auth middleware error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};
exports.createValidateToken = createValidateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map