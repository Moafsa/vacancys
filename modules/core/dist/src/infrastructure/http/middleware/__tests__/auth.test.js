"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../auth");
const UserRole_1 = require("../../../../domain/enums/UserRole");
jest.mock('../../../repositories/UserRepository');
describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let mockUserRepository;
    beforeEach(() => {
        mockReq = {
            headers: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        mockUserRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            list: jest.fn().mockResolvedValue({ users: [], total: 0 }),
        };
        process.env.JWT_SECRET = 'test-secret';
    });
    describe('createValidateToken', () => {
        it('should validate token and set user in request', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
            };
            const token = jsonwebtoken_1.default.sign({ userId: mockUser.id, email: mockUser.email, role: mockUser.role }, process.env.JWT_SECRET);
            mockReq.headers = {
                authorization: `Bearer ${token}`,
            };
            mockUserRepository.findById.mockResolvedValue(mockUser);
            const validateTokenMiddleware = (0, auth_1.createValidateToken)(mockUserRepository);
            await validateTokenMiddleware(mockReq, mockRes, mockNext);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user).toEqual({
                userId: mockUser.id,
                email: mockUser.email,
                role: mockUser.role,
            });
        });
        it('should return 401 if no authorization header', async () => {
            const validateTokenMiddleware = (0, auth_1.createValidateToken)(mockUserRepository);
            await validateTokenMiddleware(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Authentication token is required',
            });
        });
        it('should return 401 if invalid token format', async () => {
            mockReq.headers = {
                authorization: 'InvalidToken',
            };
            const validateTokenMiddleware = (0, auth_1.createValidateToken)(mockUserRepository);
            await validateTokenMiddleware(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid token format',
            });
        });
        it('should return 401 if user not found', async () => {
            const token = jsonwebtoken_1.default.sign({ userId: 'invalid-user', email: 'test@example.com', role: UserRole_1.UserRole.USER }, process.env.JWT_SECRET);
            mockReq.headers = {
                authorization: `Bearer ${token}`,
            };
            mockUserRepository.findById.mockResolvedValue(null);
            const validateTokenMiddleware = (0, auth_1.createValidateToken)(mockUserRepository);
            await validateTokenMiddleware(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid user',
            });
        });
        it('should return 500 if JWT_SECRET is not configured', async () => {
            const token = jsonwebtoken_1.default.sign({ userId: 'user-123', email: 'test@example.com', role: UserRole_1.UserRole.USER }, 'some-secret');
            mockReq.headers = {
                authorization: `Bearer ${token}`,
            };
            process.env.JWT_SECRET = '';
            const validateTokenMiddleware = (0, auth_1.createValidateToken)(mockUserRepository);
            await validateTokenMiddleware(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error',
            });
            process.env.JWT_SECRET = 'test-secret';
        });
        it('should return 401 if token is invalid', async () => {
            mockReq.headers = {
                authorization: 'Bearer invalid.token.here',
            };
            const validateTokenMiddleware = (0, auth_1.createValidateToken)(mockUserRepository);
            await validateTokenMiddleware(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid authentication token',
            });
        });
        it('should return 500 if repository throws error', async () => {
            const token = jsonwebtoken_1.default.sign({ userId: 'user-123', email: 'test@example.com', role: UserRole_1.UserRole.USER }, process.env.JWT_SECRET);
            mockReq.headers = {
                authorization: `Bearer ${token}`,
            };
            mockUserRepository.findById.mockRejectedValue(new Error('Database error'));
            const validateTokenMiddleware = (0, auth_1.createValidateToken)(mockUserRepository);
            await validateTokenMiddleware(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error',
            });
        });
    });
    describe('requireRole', () => {
        it('should allow access if user has required role', () => {
            mockReq.user = {
                userId: 'user-123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.ADMIN,
            };
            const roleMiddleware = (0, auth_1.requireRole)([UserRole_1.UserRole.ADMIN]);
            roleMiddleware(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });
        it('should return 401 if no user in request', () => {
            const roleMiddleware = (0, auth_1.requireRole)([UserRole_1.UserRole.ADMIN]);
            roleMiddleware(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Authentication required',
            });
        });
        it('should return 403 if user lacks required role', () => {
            mockReq.user = {
                userId: 'user-123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
            };
            const roleMiddleware = (0, auth_1.requireRole)([UserRole_1.UserRole.ADMIN]);
            roleMiddleware(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Insufficient permissions',
            });
        });
        it('should allow access if user has one of multiple required roles', () => {
            mockReq.user = {
                userId: 'user-123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.ADMIN,
            };
            const roleMiddleware = (0, auth_1.requireRole)([UserRole_1.UserRole.USER, UserRole_1.UserRole.ADMIN]);
            roleMiddleware(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });
        it('should handle empty roles array', () => {
            mockReq.user = {
                userId: 'user-123',
                email: 'test@example.com',
                role: UserRole_1.UserRole.USER,
            };
            const roleMiddleware = (0, auth_1.requireRole)([]);
            roleMiddleware(mockReq, mockRes, mockNext);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Insufficient permissions',
            });
        });
    });
});
//# sourceMappingURL=auth.test.js.map