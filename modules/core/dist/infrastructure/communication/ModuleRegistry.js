"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRegistry = exports.MODULE_COMMUNICATION_MAP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.MODULE_COMMUNICATION_MAP = {
    core: ['*'],
    projects: ['core', 'payments', 'messaging', 'reviews'],
    payments: ['core', 'projects', 'credits'],
    messaging: ['core', 'projects', 'ai_translation'],
    reviews: ['core', 'projects'],
    skills: ['core', 'projects'],
    admin: ['*'],
    analytics: ['*'],
    ai_translation: ['core', 'messaging'],
    meetings: ['core', 'messaging'],
    ai_matchmaking: ['core', 'projects'],
    credits: ['core', 'payments'],
    security: ['*'],
    localization: ['core'],
    affiliates: ['core', 'payments'],
    integration_hub: ['*']
};
class ModuleRegistry {
    constructor() {
        this.modules = new Map();
        this.secretKey = process.env.MODULE_AUTH_SECRET || crypto_1.default.randomBytes(32).toString('hex');
        this.tokenExpiration = 3600;
        this.initializeModules();
    }
    initializeModules() {
        Object.entries(exports.MODULE_COMMUNICATION_MAP).forEach(([moduleName, allowedTargets]) => {
            this.registerModule(moduleName, allowedTargets);
        });
    }
    registerModule(name, allowedTargets) {
        const token = this.generateToken(name, allowedTargets);
        this.modules.set(name, { name, allowedTargets, token });
    }
    generateToken(moduleName, allowedTargets) {
        const payload = {
            moduleName,
            allowedTargets
        };
        const options = {
            expiresIn: this.tokenExpiration
        };
        return jsonwebtoken_1.default.sign(payload, this.secretKey, options);
    }
    getModuleConfig(moduleName) {
        return this.modules.get(moduleName);
    }
    validateCommunication(sourceModule, targetModule, token) {
        const source = this.modules.get(sourceModule);
        if (!source || source.token !== token) {
            return false;
        }
        if (source.allowedTargets.includes('*')) {
            return true;
        }
        return source.allowedTargets.includes(targetModule);
    }
    getModuleToken(moduleName) {
        var _a;
        return (_a = this.modules.get(moduleName)) === null || _a === void 0 ? void 0 : _a.token;
    }
}
exports.moduleRegistry = new ModuleRegistry();
//# sourceMappingURL=ModuleRegistry.js.map