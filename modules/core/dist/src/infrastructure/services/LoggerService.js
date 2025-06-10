"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const LogLevel_1 = require("../../domain/enums/LogLevel");
class LoggerService {
    constructor(config) {
        this.config = config;
    }
    info(message, context) {
        this.log(LogLevel_1.LogLevel.INFO, message, undefined, context);
    }
    error(message, error, context) {
        this.log(LogLevel_1.LogLevel.ERROR, message, error, context);
    }
    warn(message, context) {
        this.log(LogLevel_1.LogLevel.WARN, message, undefined, context);
    }
    debug(message, context) {
        this.log(LogLevel_1.LogLevel.DEBUG, message, undefined, context);
    }
    log(level, message, error, context) {
        if (this.shouldLog(level)) {
            const logData = this.formatLog(level, message, error, context);
            this.writeLog(level, logData);
        }
    }
    shouldLog(level) {
        const levels = {
            [LogLevel_1.LogLevel.ERROR]: 0,
            [LogLevel_1.LogLevel.WARN]: 1,
            [LogLevel_1.LogLevel.INFO]: 2,
            [LogLevel_1.LogLevel.DEBUG]: 3
        };
        return levels[level] <= levels[this.config.level];
    }
    formatLog(level, message, error, context) {
        const timestamp = this.config.timestamp ? new Date().toISOString() : undefined;
        const logData = {
            level,
            message,
            ...(timestamp && { timestamp }),
            ...(error && {
                error: error.message,
                stack: error.stack
            }),
            ...context
        };
        if (this.config.format === 'json') {
            return JSON.stringify(logData);
        }
        let textLog = `[${level}]`;
        if (timestamp) {
            textLog += ` ${timestamp}`;
        }
        textLog += ` ${message}`;
        if (context) {
            Object.entries(context).forEach(([key, value]) => {
                textLog += ` ${key}=${value}`;
            });
        }
        if (error) {
            textLog += `\nError: ${error.message}`;
            if (error.stack) {
                textLog += `\n${error.stack}`;
            }
        }
        return textLog;
    }
    writeLog(level, data) {
        switch (level) {
            case LogLevel_1.LogLevel.ERROR:
                console.error(data);
                break;
            case LogLevel_1.LogLevel.WARN:
                console.warn(data);
                break;
            case LogLevel_1.LogLevel.INFO:
                console.info(data);
                break;
            case LogLevel_1.LogLevel.DEBUG:
                console.debug(data);
                break;
            default:
                console.log(data);
        }
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=LoggerService.js.map