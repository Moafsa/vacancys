"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApplicationError_1 = require("../../../application/errors/ApplicationError");
const Logger_1 = require("../../../infrastructure/logging/Logger");
const errorHandler = (error, req, res, next) => {
    Logger_1.logger.error('Erro na aplicação:', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });
    if (error instanceof ApplicationError_1.ApplicationError) {
        return res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
                statusCode: error.statusCode
            }
        });
    }
    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro interno do servidor',
            statusCode: 500
        }
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map