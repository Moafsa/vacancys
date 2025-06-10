"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoringService = void 0;
const prom_client_1 = require("prom-client");
const Logger_1 = require("../logging/Logger");
class MonitoringService {
    constructor() {
        this.registry = new prom_client_1.Registry();
        this.initializeMetrics();
        (0, prom_client_1.collectDefaultMetrics)({ register: this.registry });
        Logger_1.logger.info('Serviço de monitoramento inicializado');
    }
    initializeMetrics() {
        this.httpRequestsTotal = new prom_client_1.Counter({
            name: 'http_requests_total',
            help: 'Total de requisições HTTP',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.registry]
        });
        this.httpRequestDuration = new prom_client_1.Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duração das requisições HTTP em segundos',
            labelNames: ['method', 'route'],
            buckets: [0.1, 0.5, 1, 2, 5],
            registers: [this.registry]
        });
        this.activeUsers = new prom_client_1.Gauge({
            name: 'active_users',
            help: 'Número de usuários ativos no sistema',
            registers: [this.registry]
        });
        this.databaseConnectionPool = new prom_client_1.Gauge({
            name: 'database_connection_pool',
            help: 'Número de conexões ativas no pool do banco de dados',
            registers: [this.registry]
        });
        this.memoryUsage = new prom_client_1.Gauge({
            name: 'memory_usage_bytes',
            help: 'Uso de memória em bytes',
            labelNames: ['type'],
            registers: [this.registry]
        });
        this.cpuUsage = new prom_client_1.Gauge({
            name: 'cpu_usage_percentage',
            help: 'Porcentagem de uso da CPU',
            registers: [this.registry]
        });
    }
    observeHttpRequest(method, route, statusCode, duration) {
        this.httpRequestsTotal.labels(method, route, statusCode.toString()).inc();
        this.httpRequestDuration.labels(method, route).observe(duration);
    }
    setActiveUsers(count) {
        this.activeUsers.set(count);
    }
    setDatabaseConnections(count) {
        this.databaseConnectionPool.set(count);
    }
    updateMemoryMetrics() {
        const memoryUsage = process.memoryUsage();
        this.memoryUsage.labels('heap').set(memoryUsage.heapUsed);
        this.memoryUsage.labels('rss').set(memoryUsage.rss);
    }
    updateCpuMetrics() {
        const cpuUsage = process.cpuUsage();
        const totalUsage = (cpuUsage.user + cpuUsage.system) / 1000000;
        this.cpuUsage.set(totalUsage);
    }
    async getMetrics() {
        try {
            return await this.registry.metrics();
        }
        catch (error) {
            Logger_1.logger.error('Erro ao coletar métricas:', error);
            throw error;
        }
    }
}
exports.monitoringService = new MonitoringService();
//# sourceMappingURL=MonitoringService.js.map