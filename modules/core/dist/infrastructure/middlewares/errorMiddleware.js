"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ApplicationError_1 = require("../../application/errors/ApplicationError");
const errorMiddleware = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    if (error instanceof ApplicationError_1.ApplicationError) {
        return res.status(error.status).json({
            error: error.message,
            code: error.code,
            status: error.status,
            ...(error.details && { details: error.details })
        });
    }
    if (error instanceof SyntaxError && 'body' in error) {
        return res.status(400).json({
            error: 'Invalid JSON syntax',
            code: 'INVALID_JSON',
            status: 400
        });
    }
    if (error.name === 'PrismaClientValidationError') {
        return res.status(400).json({
            error: 'Invalid data provided',
            code: 'INVALID_DATA',
            status: 400
        });
    }
    console.error('Unhandled error:', error);
    return res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        status: 500
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map