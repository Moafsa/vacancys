"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(__dirname, '../../.env');
require('dotenv').config({ path: envPath });
exports.config = {
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        host: process.env.HOST || 'localhost',
    },
    env: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    email: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    },
    statusPage: {
        enabled: process.env.STATUS_PAGE_ENABLED !== 'false',
        path: process.env.STATUS_PAGE_PATH || '/status',
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        maxSize: process.env.LOG_MAX_SIZE || '20m',
        maxFiles: process.env.LOG_MAX_FILES || '14d',
        directory: process.env.LOG_DIRECTORY || 'logs',
    },
    monitoring: {
        enabled: process.env.ENABLE_MONITORING === 'true',
        metricsPath: process.env.METRICS_PATH || '/metrics',
        collectInterval: 15000,
        retentionPeriod: 3600000,
    },
    metrics: {
        collectInterval: 15000,
        retentionPeriod: 3600000,
    },
};
exports.default = exports.config;
//# sourceMappingURL=config.js.map