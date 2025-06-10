"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbacMiddleware = void 0;
const ApplicationError_1 = require("../../domain/errors/ApplicationError");
const rbacMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new ApplicationError_1.ApplicationError('Usuário não autenticado', 401, 'UNAUTHORIZED');
            }
            if (!allowedRoles || allowedRoles.length === 0) {
                throw new ApplicationError_1.ApplicationError('Permissões insuficientes', 403, 'FORBIDDEN');
            }
            if (!allowedRoles.includes(user.role)) {
                throw new ApplicationError_1.ApplicationError('Permissões insuficientes', 403, 'FORBIDDEN');
            }
            next();
        }
        catch (error) {
            if (error instanceof ApplicationError_1.ApplicationError) {
                res.status(error.statusCode).json({
                    error: {
                        message: error.message,
                        code: error.errorCode
                    }
                });
            }
            else {
                res.status(500).json({
                    error: {
                        message: 'Erro interno do servidor',
                        code: 'INTERNAL_SERVER_ERROR'
                    }
                });
            }
        }
    };
};
exports.rbacMiddleware = rbacMiddleware;
//# sourceMappingURL=rbacMiddleware.js.map