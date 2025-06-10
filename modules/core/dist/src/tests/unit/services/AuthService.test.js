"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const AuthService_1 = require("../../../application/services/AuthService");
const ApplicationError_1 = require("../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
(0, globals_1.describe)('AuthService', () => {
    let authService;
    let userRepository;
    let hashService;
    let jwtService;
    const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword123',
        role: UserRole_1.UserRole.USER,
        status: UserStatus_1.UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        toJSON: () => ({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: mockUser.createdAt,
            updatedAt: mockUser.updatedAt
        })
    };
    (0, globals_1.beforeEach)(() => {
        userRepository = {
            create: globals_1.jest.fn(),
            findByEmail: globals_1.jest.fn(),
            findById: globals_1.jest.fn(),
            update: globals_1.jest.fn(),
            delete: globals_1.jest.fn(),
            findAll: globals_1.jest.fn(),
            countUsers: globals_1.jest.fn()
        };
        hashService = {
            hash: globals_1.jest.fn(),
            compare: globals_1.jest.fn()
        };
        jwtService = {
            generateToken: globals_1.jest.fn(),
            verifyToken: globals_1.jest.fn(),
            revokeToken: globals_1.jest.fn()
        };
        authService = new AuthService_1.AuthService(userRepository, hashService, jwtService);
    });
    (0, globals_1.describe)('login', () => {
        const email = 'john@example.com';
        const password = 'password123';
        const mockToken = 'mock.jwt.token';
        (0, globals_1.it)('deve fazer login com sucesso', async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);
            hashService.compare.mockResolvedValue(true);
            jwtService.generateToken.mockResolvedValue(mockToken);
            const result = await authService.login(email, password);
            (0, globals_1.expect)(result).toEqual({
                user: mockUser.toJSON(),
                token: mockToken
            });
            (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(email);
            (0, globals_1.expect)(hashService.compare).toHaveBeenCalledWith(password, mockUser.password);
            (0, globals_1.expect)(jwtService.generateToken).toHaveBeenCalledWith({
                userId: mockUser.id,
                email: mockUser.email,
                role: mockUser.role,
                status: mockUser.status
            });
        });
        (0, globals_1.it)('deve lançar erro quando o usuário não existe', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            await (0, globals_1.expect)(authService.login(email, password)).rejects.toThrow(new ApplicationError_1.ApplicationError('INVALID_CREDENTIALS', 'Invalid email or password'));
            (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(email);
            (0, globals_1.expect)(hashService.compare).not.toHaveBeenCalled();
            (0, globals_1.expect)(jwtService.generateToken).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('deve lançar erro quando a senha está incorreta', async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);
            hashService.compare.mockResolvedValue(false);
            await (0, globals_1.expect)(authService.login(email, password)).rejects.toThrow(new ApplicationError_1.ApplicationError('INVALID_CREDENTIALS', 'Invalid email or password'));
            (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(email);
            (0, globals_1.expect)(hashService.compare).toHaveBeenCalledWith(password, mockUser.password);
            (0, globals_1.expect)(jwtService.generateToken).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('deve lançar erro quando o usuário está inativo', async () => {
            const inactiveUser = {
                ...mockUser,
                status: UserStatus_1.UserStatus.INACTIVE,
                toJSON: () => ({
                    ...mockUser.toJSON(),
                    status: UserStatus_1.UserStatus.INACTIVE
                })
            };
            userRepository.findByEmail.mockResolvedValue(inactiveUser);
            hashService.compare.mockResolvedValue(true);
            await (0, globals_1.expect)(authService.login(email, password)).rejects.toThrow(new ApplicationError_1.ApplicationError('INACTIVE_USER', 'User is inactive'));
            (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(email);
            (0, globals_1.expect)(hashService.compare).toHaveBeenCalledWith(password, inactiveUser.password);
            (0, globals_1.expect)(jwtService.generateToken).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=AuthService.test.js.map