"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenServiceImpl = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class JwtTokenServiceImpl {
    constructor(config, redisService) {
        this.config = config;
        this.redisService = redisService;
        this.REVOKED_TOKEN_PREFIX = 'revoked_token:';
    }
    async generate(payload) {
        try {
            const token = (0, jsonwebtoken_1.sign)(payload, this.config.jwt.secret, {
                expiresIn: this.config.jwt.expiresIn,
                subject: payload.id
            });
            return token;
        }
        catch (error) {
            throw new Error('Failed to generate token');
        }
    }
    async verify(token) {
        try {
            const isRevoked = await this.redisService.get(`${this.REVOKED_TOKEN_PREFIX}${token}`);
            if (isRevoked) {
                return null;
            }
            const decoded = (0, jsonwebtoken_1.verify)(token, this.config.jwt.secret);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    async revoke(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, this.config.jwt.secret);
            const expirationTime = decoded.exp ?
                Math.max(0, decoded.exp - Math.floor(Date.now() / 1000)) :
                parseInt(this.config.jwt.expiresIn, 10);
            await this.redisService.set(`${this.REVOKED_TOKEN_PREFIX}${token}`, 'true', expirationTime);
        }
        catch (error) {
            return;
        }
    }
}
exports.JwtTokenServiceImpl = JwtTokenServiceImpl;
//# sourceMappingURL=JwtTokenServiceImpl.js.map