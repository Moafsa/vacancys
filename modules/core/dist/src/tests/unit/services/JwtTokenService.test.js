"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const JwtTokenService_1 = require("../../../../infrastructure/services/JwtTokenService");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
(0, globals_1.describe)('JwtTokenServiceImpl', () => {
    let jwtService;
    const testSecret = 'test-secret-key';
    (0, globals_1.beforeEach)(() => {
        jwtService = new JwtTokenService_1.JwtTokenServiceImpl(testSecret);
    });
    (0, globals_1.describe)('generateToken', () => {
        (0, globals_1.it)('deve gerar um token JWT válido', async () => {
            const payload = {
                userId: '123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE
            };
            const token = await jwtService.generateToken(payload);
            (0, globals_1.expect)(token).toBeDefined();
            (0, globals_1.expect)(typeof token).toBe('string');
            (0, globals_1.expect)(token.split('.').length).toBe(3);
        });
        (0, globals_1.it)('deve incluir todos os dados do payload no token', async () => {
            const payload = {
                userId: '123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE
            };
            const token = await jwtService.generateToken(payload);
            const decodedPayload = await jwtService.verifyToken(token);
            (0, globals_1.expect)(decodedPayload).toBeDefined();
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.userId).toBe(payload.userId);
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.email).toBe(payload.email);
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.role).toBe(payload.role);
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.status).toBe(payload.status);
            (0, globals_1.expect)(decodedPayload).toHaveProperty('iat');
            (0, globals_1.expect)(decodedPayload).toHaveProperty('exp');
        });
        (0, globals_1.it)('deve aceitar um tempo de expiração personalizado', async () => {
            const payload = {
                userId: '123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE
            };
            const token = await jwtService.generateToken(payload, '2h');
            const decodedPayload = await jwtService.verifyToken(token);
            (0, globals_1.expect)(decodedPayload).toBeDefined();
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.userId).toBe(payload.userId);
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.email).toBe(payload.email);
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.role).toBe(payload.role);
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.status).toBe(payload.status);
        });
    });
    (0, globals_1.describe)('verifyToken', () => {
        (0, globals_1.it)('deve verificar um token válido e retornar o payload', async () => {
            const payload = {
                userId: '123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE
            };
            const token = await jwtService.generateToken(payload);
            const decodedPayload = await jwtService.verifyToken(token);
            (0, globals_1.expect)(decodedPayload).toBeDefined();
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.userId).toBe(payload.userId);
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.email).toBe(payload.email);
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.role).toBe(payload.role);
            (0, globals_1.expect)(decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.status).toBe(payload.status);
        });
        (0, globals_1.it)('deve retornar null para um token inválido', async () => {
            const invalidToken = 'invalid.token.string';
            const decodedPayload = await jwtService.verifyToken(invalidToken);
            (0, globals_1.expect)(decodedPayload).toBeNull();
        });
        (0, globals_1.it)('deve retornar null para um token expirado', async () => {
            const payload = {
                userId: '123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE
            };
            const token = await jwtService.generateToken(payload, '1ms');
            await new Promise(resolve => setTimeout(resolve, 10));
            const decodedPayload = await jwtService.verifyToken(token);
            (0, globals_1.expect)(decodedPayload).toBeNull();
        });
        (0, globals_1.it)('deve retornar null para um token com assinatura inválida', async () => {
            const payload = {
                userId: '123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE
            };
            const otherJwtService = new JwtTokenService_1.JwtTokenServiceImpl('different-secret');
            const token = await otherJwtService.generateToken(payload);
            const decodedPayload = await jwtService.verifyToken(token);
            (0, globals_1.expect)(decodedPayload).toBeNull();
        });
    });
});
//# sourceMappingURL=JwtTokenService.test.js.map