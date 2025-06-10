"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JwtTokenServiceImpl_1 = require("../../../infrastructure/services/JwtTokenServiceImpl");
const ApplicationError_1 = require("../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('jsonwebtoken');
describe('JwtTokenServiceImpl', () => {
    let jwtTokenService;
    let mockPayload;
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '1h';
        process.env.JWT_REFRESH_EXPIRES_IN = '7d';
        jwtTokenService = new JwtTokenServiceImpl_1.JwtTokenServiceImpl();
        mockPayload = {
            id: '123',
            email: 'test@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            isEmailVerified: true
        };
        jest.clearAllMocks();
    });
    describe('generateToken', () => {
        it('deve gerar um token JWT válido', async () => {
            const mockToken = 'mock-token';
            jsonwebtoken_1.default.sign.mockReturnValue(mockToken);
            const token = await jwtTokenService.generateToken(mockPayload);
            expect(token).toBe(mockToken);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith(mockPayload, 'test-secret', { expiresIn: '1h' });
        });
        it('deve lançar um erro se a geração do token falhar', async () => {
            jsonwebtoken_1.default.sign.mockImplementation(() => {
                throw new Error('Token generation failed');
            });
            await expect(jwtTokenService.generateToken(mockPayload))
                .rejects
                .toThrow(ApplicationError_1.ApplicationError);
        });
    });
    describe('verifyToken', () => {
        it('deve verificar um token JWT válido', async () => {
            const mockToken = 'valid-token';
            jsonwebtoken_1.default.verify.mockReturnValue(mockPayload);
            const result = await jwtTokenService.verifyToken(mockToken);
            expect(result).toEqual(mockPayload);
            expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith(mockToken, 'test-secret');
        });
        it('deve lançar um erro se o token estiver expirado', async () => {
            const mockToken = 'expired-token';
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new jsonwebtoken_1.default.TokenExpiredError('Token expired', new Date());
            });
            await expect(jwtTokenService.verifyToken(mockToken))
                .rejects
                .toThrow(new ApplicationError_1.ApplicationError('Token expirado', 'TOKEN_EXPIRED', 401));
        });
        it('deve lançar um erro se o token for inválido', async () => {
            const mockToken = 'invalid-token';
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            await expect(jwtTokenService.verifyToken(mockToken))
                .rejects
                .toThrow(new ApplicationError_1.ApplicationError('Token inválido', 'INVALID_TOKEN', 401));
        });
    });
    describe('revokeToken', () => {
        it('deve revogar um token JWT válido', async () => {
            const mockToken = 'valid-token';
            jsonwebtoken_1.default.verify.mockReturnValue(mockPayload);
            await expect(jwtTokenService.revokeToken(mockToken)).resolves.not.toThrow();
            expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith(mockToken, 'test-secret');
        });
        it('deve lançar um erro se o token estiver expirado', async () => {
            const mockToken = 'expired-token';
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new jsonwebtoken_1.default.TokenExpiredError('Token expired', new Date());
            });
            await expect(jwtTokenService.revokeToken(mockToken))
                .rejects
                .toThrow(new ApplicationError_1.ApplicationError('Token expirado', 'TOKEN_EXPIRED', 401));
        });
        it('deve lançar um erro se o token for inválido', async () => {
            const mockToken = 'invalid-token';
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            await expect(jwtTokenService.revokeToken(mockToken))
                .rejects
                .toThrow(new ApplicationError_1.ApplicationError('Token inválido', 'INVALID_TOKEN', 401));
        });
    });
});
//# sourceMappingURL=JwtTokenServiceImpl.test.js.map