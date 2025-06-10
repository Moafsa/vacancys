"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenServiceImpl = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApplicationError_1 = require("../../application/errors/ApplicationError");
class JwtTokenServiceImpl {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'default-secret-key';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    }
    async generateToken(payload) {
        try {
            const options = {
                expiresIn: this.expiresIn
            };
            return jsonwebtoken_1.default.sign(payload, this.secret, options);
        }
        catch (error) {
            throw new ApplicationError_1.ApplicationError('Erro ao gerar token', 'TOKEN_GENERATION_ERROR', 500);
        }
    }
    async verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new ApplicationError_1.ApplicationError('Token expirado', 'TOKEN_EXPIRED', 401);
            }
            throw new ApplicationError_1.ApplicationError('Token inválido', 'INVALID_TOKEN', 401);
        }
    }
    async revokeToken(token) {
        try {
            jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new ApplicationError_1.ApplicationError('Token expirado', 'TOKEN_EXPIRED', 401);
            }
            throw new ApplicationError_1.ApplicationError('Token inválido', 'INVALID_TOKEN', 401);
        }
    }
}
exports.JwtTokenServiceImpl = JwtTokenServiceImpl;
//# sourceMappingURL=JwtTokenServiceImpl.js.map