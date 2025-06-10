"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const rbacMiddleware_1 = require("../../../infrastructure/middlewares/rbacMiddleware");
const UserRole_1 = require("../../../domain/entities/UserRole");
(0, globals_1.describe)('RBACMiddleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    (0, globals_1.beforeEach)(() => {
        mockRequest = {
            user: undefined
        };
        mockResponse = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn()
        };
        nextFunction = globals_1.jest.fn();
    });
    (0, globals_1.it)('deve permitir acesso quando o usuário tem a role necessária', async () => {
        // Arrange
        mockRequest.user = {
            userId: '123',
            email: 'admin@example.com',
            role: UserRole_1.UserRole.ADMIN,
            status: 'ACTIVE'
        };
        const requiredRoles = [UserRole_1.UserRole.ADMIN];
        // Act
        await (0, rbacMiddleware_1.rbacMiddleware)(requiredRoles)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve permitir acesso quando o usuário tem uma das roles necessárias', async () => {
        // Arrange
        mockRequest.user = {
            userId: '123',
            email: 'manager@example.com',
            role: UserRole_1.UserRole.MANAGER,
            status: 'ACTIVE'
        };
        const requiredRoles = [UserRole_1.UserRole.ADMIN, UserRole_1.UserRole.MANAGER];
        // Act
        await (0, rbacMiddleware_1.rbacMiddleware)(requiredRoles)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('deve negar acesso quando o usuário não tem a role necessária', async () => {
        // Arrange
        mockRequest.user = {
            userId: '123',
            email: 'user@example.com',
            role: UserRole_1.UserRole.USER,
            status: 'ACTIVE'
        };
        const requiredRoles = [UserRole_1.UserRole.ADMIN];
        // Act
        await (0, rbacMiddleware_1.rbacMiddleware)(requiredRoles)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'Insufficient permissions',
            code: 'INSUFFICIENT_PERMISSIONS',
            status: 403
        });
    });
    (0, globals_1.it)('deve negar acesso quando o usuário não está autenticado', async () => {
        // Arrange
        const requiredRoles = [UserRole_1.UserRole.ADMIN];
        // Act
        await (0, rbacMiddleware_1.rbacMiddleware)(requiredRoles)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(401);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'User not authenticated',
            code: 'USER_NOT_AUTHENTICATED',
            status: 401
        });
    });
    (0, globals_1.it)('deve negar acesso quando o usuário está inativo', async () => {
        // Arrange
        mockRequest.user = {
            userId: '123',
            email: 'admin@example.com',
            role: UserRole_1.UserRole.ADMIN,
            status: 'INACTIVE'
        };
        const requiredRoles = [UserRole_1.UserRole.ADMIN];
        // Act
        await (0, rbacMiddleware_1.rbacMiddleware)(requiredRoles)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'User account is not active',
            code: 'USER_INACTIVE',
            status: 403
        });
    });
    (0, globals_1.it)('deve negar acesso quando o usuário está pendente', async () => {
        // Arrange
        mockRequest.user = {
            userId: '123',
            email: 'admin@example.com',
            role: UserRole_1.UserRole.ADMIN,
            status: 'PENDING'
        };
        const requiredRoles = [UserRole_1.UserRole.ADMIN];
        // Act
        await (0, rbacMiddleware_1.rbacMiddleware)(requiredRoles)(mockRequest, mockResponse, nextFunction);
        // Assert
        (0, globals_1.expect)(nextFunction).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockResponse.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockResponse.json).toHaveBeenCalledWith({
            error: 'User account is pending verification',
            code: 'USER_PENDING',
            status: 403
        });
    });
});
