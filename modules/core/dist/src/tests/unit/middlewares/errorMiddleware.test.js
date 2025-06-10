"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const errorMiddleware_1 = require("../../../../infrastructure/middlewares/errorMiddleware");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
(0, globals_1.describe)('ErrorMiddleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    (0, globals_1.beforeEach)(() => {
        mockRequest = {};
        mockResponse = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn()
        };
        nextFunction = globals_1.jest.fn();
    });
    (0, globals_1.it)('deve tratar ApplicationError corretamente', async () => {
        const error = new ApplicationError_1.ApplicationError('TEST_ERROR', 'Test error message', 400);
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Test error message',
            code: 'TEST_ERROR',
            status: 400
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar ValidationError corretamente', async () => {
        const error = new ApplicationError_1.ApplicationError('VALIDATION_ERROR', 'Validation failed', 422, { details: ['Field name is required', 'Email must be valid'] });
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(422);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            status: 422,
            details: ['Field name is required', 'Email must be valid']
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar NotFoundError corretamente', async () => {
        const error = new ApplicationError_1.ApplicationError('Resource not found', 'NOT_FOUND', 404);
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(404);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Resource not found',
            code: 'NOT_FOUND',
            status: 404
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar UnauthorizedError corretamente', async () => {
        const error = new ApplicationError_1.ApplicationError('AUTH_ERROR', 'Authentication failed', 401);
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Authentication failed',
            code: 'AUTH_ERROR',
            status: 401
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar ForbiddenError corretamente', async () => {
        const error = new ApplicationError_1.ApplicationError('ACCESS_DENIED', 'Access denied', 403);
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Access denied',
            code: 'ACCESS_DENIED',
            status: 403
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar erros desconhecidos como InternalServerError', async () => {
        const error = new Error('Unknown error');
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(500);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR',
            status: 500
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar erros de sintaxe JSON como BadRequest', async () => {
        const error = new SyntaxError('Unexpected token }');
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Invalid JSON syntax',
            code: 'INVALID_JSON',
            status: 400
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar erros de validação do Prisma como BadRequest', async () => {
        const error = new Error('Prisma validation error');
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Invalid data provided',
            code: 'INVALID_DATA',
            status: 400
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=errorMiddleware.test.js.map