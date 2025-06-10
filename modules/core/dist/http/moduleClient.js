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
const serviceAuth_1 = require("../auth/serviceAuth");
class ModuleClient {
    constructor(config) {
        this.moduleId = config.moduleId;
        this.permissions = config.permissions;
        this.client = axios_1.default.create({
            baseURL: config.baseURL,
            headers: new axios_1.AxiosHeaders({
                'Content-Type': 'application/json'
            })
        });
        this.client.interceptors.request.use((config) => {
            if (!config.headers) {
                config.headers = new axios_1.AxiosHeaders();
            }
            config.headers.set('x-service-token', serviceAuth_1.serviceAuth.generateServiceToken(this.moduleId, this.permissions, 3600));
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
//# sourceMappingURL=moduleClient.js.map