"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rbacMiddleware_1 = require("../../../../infrastructure/middlewares/rbacMiddleware");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const testUtils_1 = require("../../../helpers/testUtils");
describe('RBACMiddleware', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { ...testUtils_1.mockRequest };
        res = { ...testUtils_1.mockResponse };
        next = testUtils_1.mockNext;
        (0, testUtils_1.clearMocks)();
    });
    it('deve permitir acesso quando o usuário tem a role necessária', () => {
        req.user = testUtils_1.mockAdminUser;
        const middleware = (0, rbacMiddleware_1.rbacMiddleware)([UserRole_1.UserRole.ADMIN]);
        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    it('deve negar acesso quando o usuário não tem a role necessária', () => {
        req.user = testUtils_1.mockUser;
        const middleware = (0, rbacMiddleware_1.rbacMiddleware)([UserRole_1.UserRole.ADMIN]);
        middleware(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Acesso negado: permissão insuficiente',
        });
    });
    it('deve negar acesso quando o usuário não está autenticado', () => {
        const middleware = (0, rbacMiddleware_1.rbacMiddleware)([UserRole_1.UserRole.ADMIN]);
        middleware(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Não autorizado: usuário não autenticado',
        });
    });
    it('deve permitir acesso quando o usuário tem uma das roles necessárias', () => {
        req.user = testUtils_1.mockUser;
        const middleware = (0, rbacMiddleware_1.rbacMiddleware)([UserRole_1.UserRole.ADMIN, UserRole_1.UserRole.USER]);
        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    it('deve negar acesso quando nenhuma role é fornecida', () => {
        req.user = testUtils_1.mockUser;
        const middleware = (0, rbacMiddleware_1.rbacMiddleware)([]);
        middleware(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Acesso negado: permissão insuficiente',
        });
    });
});
//# sourceMappingURL=rbacMiddleware.test.js.map