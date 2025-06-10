"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusController = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../../../config/config"));
class StatusController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatus(req, res) {
        try {
            const dbStatus = await this.checkDatabaseConnection();
            const safeConfig = this.getSafeConfig();
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: config_1.default.env,
                database: dbStatus,
                config: safeConfig
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'ERROR',
                timestamp: new Date().toISOString(),
                error: this.formatError(error)
            });
        }
    }
    async serveStatusPage(req, res) {
        try {
            const staticFilePath = path_1.default.join(__dirname, '..', 'static', 'status.html');
            if (fs_1.default.existsSync(staticFilePath)) {
                res.sendFile(staticFilePath);
            }
            else {
                res.status(404).send('Página de status não encontrada');
            }
        }
        catch (error) {
            console.error('Erro ao servir a página de status:', error);
            res.status(500).send('Erro interno ao servir a página de status');
        }
    }
    async checkDatabaseConnection() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return { status: 'Connected' };
        }
        catch (error) {
            return {
                status: 'Error',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            };
        }
    }
    getSafeConfig() {
        return {
            email: {
                host: config_1.default.email.host,
                port: config_1.default.email.port,
                secure: config_1.default.email.secure,
                auth: {
                    user: config_1.default.email.auth.user ? '******' : '',
                    pass: config_1.default.email.auth.pass ? '******' : ''
                }
            },
            redis: {
                host: config_1.default.redis.host,
                port: config_1.default.redis.port,
                auth: config_1.default.redis.password ? '******' : ''
            }
        };
    }
    formatError(error) {
        if (error instanceof Error) {
            return { message: error.message };
        }
        return { message: 'Erro desconhecido' };
    }
}
exports.StatusController = StatusController;
//# sourceMappingURL=StatusController.js.map