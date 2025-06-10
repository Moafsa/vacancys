"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const AuthService_1 = require("../../application/services/AuthService");
class AuthMiddleware {
    constructor() {
        this.authenticate = async (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    res.status(401).json({ error: 'No token provided' });
                    return;
                }
                const [, token] = authHeader.split(' ');
                if (!token) {
                    res.status(401).json({ error: 'Invalid token format' });
                    return;
                }
                const payload = await this.authService.validateToken(token);
                req.user = payload;
                next();
            }
            catch (error) {
                res.status(401).json({ error: 'Invalid token' });
            }
        };
        this.requireRole = (roles) => {
            return (req, res, next) => {
                if (!req.user) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                if (!roles.includes(req.user.role)) {
                    res.status(403).json({ error: 'Insufficient permissions' });
                    return;
                }
                next();
            };
        };
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=authMiddleware.js.map