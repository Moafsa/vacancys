"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const ConfigService_1 = require("../../../infrastructure/services/ConfigService");
const ApplicationError_1 = require("../../../application/errors/ApplicationError");
(0, globals_1.describe)('ConfigService', () => {
    let configService;
    const originalEnv = process.env;
    (0, globals_1.beforeEach)(() => {
        process.env = { ...originalEnv };
        configService = new ConfigService_1.ConfigService();
    });
    (0, globals_1.afterEach)(() => {
        process.env = originalEnv;
    });
    (0, globals_1.describe)('get', () => {
        (0, globals_1.it)('deve retornar o valor da configuração quando existe', () => {
            // Arrange
            process.env.PORT = '3000';
            process.env.NODE_ENV = 'development';
            // Act
            const port = configService.get('PORT');
            const nodeEnv = configService.get('NODE_ENV');
            // Assert
            (0, globals_1.expect)(port).toBe('3000');
            (0, globals_1.expect)(nodeEnv).toBe('development');
        });
        (0, globals_1.it)('deve retornar o valor padrão quando a configuração não existe', () => {
            // Act
            const port = configService.get('PORT', '8080');
            const nodeEnv = configService.get('NODE_ENV', 'production');
            // Assert
            (0, globals_1.expect)(port).toBe('8080');
            (0, globals_1.expect)(nodeEnv).toBe('production');
        });
        (0, globals_1.it)('deve lançar erro quando a configuração é obrigatória e não existe', () => {
            // Act & Assert
            (0, globals_1.expect)(() => configService.get('REQUIRED_CONFIG')).toThrow(new ApplicationError_1.ApplicationError('Configuration REQUIRED_CONFIG is required', 'MISSING_CONFIG', 500));
        });
    });
    (0, globals_1.describe)('getNumber', () => {
        (0, globals_1.it)('deve retornar o valor numérico da configuração', () => {
            // Arrange
            process.env.PORT = '3000';
            process.env.MAX_CONNECTIONS = '100';
            // Act
            const port = configService.getNumber('PORT');
            const maxConnections = configService.getNumber('MAX_CONNECTIONS');
            // Assert
            (0, globals_1.expect)(port).toBe(3000);
            (0, globals_1.expect)(maxConnections).toBe(100);
        });
        (0, globals_1.it)('deve retornar o valor padrão quando a configuração não existe', () => {
            // Act
            const port = configService.getNumber('PORT', 8080);
            const maxConnections = configService.getNumber('MAX_CONNECTIONS', 50);
            // Assert
            (0, globals_1.expect)(port).toBe(8080);
            (0, globals_1.expect)(maxConnections).toBe(50);
        });
        (0, globals_1.it)('deve lançar erro quando o valor não é um número válido', () => {
            // Arrange
            process.env.PORT = 'invalid';
            // Act & Assert
            (0, globals_1.expect)(() => configService.getNumber('PORT')).toThrow(new ApplicationError_1.ApplicationError('Configuration PORT must be a valid number', 'INVALID_CONFIG_TYPE', 500));
        });
    });
    (0, globals_1.describe)('getBoolean', () => {
        (0, globals_1.it)('deve retornar o valor booleano da configuração', () => {
            // Arrange
            process.env.ENABLE_CACHE = 'true';
            process.env.DEBUG_MODE = 'false';
            // Act
            const enableCache = configService.getBoolean('ENABLE_CACHE');
            const debugMode = configService.getBoolean('DEBUG_MODE');
            // Assert
            (0, globals_1.expect)(enableCache).toBe(true);
            (0, globals_1.expect)(debugMode).toBe(false);
        });
        (0, globals_1.it)('deve retornar o valor padrão quando a configuração não existe', () => {
            // Act
            const enableCache = configService.getBoolean('ENABLE_CACHE', true);
            const debugMode = configService.getBoolean('DEBUG_MODE', false);
            // Assert
            (0, globals_1.expect)(enableCache).toBe(true);
            (0, globals_1.expect)(debugMode).toBe(false);
        });
        (0, globals_1.it)('deve lançar erro quando o valor não é um booleano válido', () => {
            // Arrange
            process.env.ENABLE_CACHE = 'invalid';
            // Act & Assert
            (0, globals_1.expect)(() => configService.getBoolean('ENABLE_CACHE')).toThrow(new ApplicationError_1.ApplicationError('Configuration ENABLE_CACHE must be a valid boolean', 'INVALID_CONFIG_TYPE', 500));
        });
    });
    (0, globals_1.describe)('getArray', () => {
        (0, globals_1.it)('deve retornar o array da configuração', () => {
            // Arrange
            process.env.ALLOWED_ORIGINS = 'http://localhost:3000,https://example.com';
            process.env.ENABLED_FEATURES = 'auth,logging,monitoring';
            // Act
            const allowedOrigins = configService.getArray('ALLOWED_ORIGINS');
            const enabledFeatures = configService.getArray('ENABLED_FEATURES');
            // Assert
            (0, globals_1.expect)(allowedOrigins).toEqual([
                'http://localhost:3000',
                'https://example.com'
            ]);
            (0, globals_1.expect)(enabledFeatures).toEqual(['auth', 'logging', 'monitoring']);
        });
        (0, globals_1.it)('deve retornar o valor padrão quando a configuração não existe', () => {
            // Act
            const allowedOrigins = configService.getArray('ALLOWED_ORIGINS', ['http://localhost:3000']);
            const enabledFeatures = configService.getArray('ENABLED_FEATURES', ['auth']);
            // Assert
            (0, globals_1.expect)(allowedOrigins).toEqual(['http://localhost:3000']);
            (0, globals_1.expect)(enabledFeatures).toEqual(['auth']);
        });
        (0, globals_1.it)('deve lançar erro quando o valor não é um array válido', () => {
            // Arrange
            process.env.ALLOWED_ORIGINS = 'invalid';
            // Act & Assert
            (0, globals_1.expect)(() => configService.getArray('ALLOWED_ORIGINS')).toThrow(new ApplicationError_1.ApplicationError('Configuration ALLOWED_ORIGINS must be a valid array', 'INVALID_CONFIG_TYPE', 500));
        });
    });
    (0, globals_1.describe)('getObject', () => {
        (0, globals_1.it)('deve retornar o objeto da configuração', () => {
            // Arrange
            process.env.REDIS_CONFIG = JSON.stringify({
                host: 'localhost',
                port: 6379,
                password: 'secret'
            });
            // Act
            const redisConfig = configService.getObject('REDIS_CONFIG');
            // Assert
            (0, globals_1.expect)(redisConfig).toEqual({
                host: 'localhost',
                port: 6379,
                password: 'secret'
            });
        });
        (0, globals_1.it)('deve retornar o valor padrão quando a configuração não existe', () => {
            // Act
            const redisConfig = configService.getObject('REDIS_CONFIG', {
                host: 'localhost',
                port: 6379
            });
            // Assert
            (0, globals_1.expect)(redisConfig).toEqual({
                host: 'localhost',
                port: 6379
            });
        });
        (0, globals_1.it)('deve lançar erro quando o valor não é um objeto JSON válido', () => {
            // Arrange
            process.env.REDIS_CONFIG = 'invalid-json';
            // Act & Assert
            (0, globals_1.expect)(() => configService.getObject('REDIS_CONFIG')).toThrow(new ApplicationError_1.ApplicationError('Configuration REDIS_CONFIG must be a valid JSON object', 'INVALID_CONFIG_TYPE', 500));
        });
    });
    (0, globals_1.describe)('validate', () => {
        (0, globals_1.it)('deve validar todas as configurações obrigatórias', () => {
            // Arrange
            process.env.PORT = '3000';
            process.env.NODE_ENV = 'development';
            process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
            // Act & Assert
            (0, globals_1.expect)(() => configService.validate([
                'PORT',
                'NODE_ENV',
                'DATABASE_URL'
            ])).not.toThrow();
        });
        (0, globals_1.it)('deve lançar erro quando alguma configuração obrigatória está faltando', () => {
            // Arrange
            process.env.PORT = '3000';
            process.env.NODE_ENV = 'development';
            // Act & Assert
            (0, globals_1.expect)(() => configService.validate([
                'PORT',
                'NODE_ENV',
                'DATABASE_URL'
            ])).toThrow(new ApplicationError_1.ApplicationError('Configuration DATABASE_URL is required', 'MISSING_CONFIG', 500));
        });
    });
});
