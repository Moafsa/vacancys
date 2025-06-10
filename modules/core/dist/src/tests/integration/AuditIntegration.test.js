"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const AuditLog_1 = require("../../domain/entities/AuditLog");
const auth_1 = require("../helpers/auth");
describe('Audit Integration Tests', () => {
    let testUser;
    let authToken;
    beforeAll(async () => {
        testUser = await (0, auth_1.createTestUser)();
        authToken = await (0, auth_1.getTestToken)(testUser.id);
    });
    afterAll(async () => {
    });
    describe('GET /api/audit/history', () => {
        it('should return audit history for authenticated user', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/audit/history')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
        it('should return 401 for unauthenticated requests', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/audit/history');
            expect(response.status).toBe(401);
        });
    });
    describe('GET /api/audit/actions/:action', () => {
        it('should return audit logs for specific action', async () => {
            const action = AuditLog_1.AuditActionType.LOGIN;
            const response = await (0, supertest_1.default)(app_1.app)
                .get(`/api/audit/actions/${action}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });
    describe('GET /api/audit/date-range', () => {
        it('should return audit logs within date range', async () => {
            const startDate = new Date('2024-01-01').toISOString();
            const endDate = new Date('2024-12-31').toISOString();
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/audit/date-range')
                .query({ startDate, endDate })
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });
    describe('POST /api/audit/log', () => {
        it('should create a new audit log entry', async () => {
            const auditData = {
                action: AuditLog_1.AuditActionType.LOGIN,
                details: 'Test audit log',
                ipAddress: '127.0.0.1',
                userAgent: 'Test User Agent'
            };
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/audit/log')
                .set('Authorization', `Bearer ${authToken}`)
                .send(auditData);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.action).toBe(auditData.action);
        });
    });
    describe('DELETE /api/audit/cleanup', () => {
        it('should cleanup old audit logs', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .delete('/api/audit/cleanup')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ daysToKeep: 30 });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('deletedCount');
        });
    });
});
//# sourceMappingURL=AuditIntegration.test.js.map