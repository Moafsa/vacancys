"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleClient = exports.validateModuleCommunication = void 0;
exports.getModuleToken = getModuleToken;
const crypto_1 = __importDefault(require("crypto"));
const MODULE_COMMUNICATION_MAP = {
    core: ['*'],
    projects: ['core']
};
const moduleTokens = new Map();
Object.keys(MODULE_COMMUNICATION_MAP).forEach(moduleName => {
    moduleTokens.set(moduleName, crypto_1.default.randomBytes(32).toString('hex'));
});
const validateModuleCommunication = (targetModule) => {
    return (req, res, next) => {
        const sourceModule = req.headers['x-source-module'];
        const moduleToken = req.headers['x-module-token'];
        if (!sourceModule || !moduleToken) {
            return res.status(401).json({
                error: 'Module authentication required',
                details: 'Missing x-source-module or x-module-token header'
            });
        }
        const validToken = moduleTokens.get(sourceModule);
        if (!validToken || validToken !== moduleToken) {
            return res.status(401).json({
                error: 'Invalid module token'
            });
        }
        const allowedTargets = MODULE_COMMUNICATION_MAP[sourceModule];
        if (!allowedTargets || (!allowedTargets.includes('*') && !allowedTargets.includes(targetModule))) {
            return res.status(403).json({
                error: 'Communication not allowed',
                details: `Module ${sourceModule} is not allowed to communicate with ${targetModule}`
            });
        }
        req.sourceModule = sourceModule;
        next();
    };
};
exports.validateModuleCommunication = validateModuleCommunication;
class ModuleClient {
    constructor(config) {
        this.sourceModule = config.sourceModule;
        this.targetModule = config.targetModule;
        this.baseURL = config.baseURL;
        if (!moduleTokens.has(this.sourceModule)) {
            throw new Error(`Module ${this.sourceModule} not registered`);
        }
        const allowedTargets = MODULE_COMMUNICATION_MAP[this.sourceModule];
        if (!allowedTargets || (!allowedTargets.includes('*') && !allowedTargets.includes(this.targetModule))) {
            throw new Error(`Module ${this.sourceModule} is not allowed to communicate with ${this.targetModule}`);
        }
    }
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'x-source-module': this.sourceModule,
            'x-module-token': moduleTokens.get(this.sourceModule)
        };
    }
    async get(path) {
        const response = await fetch(`${this.baseURL}${path}`, {
            headers: this.getHeaders()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
    async post(path, data) {
        const response = await fetch(`${this.baseURL}${path}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
}
exports.ModuleClient = ModuleClient;
function getModuleToken(moduleName) {
    return moduleTokens.get(moduleName);
}
//# sourceMappingURL=index.js.map