"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const LoggerService_1 = require("../../../infrastructure/services/LoggerService");
const LogLevel_1 = require("../../../domain/enums/LogLevel");
(0, globals_1.describe)('LoggerService', () => {
    let logger;
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.spyOn(console, 'log').mockImplementation(() => { });
        globals_1.jest.spyOn(console, 'error').mockImplementation(() => { });
        globals_1.jest.spyOn(console, 'warn').mockImplementation(() => { });
        globals_1.jest.spyOn(console, 'info').mockImplementation(() => { });
        globals_1.jest.spyOn(console, 'debug').mockImplementation(() => { });
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
            const message = 'Test info message';
            const context = { userId: '123', action: 'test' };
            logger.info(message, context);
            (0, globals_1.expect)(console.info).toHaveBeenCalled();
            (0, globals_1.expect)(console.info).toHaveBeenCalledWith(globals_1.expect.stringContaining('"level":"INFO"'));
            (0, globals_1.expect)(console.info).toHaveBeenCalledWith(globals_1.expect.stringContaining(`"message":"${message}"`));
            (0, globals_1.expect)(console.info).toHaveBeenCalledWith(globals_1.expect.stringContaining('"userId":"123"'));
            (0, globals_1.expect)(console.info).toHaveBeenCalledWith(globals_1.expect.stringContaining('"action":"test"'));
            (0, globals_1.expect)(console.info).toHaveBeenCalledWith(globals_1.expect.stringContaining('"timestamp"'));
        });
        (0, globals_1.it)('deve registrar log com nível ERROR', () => {
            const message = 'Test error message';
            const error = new Error('Test error');
            const context = { userId: '123', action: 'test' };
            logger.error(message, error, context);
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
            (0, globals_1.expect)(console.error).toHaveBeenCalledWith(globals_1.expect.stringContaining('"level":"ERROR"'));
            (0, globals_1.expect)(console.error).toHaveBeenCalledWith(globals_1.expect.stringContaining(`"message":"${message}"`));
            (0, globals_1.expect)(console.error).toHaveBeenCalledWith(globals_1.expect.stringContaining('"error"'));
            (0, globals_1.expect)(console.error).toHaveBeenCalledWith(globals_1.expect.stringContaining('"userId":"123"'));
            (0, globals_1.expect)(console.error).toHaveBeenCalledWith(globals_1.expect.stringContaining('"action":"test"'));
            (0, globals_1.expect)(console.error).toHaveBeenCalledWith(globals_1.expect.stringContaining('"timestamp"'));
        });
        (0, globals_1.it)('deve registrar log com nível WARN', () => {
            const message = 'Test warning message';
            const context = { userId: '123', action: 'test' };
            logger.warn(message, context);
            (0, globals_1.expect)(console.warn).toHaveBeenCalled();
            (0, globals_1.expect)(console.warn).toHaveBeenCalledWith(globals_1.expect.stringContaining('"level":"WARN"'));
            (0, globals_1.expect)(console.warn).toHaveBeenCalledWith(globals_1.expect.stringContaining(`"message":"${message}"`));
            (0, globals_1.expect)(console.warn).toHaveBeenCalledWith(globals_1.expect.stringContaining('"userId":"123"'));
            (0, globals_1.expect)(console.warn).toHaveBeenCalledWith(globals_1.expect.stringContaining('"action":"test"'));
            (0, globals_1.expect)(console.warn).toHaveBeenCalledWith(globals_1.expect.stringContaining('"timestamp"'));
        });
        (0, globals_1.it)('deve registrar log com nível DEBUG', () => {
            const message = 'Test debug message';
            const context = { userId: '123', action: 'test' };
            logger.debug(message, context);
            (0, globals_1.expect)(console.debug).toHaveBeenCalled();
            (0, globals_1.expect)(console.debug).toHaveBeenCalledWith(globals_1.expect.stringContaining('"level":"DEBUG"'));
            (0, globals_1.expect)(console.debug).toHaveBeenCalledWith(globals_1.expect.stringContaining(`"message":"${message}"`));
            (0, globals_1.expect)(console.debug).toHaveBeenCalledWith(globals_1.expect.stringContaining('"userId":"123"'));
            (0, globals_1.expect)(console.debug).toHaveBeenCalledWith(globals_1.expect.stringContaining('"action":"test"'));
            (0, globals_1.expect)(console.debug).toHaveBeenCalledWith(globals_1.expect.stringContaining('"timestamp"'));
        });
        (0, globals_1.it)('deve respeitar o nível de log configurado', () => {
            logger = new LoggerService_1.LoggerService({
                level: LogLevel_1.LogLevel.INFO,
                format: 'json',
                timestamp: true
            });
            logger.debug('Debug message');
            logger.info('Info message');
            logger.warn('Warning message');
            logger.error('Error message');
            (0, globals_1.expect)(console.debug).not.toHaveBeenCalled();
            (0, globals_1.expect)(console.info).toHaveBeenCalled();
            (0, globals_1.expect)(console.warn).toHaveBeenCalled();
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
        });
        (0, globals_1.it)('deve formatar log em texto simples quando format é text', () => {
            logger = new LoggerService_1.LoggerService({
                level: LogLevel_1.LogLevel.DEBUG,
                format: 'text',
                timestamp: true
            });
            logger.info('Test message', { userId: '123' });
            (0, globals_1.expect)(console.info).toHaveBeenCalled();
            (0, globals_1.expect)(console.info).toHaveBeenCalledWith(globals_1.expect.stringMatching(/\[INFO\] .* Test message userId=123/));
        });
        (0, globals_1.it)('deve incluir stack trace em logs de erro', () => {
            const error = new Error('Test error');
            const stackTrace = error.stack;
            logger.error('Error message', error);
            (0, globals_1.expect)(console.error).toHaveBeenCalled();
            (0, globals_1.expect)(console.error).toHaveBeenCalledWith(globals_1.expect.stringContaining(`"stack":"${stackTrace}"`));
        });
        (0, globals_1.it)('deve incluir metadata adicional no contexto', () => {
            const message = 'Test message';
            const context = {
                userId: '123',
                action: 'test',
                metadata: {
                    ip: '192.168.1.1',
                    userAgent: 'Mozilla/5.0'
                }
            };
            logger.info(message, context);
            (0, globals_1.expect)(console.info).toHaveBeenCalled();
            (0, globals_1.expect)(console.info).toHaveBeenCalledWith(globals_1.expect.stringContaining('"ip":"192.168.1.1"'));
            (0, globals_1.expect)(console.info).toHaveBeenCalledWith(globals_1.expect.stringContaining('"userAgent":"Mozilla/5.0"'));
        });
    });
});
//# sourceMappingURL=LoggerService.test.js.map