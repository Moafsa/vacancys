"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleClient = void 0;
const axios_1 = __importStar(require("axios"));
const ModuleRegistry_1 = require("./ModuleRegistry");
class ModuleClient {
    constructor(config) {
        this.sourceModule = config.sourceModule;
        this.targetModule = config.targetModule;
        const token = ModuleRegistry_1.moduleRegistry.getModuleToken(this.sourceModule);
        if (!token) {
            throw new Error(`Module ${this.sourceModule} not registered`);
        }
        this.moduleToken = token;
        const isAllowed = ModuleRegistry_1.moduleRegistry.validateCommunication(this.sourceModule, this.targetModule, this.moduleToken);
        if (!isAllowed) {
            throw new Error(`Module ${this.sourceModule} is not allowed to communicate with ${this.targetModule}`);
        }
        const headers = new axios_1.AxiosHeaders();
        headers.set('Content-Type', 'application/json');
        headers.set('x-source-module', this.sourceModule);
        headers.set('x-target-module', this.targetModule);
        headers.set('x-module-token', this.moduleToken);
        this.client = axios_1.default.create({
            baseURL: config.baseURL,
            headers
        });
        this.client.interceptors.request.use((config) => {
            if (!config.headers) {
                const headers = new axios_1.AxiosHeaders();
                headers.set('Content-Type', 'application/json');
                headers.set('x-source-module', this.sourceModule);
                headers.set('x-target-module', this.targetModule);
                headers.set('x-module-token', this.moduleToken);
                config.headers = headers;
            }
            console.log(`[ModuleClient] ${this.sourceModule} -> ${this.targetModule}:`, {
                method: config.method,
                url: config.url
            });
            return config;
        });
    }
    async get(path, config) {
        const response = await this.client.get(path, config);
        return response.data;
    }
    async post(path, data, config) {
        const response = await this.client.post(path, data, config);
        return response.data;
    }
    async put(path, data, config) {
        const response = await this.client.put(path, data, config);
        return response.data;
    }
    async delete(path, config) {
        const response = await this.client.delete(path, config);
        return response.data;
    }
}
exports.ModuleClient = ModuleClient;
//# sourceMappingURL=ModuleClient.js.map