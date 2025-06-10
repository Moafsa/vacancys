"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
describe('API Integration Tests', () => {
    describe('Health Check Endpoint', () => {
        it('should return 200 and correct response structure', async () => {
            const response = await (0, supertest_1.default)(app_1.app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'ok');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });
    });
    describe('API Status Endpoint', () => {
        it('should return 200 and correct response structure', async () => {
            const response = await (0, supertest_1.default)(app_1.app).get('/api/status');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'online');
            expect(response.body).toHaveProperty('responseTime');
            expect(response.body).toHaveProperty('endpoints');
            expect(response.body.endpoints).toEqual(['/health', '/api/status']);
            expect(response.body).toHaveProperty('requests');
            expect(response.body).toHaveProperty('timestamp');
        });
    });
    describe('Static File Serving', () => {
        it('should serve dashboard-teste.html', async () => {
            const response = await (0, supertest_1.default)(app_1.app).get('/dashboard-teste.html');
            expect(response.status).toBe(200);
            expect(response.type).toBe('text/html');
        });
        it('should redirect root to dashboard', async () => {
            const response = await (0, supertest_1.default)(app_1.app).get('/');
            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/dashboard-teste.html');
        });
    });
});
//# sourceMappingURL=api.test.js.map