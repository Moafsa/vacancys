"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
exports.authMiddleware = authMiddleware;
const JwtTokenService_1 = require("../../../infrastructure/services/JwtTokenService");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
const ApplicationError_1 = require("../../../application/errors/ApplicationError");
const config_1 = __importDefault(require("../../../config/config"));
function authMiddleware(userRepository) {
    const jwtService = new JwtTokenService_1.JwtTokenService(config_1.default.jwt.secret);
    return async (req, res, next) => {
        try {
            const token = extractToken(req);
            if (!token) {
                throw new ApplicationError_1.ApplicationError('AUTH_REQUIRED', 'Token não fornecido', 401);
            }
            const payload = await jwtService.verifyToken(token);
            const user = await userRepository.findById(payload.userId);
            if (!user) {
                throw new ApplicationError_1.ApplicationError('USER_NOT_FOUND', 'Usuário não encontrado', 401);
            }
            if (user.status === UserStatus_1.UserStatus.INACTIVE) {
                throw new ApplicationError_1.ApplicationError('INACTIVE_USER', 'Usuário inativo', 403);
            }
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status
            };
            next();
        }
        catch (error) {
            if (error instanceof ApplicationError_1.ApplicationError) {
                res.status(error.statusCode).json({
                    error: {
                        message: error.message,
                        code: error.code,
                        statusCode: error.statusCode
                    }
                });
            }
            else {
                res.status(401).json({
                    error: {
                        message: 'Token inválido',
                        code: 'INVALID_TOKEN',
                        statusCode: 401
                    }
                });
            }
        }
    };
}
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: {
                    message: 'Authentication required',
                    code: 'AUTHENTICATION_REQUIRED',
                    statusCode: 401
                }
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: {
                    message: 'Insufficient permissions',
                    code: 'FORBIDDEN',
                    statusCode: 403
                }
            });
        }
        next();
    };
};
exports.authorize = authorize;
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    if (req.cookies && req.cookies.auth_token) {
        return req.cookies.auth_token;
    }
    return null;
}
//# sourceMappingURL=authMiddleware.js.map