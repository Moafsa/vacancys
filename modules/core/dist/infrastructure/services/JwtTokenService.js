"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtTokenService {
    constructor(secret, redis, expiresIn = '1h') {
        this.secret = secret;
        this.redis = redis;
        this.expiresIn = expiresIn;
        this.revokedTokensPrefix = 'revoked-token:';
    }
    async generate(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }
    async verify(token) {
        try {
            const isRevoked = await this.isTokenRevoked(token);
            if (isRevoked) {
                return null;
            }
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            return decoded;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError || error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return null;
            }
            throw error;
        }
    }
    async revoke(token) {
        const key = this.getRevokedTokenKey(token);
        const decoded = jsonwebtoken_1.default.decode(token);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.exp) {
            const ttl = Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
            await this.redis.setex(key, ttl, '1');
        }
        else {
            await this.redis.setex(key, 24 * 60 * 60, '1');
        }
    }
    getRevokedTokenKey(token) {
        return `${this.revokedTokensPrefix}${token}`;
    }
    async isTokenRevoked(token) {
        const key = this.getRevokedTokenKey(token);
        const result = await this.redis.get(key);
        return result !== null;
    }
}
exports.JwtTokenService = JwtTokenService;
//# sourceMappingURL=JwtTokenService.js.map