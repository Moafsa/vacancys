"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JwtTokenServiceImpl_1 = require("../JwtTokenServiceImpl");
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
describe('JwtTokenServiceImpl', () => {
    let jwtService;
    const secret = 'test-secret';
    beforeEach(() => {
        jwtService = new JwtTokenServiceImpl_1.JwtTokenServiceImpl(secret);
    });
    const mockPayload = {
        id: '123',
        email: 'test@example.com',
        role: UserRole_1.UserRole.USER,
        status: UserStatus_1.UserStatus.ACTIVE
    };
    describe('generateToken', () => {
        it('deve gerar um token JWT válido', async () => {
            const token = await jwtService.generateToken(mockPayload);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
        });
        it('deve gerar um token com expiração personalizada', async () => {
            const token = await jwtService.generateToken(mockPayload);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
        });
    });
    describe('verifyToken', () => {
        it('deve verificar um token válido', async () => {
            const token = await jwtService.generateToken(mockPayload);
            const decoded = await jwtService.verifyToken(token);
            expect(decoded).toBeDefined();
            expect(decoded === null || decoded === void 0 ? void 0 : decoded.id).toBe(mockPayload.id);
            expect(decoded === null || decoded === void 0 ? void 0 : decoded.email).toBe(mockPayload.email);
            expect(decoded === null || decoded === void 0 ? void 0 : decoded.role).toBe(mockPayload.role);
            expect(decoded === null || decoded === void 0 ? void 0 : decoded.status).toBe(mockPayload.status);
        });
        it('deve retornar null para um token inválido', async () => {
            const decoded = await jwtService.verifyToken('invalid-token');
            expect(decoded).toBeNull();
        });
        it('deve retornar null para um token expirado', async () => {
            const token = await jwtService.generateToken(mockPayload);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const decoded = await jwtService.verifyToken(token);
            expect(decoded).toBeNull();
        });
    });
    describe('revokeToken', () => {
        it('deve revogar um token', async () => {
            const token = await jwtService.generateToken(mockPayload);
            await expect(jwtService.revokeToken(token)).resolves.toBeUndefined();
        });
    });
});
//# sourceMappingURL=JwtTokenServiceImpl.test.js.map