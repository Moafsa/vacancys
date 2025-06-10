"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.examples = void 0;
const express_1 = __importDefault(require("express"));
const serviceAuth_1 = require("../auth/serviceAuth");
const moduleClient_1 = require("../http/moduleClient");
const app = (0, express_1.default)();
app.get('/protected-resource', (0, serviceAuth_1.requireServiceAuth)('resource.read'), (req, res) => {
    const { id: moduleId, permissions } = req.serviceModule;
    res.json({
        message: 'Access granted',
        moduleId,
        permissions
    });
});
const vacancyClient = new moduleClient_1.ModuleClient({
    moduleId: 'core-module',
    baseURL: 'http://localhost:3002',
    permissions: ['vacancy.read', 'vacancy.write']
});
async function getVacancies() {
    try {
        const vacancies = await vacancyClient.get('/vacancies');
        return vacancies;
    }
    catch (error) {
        console.error('Failed to fetch vacancies:', error);
        throw error;
    }
}
async function createVacancy(vacancyData) {
    try {
        const newVacancy = await vacancyClient.post('/vacancies', vacancyData);
        return newVacancy;
    }
    catch (error) {
        console.error('Failed to create vacancy:', error);
        throw error;
    }
}
exports.examples = {
    getVacancies,
    createVacancy
};
//# sourceMappingURL=authExample.js.map