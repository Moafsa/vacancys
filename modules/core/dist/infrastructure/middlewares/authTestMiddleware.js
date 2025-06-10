"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTestMiddleware = void 0;
const UserRole_1 = require("../../domain/entities/UserRole");
const authTestMiddleware = (role = UserRole_1.UserRole.USER) => {
    return (req, res, next) => {
        req.user = {
            id: 'test-user-id',
            role: role
        };
        next();
    };
};
exports.authTestMiddleware = authTestMiddleware;
//# sourceMappingURL=authTestMiddleware.js.map