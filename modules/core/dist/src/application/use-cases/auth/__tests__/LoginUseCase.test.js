"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginUseCase_1 = require("../LoginUseCase");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
const ApplicationError_1 = require("../../../errors/ApplicationError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
jest.mock('bcryptjs');
describe('LoginUseCase', () => {
    let loginUseCase;
    let userRepository;
    let tokenService;
    let logger;
    const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole_1.UserRole.USER,
        status: UserStatus_1.UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        toJSON: () => ({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    };
    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            countUsers: jest.fn()
        };
        tokenService = {
            generateToken: jest.fn(),
            verifyToken: jest.fn(),
            revokeToken: jest.fn()
        };
        logger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            logger: {}
        };
        loginUseCase = new LoginUseCase_1.LoginUseCase(userRepository, tokenService, logger);
    });
    it('should successfully login with valid credentials', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
        };
        userRepository.findByEmail.mockResolvedValue(mockUser);
        bcryptjs_1.default.compare.mockResolvedValue(true);
        tokenService.generateToken.mockResolvedValue('mockToken');
        const result = await loginUseCase.execute(credentials);
        expect(result).toEqual({
            token: 'mockToken',
            user: {
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockUser.role
            }
        });
        expect(userRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
        expect(bcryptjs_1.default.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
        expect(tokenService.generateToken).toHaveBeenCalledWith({
            userId: mockUser.id,
            email: mockUser.email,
            role: mockUser.role,
            status: mockUser.status
        });
        expect(logger.info).toHaveBeenCalledWith('Login realizado com sucesso', { userId: mockUser.id });
    });
    it('should throw error when user not found', async () => {
        const credentials = {
            email: 'nonexistent@example.com',
            password: 'password123'
        };
        userRepository.findByEmail.mockResolvedValue(null);
        await expect(loginUseCase.execute(credentials)).rejects.toThrow(new ApplicationError_1.ApplicationError('INVALID_CREDENTIALS', 'Email ou senha inválidos', 401));
        expect(logger.warn).toHaveBeenCalledWith('Tentativa de login com email inválido', { email: credentials.email });
    });
    it('should throw error when user is inactive', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
        };
        const inactiveUser = { ...mockUser, status: UserStatus_1.UserStatus.INACTIVE };
        userRepository.findByEmail.mockResolvedValue(inactiveUser);
        await expect(loginUseCase.execute(credentials)).rejects.toThrow(new ApplicationError_1.ApplicationError('USER_INACTIVE', 'Usuário está inativo', 401));
        expect(logger.warn).toHaveBeenCalledWith('Tentativa de login com usuário inativo', { userId: inactiveUser.id });
    });
    it('should throw error when user is pending', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
        };
        const pendingUser = { ...mockUser, status: UserStatus_1.UserStatus.PENDING };
        userRepository.findByEmail.mockResolvedValue(pendingUser);
        await expect(loginUseCase.execute(credentials)).rejects.toThrow(new ApplicationError_1.ApplicationError('USER_PENDING', 'Usuário está pendente de aprovação', 401));
        expect(logger.warn).toHaveBeenCalledWith('Tentativa de login com usuário pendente', { userId: pendingUser.id });
    });
    it('should throw error when user is blocked', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
        };
        const blockedUser = { ...mockUser, status: UserStatus_1.UserStatus.BLOCKED };
        userRepository.findByEmail.mockResolvedValue(blockedUser);
        await expect(loginUseCase.execute(credentials)).rejects.toThrow(new ApplicationError_1.ApplicationError('USER_BLOCKED', 'Usuário está bloqueado', 401));
        expect(logger.warn).toHaveBeenCalledWith('Tentativa de login com usuário bloqueado', { userId: blockedUser.id });
    });
    it('should throw error when password is invalid', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'wrongpassword'
        };
        userRepository.findByEmail.mockResolvedValue(mockUser);
        bcryptjs_1.default.compare.mockResolvedValue(false);
        await expect(loginUseCase.execute(credentials)).rejects.toThrow(new ApplicationError_1.ApplicationError('INVALID_CREDENTIALS', 'Email ou senha inválidos', 401));
        expect(logger.warn).toHaveBeenCalledWith('Tentativa de login com senha inválida', { userId: mockUser.id });
    });
    it('should throw error when token generation fails', async () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
        };
        userRepository.findByEmail.mockResolvedValue(mockUser);
        bcryptjs_1.default.compare.mockResolvedValue(true);
        tokenService.generateToken.mockRejectedValue(new Error('Token generation failed'));
        await expect(loginUseCase.execute(credentials)).rejects.toThrow(new ApplicationError_1.ApplicationError('LOGIN_ERROR', 'Erro ao realizar login', 500));
        expect(logger.error).toHaveBeenCalledWith('Erro ao realizar login', { error: 'Token generation failed' });
    });
});
//# sourceMappingURL=LoginUseCase.test.js.map