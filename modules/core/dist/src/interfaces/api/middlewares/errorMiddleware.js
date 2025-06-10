"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApplicationError_1 = require("@shared/errors/ApplicationError");
const Logger_1 = require("@infrastructure/logging/Logger");
const errorHandler = (error, req, res, next) => {
    Logger_1.logger.error('Error handling middleware', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        body: req.body,
    });
    if (error instanceof ApplicationError_1.ApplicationError) {
        return res.status(error.statusCode).json({
            error: {
                message: error.message,
                code: error.code,
                statusCode: error.statusCode,
                details: error.details,
            },
        });
    }
    return res.status(500).json({
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
        },
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorMiddleware.js.map