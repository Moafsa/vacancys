"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BcryptPasswordHashService_1 = require("../../../infrastructure/services/BcryptPasswordHashService");
describe('HashService', () => {
    let hashService;
    beforeEach(() => {
        hashService = new BcryptPasswordHashService_1.BcryptPasswordHashService();
    });
    it('deve criar um hash válido da senha', async () => {
        const password = 'password123';
        const hash = await hashService.hash(password);
        expect(hash).toBeDefined();
        expect(hash).not.toBe(password);
        expect(typeof hash).toBe('string');
        expect(hash.length).toBeGreaterThan(0);
    });
    it('deve validar uma senha correta com seu hash', async () => {
        const password = 'password123';
        const hash = await hashService.hash(password);
        const isValid = await hashService.compare(password, hash);
        expect(isValid).toBe(true);
    });
    it('deve invalidar uma senha incorreta', async () => {
        const password = 'password123';
        const wrongPassword = 'wrongpassword';
        const hash = await hashService.hash(password);
        const isValid = await hashService.compare(wrongPassword, hash);
        expect(isValid).toBe(false);
    });
});
//# sourceMappingURL=HashService.test.js.map