"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ModuleClient {
    constructor(registry) {
        this.registry = registry;
        this.axiosInstance = axios_1.default.create({
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    async callEndpoint(moduleName, endpointKey, method, data) {
        const url = this.registry.getEndpoint(moduleName, endpointKey);
        try {
            const response = await this.axiosInstance({
                method,
                url,
                data
            });
            return response.data;
        }
        catch (error) {
            console.error(`Error calling ${moduleName} endpoint ${endpointKey}:`, error);
            throw error;
        }
    }
    async get(moduleName, endpointKey) {
        return this.callEndpoint(moduleName, endpointKey, 'GET');
    }
    async post(moduleName, endpointKey, data) {
        return this.callEndpoint(moduleName, endpointKey, 'POST', data);
    }
    async put(moduleName, endpointKey, data) {
        return this.callEndpoint(moduleName, endpointKey, 'PUT', data);
    }
    async delete(moduleName, endpointKey) {
        return this.callEndpoint(moduleName, endpointKey, 'DELETE');
    }
}
exports.ModuleClient = ModuleClient;
//# sourceMappingURL=ModuleClient.js.map