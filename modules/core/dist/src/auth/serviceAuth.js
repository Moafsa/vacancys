"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireServiceAuth = exports.serviceAuth = exports.ServiceAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
class ServiceAuth {
    constructor(secret, expiresIn = 3600) {
        this.secret = secret;
        this.expiresIn = expiresIn;
    }
    generateToken(serviceId, permissions = []) {
        const options = {
            expiresIn: this.expiresIn
        };
        const payload = {
            moduleId: serviceId,
            permissions
        };
        return jsonwebtoken_1.default.sign(payload, this.secret, options);
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            return decoded;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
exports.ServiceAuth = ServiceAuth;
class ServiceAuthManager {
    constructor() {
        this.secret = this.generateSecret();
    }
    generateSecret() {
        return crypto_1.default.randomBytes(32).toString('hex');
    }
    generateServiceToken(serviceId, permissions = [], expiresIn = 3600) {
        const auth = new ServiceAuth(this.secret, expiresIn);
        return auth.generateToken(serviceId, permissions);
    }
    verifyServiceToken(token) {
        const auth = new ServiceAuth(this.secret);
        return auth.verifyToken(token);
    }
    hasPermission(payload, requiredPermission) {
        var _a;
        return ((_a = payload.permissions) === null || _a === void 0 ? void 0 : _a.includes(requiredPermission)) || false;
    }
}
exports.serviceAuth = new ServiceAuthManager();
const requireServiceAuth = (requiredPermission) => {
    return (req, res, next) => {
        try {
            const token = req.headers['x-service-token'];
            if (!token) {
                return res.status(401).json({ error: 'Service token required' });
            }
            const payload = exports.serviceAuth.verifyServiceToken(token);
            if (requiredPermission && !exports.serviceAuth.hasPermission(payload, requiredPermission)) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            req.serviceModule = {
                id: payload.moduleId,
                permissions: payload.permissions
            };
            next();
        }
        catch (error) {
            return res.status(401).json({ error: 'Invalid service token' });
        }
    };
};
exports.requireServiceAuth = requireServiceAuth;
//# sourceMappingURL=serviceAuth.js.map