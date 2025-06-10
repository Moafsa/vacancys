"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const BcryptPasswordHashService_1 = require("../../../infrastructure/services/BcryptPasswordHashService");
(0, globals_1.describe)('PasswordHashService', () => {
    let passwordHashService;
    (0, globals_1.beforeEach)(() => {
        passwordHashService = new BcryptPasswordHashService_1.BcryptPasswordHashService();
    });
    (0, globals_1.describe)('hash', () => {
        (0, globals_1.it)('deve gerar um hash válido para uma senha', async () => {
            const password = 'validPassword123';
            const hash = await passwordHashService.hash(password);
            (0, globals_1.expect)(hash).toBeDefined();
            (0, globals_1.expect)(typeof hash).toBe('string');
            (0, globals_1.expect)(hash).not.toBe(password);
        });
        (0, globals_1.it)('deve gerar hashes diferentes para a mesma senha', async () => {
            const password = 'validPassword123';
            const hash1 = await passwordHashService.hash(password);
            const hash2 = await passwordHashService.hash(password);
            (0, globals_1.expect)(hash1).not.toBe(hash2);
        });
    });
    (0, globals_1.describe)('compare', () => {
        (0, globals_1.it)('deve retornar true para senha correta', async () => {
            const password = 'validPassword123';
            const hash = await passwordHashService.hash(password);
            const isValid = await passwordHashService.compare(password, hash);
            (0, globals_1.expect)(isValid).toBe(true);
        });
        (0, globals_1.it)('deve retornar false para senha incorreta', async () => {
            const password = 'validPassword123';
            const wrongPassword = 'wrongPassword123';
            const hash = await passwordHashService.hash(password);
            const isValid = await passwordHashService.compare(wrongPassword, hash);
            (0, globals_1.expect)(isValid).toBe(false);
        });
        (0, globals_1.it)('deve retornar false para hash inválido', async () => {
            const password = 'validPassword123';
            const invalidHash = 'invalid-hash';
            const isValid = await passwordHashService.compare(password, invalidHash);
            (0, globals_1.expect)(isValid).toBe(false);
        });
    });
});
//# sourceMappingURL=PasswordHashService.test.js.map