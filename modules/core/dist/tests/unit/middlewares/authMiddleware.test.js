"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const authMiddleware_1 = require("../../../infrastructure/middlewares/authMiddleware");
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
(0, globals_1.describe)('AuthMiddleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    let jwtService;
    (0, globals_1.beforeEach)(() => {
        mockRequest = {
            headers: {},
            user: undefined
        };
        mockResponse = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn()
        };
        nextFunction = globals_1.jest.fn();
        jwtService = new JwtTokenService_1.JwtTokenService('test-secret');
    });
    (0, globals_1.it)('deve passar a autenticação com um token válido', async () => {
        // Arrange
        const token = await jwtService.generateToken({
            userId: '123',
            email: 'test@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE
        });
        mockRequest.headers = {
            authorization: `Bearer ${token}`
        };
        // Act
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockRequest.user).toBeDefined();
        (0, globals_1.expect)(mockRequest.user).toMatchObject({
            userId: '123',
            email: 'test@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE
        });
    });
    (0, globals_1.it)('deve retornar erro 401 quando não há token', async () => {
        // Act
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'No token provided',
            code: 'NO_TOKEN',
            status: 401
        });
        (0, globals_1.expect)(mockRequest.user).toBeUndefined();
    });
    (0, globals_1.it)('deve retornar erro 401 quando o token está mal formatado', async () => {
        // Arrange
        mockRequest.headers = {
            authorization: 'Bearer invalid-token'
        };
        // Act
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Invalid token',
            code: 'INVALID_TOKEN',
            status: 401
        });
        (0, globals_1.expect)(mockRequest.user).toBeUndefined();
    });
    (0, globals_1.it)('deve retornar erro 401 quando o token está expirado', async () => {
        // Arrange
        const token = await jwtService.generateToken({
            userId: '123',
            email: 'test@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE
        }, '1ms');
        mockRequest.headers = {
            authorization: `Bearer ${token}`
        };
        // Aguardar a expiração do token
        await new Promise(resolve => setTimeout(resolve, 10));
        // Act
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Token expired',
            code: 'TOKEN_EXPIRED',
            status: 401
        });
        (0, globals_1.expect)(mockRequest.user).toBeUndefined();
    });
    (0, globals_1.it)('deve retornar erro 403 quando o usuário está inativo', async () => {
        // Arrange
        const token = await jwtService.generateToken({
            userId: '123',
            email: 'test@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.INACTIVE
        });
        mockRequest.headers = {
            authorization: `Bearer ${token}`
        };
        // Act
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'User account is not active',
            code: 'USER_INACTIVE',
            status: 403
        });
        (0, globals_1.expect)(mockRequest.user).toBeUndefined();
    });
    (0, globals_1.it)('deve retornar erro 403 quando o usuário está pendente', async () => {
        // Arrange
        const token = await jwtService.generateToken({
            userId: '123',
            email: 'test@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING
        });
        mockRequest.headers = {
            authorization: `Bearer ${token}`
        };
        // Act
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'User account is pending verification',
            code: 'USER_PENDING',
            status: 403
        });
        (0, globals_1.expect)(mockRequest.user).toBeUndefined();
    });
});
