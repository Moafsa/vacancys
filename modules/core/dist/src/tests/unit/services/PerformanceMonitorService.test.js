"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const PerformanceMonitorService_1 = require("../../../infrastructure/services/PerformanceMonitorService");
const MetricType_1 = require("../../../domain/enums/MetricType");
(0, globals_1.describe)('PerformanceMonitorService', () => {
    let performanceMonitor;
    let mockRedisClient;
    (0, globals_1.beforeEach)(() => {
        mockRedisClient = {
            incr: globals_1.jest.fn(),
            decr: globals_1.jest.fn(),
            get: globals_1.jest.fn(),
            set: globals_1.jest.fn(),
            del: globals_1.jest.fn(),
            hincrby: globals_1.jest.fn(),
            hget: globals_1.jest.fn(),
            hset: globals_1.jest.fn(),
            hdel: globals_1.jest.fn(),
            zadd: globals_1.jest.fn(),
            zrange: globals_1.jest.fn(),
            zrem: globals_1.jest.fn()
        };
        performanceMonitor = new PerformanceMonitorService_1.PerformanceMonitorService(mockRedisClient);
    });
    (0, globals_1.afterEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('incrementCounter', () => {
        (0, globals_1.it)('deve incrementar um contador', async () => {
            const metricName = 'request_count';
            const value = 1;
            mockRedisClient.incr.mockResolvedValue(1);
            await performanceMonitor.incrementCounter(metricName, value);
            (0, globals_1.expect)(mockRedisClient.incr).toHaveBeenCalledWith(`metric:${MetricType_1.MetricType.COUNTER}:${metricName}`, value);
        });
        (0, globals_1.it)('deve lançar erro quando o incremento falha', async () => {
            const metricName = 'request_count';
            const value = 1;
            mockRedisClient.incr.mockRejectedValue(new Error('Redis error'));
            await (0, globals_1.expect)(performanceMonitor.incrementCounter(metricName, value))
                .rejects
                .toThrow('Failed to increment counter');
        });
    });
    (0, globals_1.describe)('decrementCounter', () => {
        (0, globals_1.it)('deve decrementar um contador', async () => {
            const metricName = 'active_users';
            const value = 1;
            mockRedisClient.decr.mockResolvedValue(0);
            await performanceMonitor.decrementCounter(metricName, value);
            (0, globals_1.expect)(mockRedisClient.decr).toHaveBeenCalledWith(`metric:${MetricType_1.MetricType.COUNTER}:${metricName}`, value);
        });
        (0, globals_1.it)('deve lançar erro quando o decremento falha', async () => {
            const metricName = 'active_users';
            const value = 1;
            mockRedisClient.decr.mockRejectedValue(new Error('Redis error'));
            await (0, globals_1.expect)(performanceMonitor.decrementCounter(metricName, value))
                .rejects
                .toThrow('Failed to decrement counter');
        });
    });
    (0, globals_1.describe)('recordGauge', () => {
        (0, globals_1.it)('deve registrar um valor de gauge', async () => {
            const metricName = 'memory_usage';
            const value = 1024;
            mockRedisClient.set.mockResolvedValue('OK');
            await performanceMonitor.recordGauge(metricName, value);
            (0, globals_1.expect)(mockRedisClient.set).toHaveBeenCalledWith(`metric:${MetricType_1.MetricType.GAUGE}:${metricName}`, value.toString());
        });
        (0, globals_1.it)('deve lançar erro quando o registro do gauge falha', async () => {
            const metricName = 'memory_usage';
            const value = 1024;
            mockRedisClient.set.mockRejectedValue(new Error('Redis error'));
            await (0, globals_1.expect)(performanceMonitor.recordGauge(metricName, value))
                .rejects
                .toThrow('Failed to record gauge');
        });
    });
    (0, globals_1.describe)('recordHistogram', () => {
        (0, globals_1.it)('deve registrar um valor no histograma', async () => {
            const metricName = 'response_time';
            const value = 150;
            mockRedisClient.zadd.mockResolvedValue(1);
            await performanceMonitor.recordHistogram(metricName, value);
            (0, globals_1.expect)(mockRedisClient.zadd).toHaveBeenCalledWith(`metric:${MetricType_1.MetricType.HISTOGRAM}:${metricName}`, value, globals_1.expect.any(String));
        });
        (0, globals_1.it)('deve lançar erro quando o registro do histograma falha', async () => {
            const metricName = 'response_time';
            const value = 150;
            mockRedisClient.zadd.mockRejectedValue(new Error('Redis error'));
            await (0, globals_1.expect)(performanceMonitor.recordHistogram(metricName, value))
                .rejects
                .toThrow('Failed to record histogram');
        });
    });
    (0, globals_1.describe)('getMetricValue', () => {
        (0, globals_1.it)('deve retornar o valor de um contador', async () => {
            const metricName = 'request_count';
            const value = 42;
            mockRedisClient.get.mockResolvedValue(value.toString());
            const result = await performanceMonitor.getMetricValue(MetricType_1.MetricType.COUNTER, metricName);
            (0, globals_1.expect)(result).toBe(value);
            (0, globals_1.expect)(mockRedisClient.get).toHaveBeenCalledWith(`metric:${MetricType_1.MetricType.COUNTER}:${metricName}`);
        });
        (0, globals_1.it)('deve retornar o valor de um gauge', async () => {
            const metricName = 'memory_usage';
            const value = 1024;
            mockRedisClient.get.mockResolvedValue(value.toString());
            const result = await performanceMonitor.getMetricValue(MetricType_1.MetricType.GAUGE, metricName);
            (0, globals_1.expect)(result).toBe(value);
            (0, globals_1.expect)(mockRedisClient.get).toHaveBeenCalledWith(`metric:${MetricType_1.MetricType.GAUGE}:${metricName}`);
        });
        (0, globals_1.it)('deve retornar estatísticas do histograma', async () => {
            const metricName = 'response_time';
            const values = ['100', '150', '200', '250', '300'];
            mockRedisClient.zrange.mockResolvedValue(values);
            const result = await performanceMonitor.getMetricValue(MetricType_1.MetricType.HISTOGRAM, metricName);
            (0, globals_1.expect)(result).toEqual({
                min: 100,
                max: 300,
                avg: 200,
                p50: 200,
                p90: 250,
                p95: 275,
                p99: 297
            });
            (0, globals_1.expect)(mockRedisClient.zrange).toHaveBeenCalledWith(`metric:${MetricType_1.MetricType.HISTOGRAM}:${metricName}`, 0, -1);
        });
        (0, globals_1.it)('deve retornar null quando a métrica não existe', async () => {
            const metricName = 'non_existent';
            mockRedisClient.get.mockResolvedValue(null);
            const result = await performanceMonitor.getMetricValue(MetricType_1.MetricType.COUNTER, metricName);
            (0, globals_1.expect)(result).toBeNull();
        });
        (0, globals_1.it)('deve lançar erro quando a obtenção do valor falha', async () => {
            const metricName = 'request_count';
            mockRedisClient.get.mockRejectedValue(new Error('Redis error'));
            await (0, globals_1.expect)(performanceMonitor.getMetricValue(MetricType_1.MetricType.COUNTER, metricName))
                .rejects
                .toThrow('Failed to get metric value');
        });
    });
    (0, globals_1.describe)('deleteMetric', () => {
        (0, globals_1.it)('deve deletar uma métrica', async () => {
            const metricName = 'request_count';
            mockRedisClient.del.mockResolvedValue(1);
            await performanceMonitor.deleteMetric(MetricType_1.MetricType.COUNTER, metricName);
            (0, globals_1.expect)(mockRedisClient.del).toHaveBeenCalledWith(`metric:${MetricType_1.MetricType.COUNTER}:${metricName}`);
        });
        (0, globals_1.it)('deve lançar erro quando a deleção falha', async () => {
            const metricName = 'request_count';
            mockRedisClient.del.mockRejectedValue(new Error('Redis error'));
            await (0, globals_1.expect)(performanceMonitor.deleteMetric(MetricType_1.MetricType.COUNTER, metricName))
                .rejects
                .toThrow('Failed to delete metric');
        });
    });
});
//# sourceMappingURL=PerformanceMonitorService.test.js.map