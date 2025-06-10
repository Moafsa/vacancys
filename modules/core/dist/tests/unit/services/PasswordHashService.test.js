"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const ApplicationError_1 = require("../../../application/errors/ApplicationError");
(0, globals_1.describe)('PasswordHashService', () => {
    let passwordHashService;
    (0, globals_1.beforeEach)(() => {
        passwordHashService = new PasswordHashService_1.PasswordHashService();
    });
    (0, globals_1.describe)('hash', () => {
        (0, globals_1.it)('deve gerar um hash válido para uma senha', async () => {
            // Arrange
            const password = 'Test@123';
            // Act
            const hash = await passwordHashService.hash(password);
            // Assert
            (0, globals_1.expect)(hash).toBeDefined();
            (0, globals_1.expect)(hash).not.toBe(password);
            (0, globals_1.expect)(hash.length).toBeGreaterThan(0);
            (0, globals_1.expect)(typeof hash).toBe('string');
        });
        (0, globals_1.it)('deve gerar hashes diferentes para a mesma senha', async () => {
            // Arrange
            const password = 'Test@123';
            // Act
            const hash1 = await passwordHashService.hash(password);
            const hash2 = await passwordHashService.hash(password);
            // Assert
            (0, globals_1.expect)(hash1).not.toBe(hash2);
        });
        (0, globals_1.it)('deve lançar erro quando a senha é vazia', async () => {
            // Arrange
            const password = '';
            // Act & Assert
            await (0, globals_1.expect)(passwordHashService.hash(password))
                .rejects
                .toThrow(ApplicationError_1.ApplicationError);
        });
        (0, globals_1.it)('deve lançar erro quando a senha é muito curta', async () => {
            // Arrange
            const password = '123';
            // Act & Assert
            await (0, globals_1.expect)(passwordHashService.hash(password))
                .rejects
                .toThrow(ApplicationError_1.ApplicationError);
        });
        (0, globals_1.it)('deve lançar erro quando a senha é undefined', async () => {
            // Arrange
            const password = undefined;
            // Act & Assert
            await (0, globals_1.expect)(passwordHashService.hash(password))
                .rejects
                .toThrow(ApplicationError_1.ApplicationError);
        });
    });
    (0, globals_1.describe)('verify', () => {
        (0, globals_1.it)('deve verificar corretamente uma senha válida', async () => {
            // Arrange
            const password = 'Test@123';
            const hash = await passwordHashService.hash(password);
            // Act
            const isValid = await passwordHashService.verify(password, hash);
            // Assert
            (0, globals_1.expect)(isValid).toBe(true);
        });
        (0, globals_1.it)('deve retornar false para uma senha incorreta', async () => {
            // Arrange
            const password = 'Test@123';
            const wrongPassword = 'WrongTest@123';
            const hash = await passwordHashService.hash(password);
            // Act
            const isValid = await passwordHashService.verify(wrongPassword, hash);
            // Assert
            (0, globals_1.expect)(isValid).toBe(false);
        });
        (0, globals_1.it)('deve retornar false para um hash inválido', async () => {
            // Arrange
            const password = 'Test@123';
            const invalidHash = 'invalid_hash';
            // Act
            const isValid = await passwordHashService.verify(password, invalidHash);
            // Assert
            (0, globals_1.expect)(isValid).toBe(false);
        });
        (0, globals_1.it)('deve lançar erro quando a senha é vazia na verificação', async () => {
            // Arrange
            const password = '';
            const hash = await passwordHashService.hash('Test@123');
            // Act & Assert
            await (0, globals_1.expect)(passwordHashService.verify(password, hash))
                .rejects
                .toThrow(ApplicationError_1.ApplicationError);
        });
        (0, globals_1.it)('deve lançar erro quando o hash é vazio', async () => {
            // Arrange
            const password = 'Test@123';
            const hash = '';
            // Act & Assert
            await (0, globals_1.expect)(passwordHashService.verify(password, hash))
                .rejects
                .toThrow(ApplicationError_1.ApplicationError);
        });
    });
    (0, globals_1.describe)('validatePassword', () => {
        (0, globals_1.it)('deve aceitar uma senha válida', () => {
            // Arrange
            const password = 'Test@123';
            // Act
            const result = passwordHashService.validatePassword(password);
            // Assert
            (0, globals_1.expect)(result).toBe(true);
        });
        (0, globals_1.it)('deve rejeitar uma senha muito curta', () => {
            // Arrange
            const password = 'Test@1';
            // Act & Assert
            (0, globals_1.expect)(() => passwordHashService.validatePassword(password))
                .toThrow(ApplicationError_1.ApplicationError);
        });
        (0, globals_1.it)('deve rejeitar uma senha sem letras maiúsculas', () => {
            // Arrange
            const password = 'test@123';
            // Act & Assert
            (0, globals_1.expect)(() => passwordHashService.validatePassword(password))
                .toThrow(ApplicationError_1.ApplicationError);
        });
        (0, globals_1.it)('deve rejeitar uma senha sem letras minúsculas', () => {
            // Arrange
            const password = 'TEST@123';
            // Act & Assert
            (0, globals_1.expect)(() => passwordHashService.validatePassword(password))
                .toThrow(ApplicationError_1.ApplicationError);
        });
        (0, globals_1.it)('deve rejeitar uma senha sem números', () => {
            // Arrange
            const password = 'Test@abc';
            // Act & Assert
            (0, globals_1.expect)(() => passwordHashService.validatePassword(password))
                .toThrow(ApplicationError_1.ApplicationError);
        });
        (0, globals_1.it)('deve rejeitar uma senha sem caracteres especiais', () => {
            // Arrange
            const password = 'Test123';
            // Act & Assert
            (0, globals_1.expect)(() => passwordHashService.validatePassword(password))
                .toThrow(ApplicationError_1.ApplicationError);
        });
    });
});
