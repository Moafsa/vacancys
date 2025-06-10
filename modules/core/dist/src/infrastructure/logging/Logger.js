"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config/config"));
const { combine, timestamp, printf, colorize } = winston_1.default.format;
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} ${level}: ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});
const winstonLogger = winston_1.default.createLogger({
    level: config_1.default.logging.level,
    format: combine(timestamp(), customFormat),
    transports: [
        new winston_1.default.transports.Console({
            format: combine(colorize(), timestamp(), customFormat),
        }),
        new winston_1.default.transports.DailyRotateFile({
            filename: path_1.default.join(config_1.default.logging.directory, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: config_1.default.logging.maxSize,
            maxFiles: config_1.default.logging.maxFiles,
        }),
        new winston_1.default.transports.DailyRotateFile({
            filename: path_1.default.join(config_1.default.logging.directory, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: config_1.default.logging.maxSize,
            maxFiles: config_1.default.logging.maxFiles,
            level: 'error',
        }),
    ],
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
});
class Logger {
    constructor(winstonLogger) {
        this.winstonLogger = winstonLogger;
    }
    error(message, ...meta) {
        this.winstonLogger.error(message, ...meta);
    }
    warn(message, ...meta) {
        this.winstonLogger.warn(message, ...meta);
    }
    info(message, ...meta) {
        this.winstonLogger.info(message, ...meta);
    }
    debug(message, ...meta) {
        this.winstonLogger.debug(message, ...meta);
    }
    http(message, ...meta) {
        this.winstonLogger.http(message, ...meta);
    }
    get transports() {
        return this.winstonLogger.transports;
    }
}
exports.logger = new Logger(winstonLogger);
const httpLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        exports.logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('user-agent'),
        });
    });
    next();
};
exports.httpLogger = httpLogger;
//# sourceMappingURL=Logger.js.map