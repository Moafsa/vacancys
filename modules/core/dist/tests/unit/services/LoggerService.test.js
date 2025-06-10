"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const LoggerService_1 = require("../../../infrastructure/services/LoggerService");
const LogLevel_1 = require("../../../domain/enums/LogLevel");
(0, globals_1.describe)('LoggerService', () => {
    let logger;
    let consoleSpy;
    (0, globals_1.beforeEach)(() => {
        consoleSpy = globals_1.jest.spyOn(console, 'log').mockImplementation();
        globals_1.jest.spyOn(console, 'error').mockImplementation();
        globals_1.jest.spyOn(console, 'warn').mockImplementation();
        globals_1.jest.spyOn(console, 'info').mockImplementation();
        globals_1.jest.spyOn(console, 'debug').mockImplementation();
        logger = new LoggerService_1.LoggerService({
            level: LogLevel_1.LogLevel.DEBUG,
            format: 'json',
            timestamp: true
        });
    });
    afterEach(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('log', () => {
        (0, globals_1.it)('deve registrar log com nível INFO', () => {
            // Arrange
            const message = 'Test info message';
            const context = { userId: '123', action: 'test' };
            // Act
            logger.info(message, context);
            // Assert
            (0, globals_1.expect)(console.info).toHaveBeenCalled();
            const logCall = console.info.mock.calls[0][0];
            (0, globals_1.expect)(logCall).toContain('"level":"INFO"');
            (0, globals_1.expect)(logCall).toContain(`"message":"${message}"`);
            (0, globals_1.expect)(logCall).toContain('"userId":"123"');
            (0, globals_1.expect)(logCall).toContain('"action":"test"');
            (0, globals_1.expect)(logCall).toContain('"timestamp"');
        });
        (0, globals_1.it)('deve registrar log com nível ERROR', () => {
            // Arrange
            const message = 'Test error message';
            const error = new Error('Test error');
            const context = { userId: '123', action: 'test' };
            // Act
            logger.error(message, error, context);
            // Assert
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
            const logCall = console.error.mock.calls[0][0];
            (0, globals_1.expect)(logCall).toContain('"level":"ERROR"');
            (0, globals_1.expect)(logCall).toContain(`"message":"${message}"`);
            (0, globals_1.expect)(logCall).toContain('"error"');
            (0, globals_1.expect)(logCall).toContain('"userId":"123"');
            (0, globals_1.expect)(logCall).toContain('"action":"test"');
            (0, globals_1.expect)(logCall).toContain('"timestamp"');
        });
        (0, globals_1.it)('deve registrar log com nível WARN', () => {
            // Arrange
            const message = 'Test warning message';
            const context = { userId: '123', action: 'test' };
            // Act
            logger.warn(message, context);
            // Assert
            (0, globals_1.expect)(console.warn).toHaveBeenCalled();
            const logCall = console.warn.mock.calls[0][0];
            (0, globals_1.expect)(logCall).toContain('"level":"WARN"');
            (0, globals_1.expect)(logCall).toContain(`"message":"${message}"`);
            (0, globals_1.expect)(logCall).toContain('"userId":"123"');
            (0, globals_1.expect)(logCall).toContain('"action":"test"');
            (0, globals_1.expect)(logCall).toContain('"timestamp"');
        });
        (0, globals_1.it)('deve registrar log com nível DEBUG', () => {
            // Arrange
            const message = 'Test debug message';
            const context = { userId: '123', action: 'test' };
            // Act
            logger.debug(message, context);
            // Assert
            (0, globals_1.expect)(console.debug).toHaveBeenCalled();
            const logCall = console.debug.mock.calls[0][0];
            (0, globals_1.expect)(logCall).toContain('"level":"DEBUG"');
            (0, globals_1.expect)(logCall).toContain(`"message":"${message}"`);
            (0, globals_1.expect)(logCall).toContain('"userId":"123"');
            (0, globals_1.expect)(logCall).toContain('"action":"test"');
            (0, globals_1.expect)(logCall).toContain('"timestamp"');
        });
        (0, globals_1.it)('deve respeitar o nível de log configurado', () => {
            // Arrange
            logger = new LoggerService_1.LoggerService({
                level: LogLevel_1.LogLevel.INFO,
                format: 'json',
                timestamp: true
            });
            // Act
            logger.debug('Debug message');
            logger.info('Info message');
            logger.warn('Warning message');
            logger.error('Error message');
            // Assert
            (0, globals_1.expect)(console.debug).not.toHaveBeenCalled();
            (0, globals_1.expect)(console.info).toHaveBeenCalled();
            (0, globals_1.expect)(console.warn).toHaveBeenCalled();
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
        });
        (0, globals_1.it)('deve formatar log em texto simples quando format é text', () => {
            // Arrange
            logger = new LoggerService_1.LoggerService({
                level: LogLevel_1.LogLevel.DEBUG,
                format: 'text',
                timestamp: true
            });
            // Act
            logger.info('Test message', { userId: '123' });
            // Assert
            (0, globals_1.expect)(console.info).toHaveBeenCalled();
            const logCall = console.info.mock.calls[0][0];
            (0, globals_1.expect)(logCall).toMatch(/\[INFO\] .* Test message userId=123/);
        });
        (0, globals_1.it)('deve incluir stack trace em logs de erro', () => {
            // Arrange
            const error = new Error('Test error');
            const stackTrace = error.stack;
            // Act
            logger.error('Error message', error);
            // Assert
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
            const logCall = console.error.mock.calls[0][0];
            (0, globals_1.expect)(logCall).toContain('"stack":"' + stackTrace + '"');
        });
        (0, globals_1.it)('deve incluir metadata adicional no contexto', () => {
            // Arrange
            const message = 'Test message';
            const context = {
                userId: '123',
                action: 'test',
                metadata: {
                    ip: '192.168.1.1',
                    userAgent: 'Mozilla/5.0'
                }
            };
            // Act
            logger.info(message, context);
            // Assert
            (0, globals_1.expect)(console.info).toHaveBeenCalled();
            const logCall = console.info.mock.calls[0][0];
            (0, globals_1.expect)(logCall).toContain('"ip":"192.168.1.1"');
            (0, globals_1.expect)(logCall).toContain('"userAgent":"Mozilla/5.0"');
        });
    });
});
