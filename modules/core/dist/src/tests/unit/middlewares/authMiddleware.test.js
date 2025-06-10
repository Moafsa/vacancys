"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("../../../infrastructure/middlewares/authMiddleware");
const JwtTokenService_1 = require("../../../infrastructure/services/JwtTokenService");
const User_1 = require("../../../domain/entities/User");
const ApplicationError_1 = require("../../../domain/errors/ApplicationError");
jest.mock('../../../infrastructure/services/JwtTokenService');
describe('AuthMiddleware', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();
    let jwtTokenService;
    beforeEach(() => {
        mockRequest = {
            headers: {},
            user: undefined
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
        jwtTokenService = new JwtTokenService_1.JwtTokenService('test-secret');
    });
    it('deve passar com token válido', async () => {
        var _a;
        const mockPayload = {
            id: '123',
            email: 'test@example.com',
            role: User_1.UserRole.FREELANCER,
            status: User_1.UserStatus.ACTIVE
        };
        mockRequest.headers = { authorization: 'Bearer valid-token' };
        jwtTokenService.verifyToken.mockReturnValue(mockPayload);
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockRequest.user).toBeDefined();
        expect((_a = mockRequest.user) === null || _a === void 0 ? void 0 : _a.id).toBe(mockPayload.id);
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });
    it('deve retornar erro 401 quando não houver token', async () => {
        mockRequest.headers = {};
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Token não fornecido'
        });
        expect(nextFunction).not.toHaveBeenCalled();
    });
    it('deve retornar erro 401 quando o token for inválido', async () => {
        mockRequest.headers = { authorization: 'Bearer invalid-token' };
        jwtTokenService.verifyToken.mockImplementation(() => {
            throw new ApplicationError_1.ApplicationError('Token inválido', 401);
        });
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Token inválido'
        });
        expect(nextFunction).not.toHaveBeenCalled();
    });
    it('deve retornar erro 401 quando o token estiver mal formatado', async () => {
        mockRequest.headers = { authorization: 'invalid-format' };
        await (0, authMiddleware_1.authMiddleware)(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Token mal formatado'
        });
        expect(nextFunction).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=authMiddleware.test.js.map