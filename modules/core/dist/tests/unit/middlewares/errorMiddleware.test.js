"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const errorMiddleware_1 = require("../../../infrastructure/middlewares/errorMiddleware");
const ApplicationError_1 = require("../../../application/errors/ApplicationError");
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
        // Arrange
        const error = new ApplicationError_1.ApplicationError('Test error message', 'TEST_ERROR', 400);
        // Act
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Test error message',
            code: 'TEST_ERROR',
            status: 400
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar ValidationError corretamente', async () => {
        // Arrange
        const error = new ApplicationError_1.ApplicationError('Validation failed', 'VALIDATION_ERROR', 422, ['Field name is required', 'Email must be valid']);
        // Act
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        // Assert
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
        // Arrange
        const error = new ApplicationError_1.ApplicationError('Resource not found', 'NOT_FOUND', 404);
        // Act
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(404);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Resource not found',
            code: 'NOT_FOUND',
            status: 404
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar UnauthorizedError corretamente', async () => {
        // Arrange
        const error = new ApplicationError_1.ApplicationError('Unauthorized access', 'UNAUTHORIZED', 401);
        // Act
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Unauthorized access',
            code: 'UNAUTHORIZED',
            status: 401
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar ForbiddenError corretamente', async () => {
        // Arrange
        const error = new ApplicationError_1.ApplicationError('Access forbidden', 'FORBIDDEN', 403);
        // Act
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Access forbidden',
            code: 'FORBIDDEN',
            status: 403
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar erros desconhecidos como InternalServerError', async () => {
        // Arrange
        const error = new Error('Unknown error');
        // Act
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(500);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR',
            status: 500
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar erros de sintaxe JSON como BadRequest', async () => {
        // Arrange
        const error = new SyntaxError('Unexpected token }');
        // Act
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Invalid JSON syntax',
            code: 'INVALID_JSON',
            status: 400
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve tratar erros de validação do Prisma como BadRequest', async () => {
        // Arrange
        const error = new Error('Prisma validation error');
        // Act
        await (0, errorMiddleware_1.errorMiddleware)(error, mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Invalid data provided',
            code: 'INVALID_DATA',
            status: 400
        });
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
    });
});
