"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMocks = exports.mockNext = exports.mockResponse = exports.mockRequest = exports.mockPendingUser = exports.mockInactiveUser = exports.mockAdminUser = exports.mockUser = void 0;
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
exports.mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole_1.UserRole.USER,
    status: UserStatus_1.UserStatus.ACTIVE,
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    toJSON: () => ({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole_1.UserRole.USER,
        status: UserStatus_1.UserStatus.ACTIVE,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
};
exports.mockAdminUser = {
    ...exports.mockUser,
    role: UserRole_1.UserRole.ADMIN,
    toJSON: () => ({
        ...exports.mockUser.toJSON(),
        role: UserRole_1.UserRole.ADMIN,
    }),
};
exports.mockInactiveUser = {
    ...exports.mockUser,
    status: UserStatus_1.UserStatus.INACTIVE,
    toJSON: () => ({
        ...exports.mockUser.toJSON(),
        status: UserStatus_1.UserStatus.INACTIVE,
    }),
};
exports.mockPendingUser = {
    ...exports.mockUser,
    status: UserStatus_1.UserStatus.PENDING,
    isEmailVerified: false,
    toJSON: () => ({
        ...exports.mockUser.toJSON(),
        status: UserStatus_1.UserStatus.PENDING,
        isEmailVerified: false,
    }),
};
exports.mockRequest = {
    headers: {},
    body: {},
    params: {},
    query: {},
    user: null,
};
exports.mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
};
exports.mockNext = jest.fn();
const clearMocks = () => {
    jest.clearAllMocks();
    exports.mockRequest.headers = {};
    exports.mockRequest.body = {};
    exports.mockRequest.params = {};
    exports.mockRequest.query = {};
    exports.mockRequest.user = null;
};
exports.clearMocks = clearMocks;
//# sourceMappingURL=testUtils.js.map