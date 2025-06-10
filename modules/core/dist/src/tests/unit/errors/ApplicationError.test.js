"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationError_1 = require("@/application/errors/ApplicationError");
describe('ApplicationError', () => {
    it('deve criar um erro com as propriedades corretas', () => {
        const message = 'Erro de teste';
        const code = 'TEST_ERROR';
        const statusCode = 400;
        const error = new ApplicationError_1.ApplicationError(message, code, statusCode);
        expect(error.message).toBe(message);
        expect(error.code).toBe(code);
        expect(error.statusCode).toBe(statusCode);
        expect(error.name).toBe('ApplicationError');
    });
    it('deve usar o statusCode padrão (500) quando não especificado', () => {
        const message = 'Erro de teste';
        const code = 'TEST_ERROR';
        const error = new ApplicationError_1.ApplicationError(message, code);
        expect(error.statusCode).toBe(500);
    });
    it('deve estender a classe Error', () => {
        const error = new ApplicationError_1.ApplicationError('Erro de teste', 'TEST_ERROR');
        expect(error).toBeInstanceOf(Error);
    });
    it('should have a stack trace', () => {
        const error = new ApplicationError_1.ApplicationError('Test error', 'TEST_ERROR');
        expect(error.stack).toBeDefined();
    });
});
//# sourceMappingURL=ApplicationError.test.js.map