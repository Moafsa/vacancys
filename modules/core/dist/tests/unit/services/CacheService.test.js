"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const CacheService_1 = require("../../../infrastructure/services/CacheService");
const CacheError_1 = require("../../../domain/errors/CacheError");
(0, globals_1.describe)('CacheService', () => {
    let cacheService;
    let mockRedisClient;
    let mockMemoryCache;
    (0, globals_1.beforeEach)(() => {
        mockRedisClient = {
            get: globals_1.jest.fn(),
            set: globals_1.jest.fn(),
            del: globals_1.jest.fn(),
            expire: globals_1.jest.fn(),
            exists: globals_1.jest.fn()
        };
        mockMemoryCache = new Map();
        cacheService = new CacheService_1.CacheService(mockRedisClient, mockMemoryCache);
    });
    (0, globals_1.afterEach)(() => {
        globals_1.jest.clearAllMocks();
        mockMemoryCache.clear();
    });
    (0, globals_1.describe)('get', () => {
        (0, globals_1.it)('deve retornar valor do cache em memória quando disponível', async () => {
            // Arrange
            const key = 'test-key';
            const value = { data: 'test-value' };
            mockMemoryCache.set(key, value);
            // Act
            const result = await cacheService.get(key);
            // Assert
            (0, globals_1.expect)(result).toEqual(value);
            (0, globals_1.expect)(mockRedisClient.get).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('deve buscar valor do Redis quando não disponível em memória', async () => {
            // Arrange
            const key = 'test-key';
            const value = { data: 'test-value' };
            mockRedisClient.get.mockResolvedValue(JSON.stringify(value));
            // Act
            const result = await cacheService.get(key);
            // Assert
            (0, globals_1.expect)(result).toEqual(value);
            (0, globals_1.expect)(mockRedisClient.get).toHaveBeenCalledWith(key);
            (0, globals_1.expect)(mockMemoryCache.get(key)).toEqual(value);
        });
        (0, globals_1.it)('deve retornar null quando valor não encontrado', async () => {
            // Arrange
            const key = 'test-key';
            mockRedisClient.get.mockResolvedValue(null);
            // Act
            const result = await cacheService.get(key);
            // Assert
            (0, globals_1.expect)(result).toBeNull();
        });
        (0, globals_1.it)('deve lançar erro quando falha ao buscar do Redis', async () => {
            // Arrange
            const key = 'test-key';
            mockRedisClient.get.mockRejectedValue(new Error('Redis error'));
            // Act & Assert
            await (0, globals_1.expect)(cacheService.get(key))
                .rejects
                .toThrow(CacheError_1.CacheError);
        });
    });
    (0, globals_1.describe)('set', () => {
        (0, globals_1.it)('deve salvar valor no cache em memória e Redis', async () => {
            // Arrange
            const key = 'test-key';
            const value = { data: 'test-value' };
            const options = {
                ttl: 3600,
                useMemory: true
            };
            // Act
            await cacheService.set(key, value, options);
            // Assert
            (0, globals_1.expect)(mockMemoryCache.get(key)).toEqual(value);
            (0, globals_1.expect)(mockRedisClient.set).toHaveBeenCalledWith(key, JSON.stringify(value));
            (0, globals_1.expect)(mockRedisClient.expire).toHaveBeenCalledWith(key, options.ttl);
        });
        (0, globals_1.it)('deve salvar apenas no Redis quando useMemory é false', async () => {
            // Arrange
            const key = 'test-key';
            const value = { data: 'test-value' };
            const options = {
                ttl: 3600,
                useMemory: false
            };
            // Act
            await cacheService.set(key, value, options);
            // Assert
            (0, globals_1.expect)(mockMemoryCache.has(key)).toBe(false);
            (0, globals_1.expect)(mockRedisClient.set).toHaveBeenCalledWith(key, JSON.stringify(value));
        });
        (0, globals_1.it)('deve lançar erro quando falha ao salvar no Redis', async () => {
            // Arrange
            const key = 'test-key';
            const value = { data: 'test-value' };
            mockRedisClient.set.mockRejectedValue(new Error('Redis error'));
            // Act & Assert
            await (0, globals_1.expect)(cacheService.set(key, value))
                .rejects
                .toThrow(CacheError_1.CacheError);
        });
    });
    (0, globals_1.describe)('delete', () => {
        (0, globals_1.it)('deve remover valor do cache em memória e Redis', async () => {
            // Arrange
            const key = 'test-key';
            mockMemoryCache.set(key, { data: 'test-value' });
            // Act
            await cacheService.delete(key);
            // Assert
            (0, globals_1.expect)(mockMemoryCache.has(key)).toBe(false);
            (0, globals_1.expect)(mockRedisClient.del).toHaveBeenCalledWith(key);
        });
        (0, globals_1.it)('deve lançar erro quando falha ao remover do Redis', async () => {
            // Arrange
            const key = 'test-key';
            mockRedisClient.del.mockRejectedValue(new Error('Redis error'));
            // Act & Assert
            await (0, globals_1.expect)(cacheService.delete(key))
                .rejects
                .toThrow(CacheError_1.CacheError);
        });
    });
    (0, globals_1.describe)('exists', () => {
        (0, globals_1.it)('deve verificar existência no cache em memória primeiro', async () => {
            // Arrange
            const key = 'test-key';
            mockMemoryCache.set(key, { data: 'test-value' });
            // Act
            const result = await cacheService.exists(key);
            // Assert
            (0, globals_1.expect)(result).toBe(true);
            (0, globals_1.expect)(mockRedisClient.exists).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('deve verificar no Redis quando não encontrado em memória', async () => {
            // Arrange
            const key = 'test-key';
            mockRedisClient.exists.mockResolvedValue(1);
            // Act
            const result = await cacheService.exists(key);
            // Assert
            (0, globals_1.expect)(result).toBe(true);
            (0, globals_1.expect)(mockRedisClient.exists).toHaveBeenCalledWith(key);
        });
        (0, globals_1.it)('deve retornar false quando não encontrado em nenhum lugar', async () => {
            // Arrange
            const key = 'test-key';
            mockRedisClient.exists.mockResolvedValue(0);
            // Act
            const result = await cacheService.exists(key);
            // Assert
            (0, globals_1.expect)(result).toBe(false);
        });
        (0, globals_1.it)('deve lançar erro quando falha ao verificar no Redis', async () => {
            // Arrange
            const key = 'test-key';
            mockRedisClient.exists.mockRejectedValue(new Error('Redis error'));
            // Act & Assert
            await (0, globals_1.expect)(cacheService.exists(key))
                .rejects
                .toThrow(CacheError_1.CacheError);
        });
    });
    (0, globals_1.describe)('clear', () => {
        (0, globals_1.it)('deve limpar cache em memória', async () => {
            // Arrange
            mockMemoryCache.set('key1', 'value1');
            mockMemoryCache.set('key2', 'value2');
            // Act
            await cacheService.clear();
            // Assert
            (0, globals_1.expect)(mockMemoryCache.size).toBe(0);
        });
    });
});
