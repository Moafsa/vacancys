"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const JwtTokenServiceImpl_1 = require("../services/JwtTokenServiceImpl");
const UserStatus_1 = require("../../domain/entities/UserStatus");
const ApplicationError_1 = require("../../application/errors/ApplicationError");
const config_1 = __importDefault(require("../../config/config"));
const jwtService = new JwtTokenServiceImpl_1.JwtTokenServiceImpl(config_1.default.jwt.secret);
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new ApplicationError_1.ApplicationError('NO_TOKEN', 'No token provided', 401);
        }
        const [, token] = authHeader.split(' ');
        if (!token) {
            throw new ApplicationError_1.ApplicationError('INVALID_TOKEN', 'Invalid token', 401);
        }
        try {
            const decoded = await jwtService.verifyToken(token);
            if (decoded.status === UserStatus_1.UserStatus.INACTIVE) {
                throw new ApplicationError_1.ApplicationError('USER_INACTIVE', 'User account is not active', 403);
            }
            if (decoded.status === UserStatus_1.UserStatus.PENDING) {
                throw new ApplicationError_1.ApplicationError('USER_PENDING', 'User account is pending verification', 403);
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error instanceof ApplicationError_1.ApplicationError) {
                throw error;
            }
            if (error instanceof Error && error.name === 'TokenExpiredError') {
                throw new ApplicationError_1.ApplicationError('TOKEN_EXPIRED', 'Token expired', 401);
            }
            throw new ApplicationError_1.ApplicationError('INVALID_TOKEN', 'Invalid token', 401);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map