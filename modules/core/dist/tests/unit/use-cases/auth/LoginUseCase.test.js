"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const LoginUseCase_1 = require("../../../../application/use-cases/auth/LoginUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
(0, globals_1.describe)('LoginUseCase', () => {
    let loginUseCase;
    let authService;
    let userRepository;
    let passwordHashService;
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
        authService = {
            validateCredentials: globals_1.jest.fn(),
            generateToken: globals_1.jest.fn()
        };
        userRepository = {
            findByEmail: globals_1.jest.fn(),
            create: globals_1.jest.fn(),
            findById: globals_1.jest.fn(),
            update: globals_1.jest.fn(),
            delete: globals_1.jest.fn(),
            findAll: globals_1.jest.fn(),
            countUsers: globals_1.jest.fn()
        };
        passwordHashService = {
            hash: globals_1.jest.fn(),
            compare: globals_1.jest.fn()
        };
        jwtService = {
            generateToken: globals_1.jest.fn(),
            verifyToken: globals_1.jest.fn()
        };
        loginUseCase = new LoginUseCase_1.LoginUseCase(authService, userRepository);
    });
    (0, globals_1.it)('should successfully login with valid credentials', async () => {
        const email = 'test@example.com';
        const password = 'validPassword123!';
        const mockUser = {
            id: '1',
            email,
            password: 'hashedPassword',
            status: UserStatus_1.UserStatus.ACTIVE
        };
        const mockToken = 'valid.jwt.token';
        userRepository.findByEmail.mockResolvedValue(mockUser);
        authService.validateCredentials.mockResolvedValue(true);
        authService.generateToken.mockResolvedValue(mockToken);
        const result = await loginUseCase.execute({ email, password });
        (0, globals_1.expect)(result).toEqual({
            token: mockToken,
            user: {
                id: mockUser.id,
                email: mockUser.email,
                status: mockUser.status
            }
        });
        (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(email);
        (0, globals_1.expect)(authService.validateCredentials).toHaveBeenCalledWith(email, password);
        (0, globals_1.expect)(authService.generateToken).toHaveBeenCalledWith(mockUser);
    });
    (0, globals_1.it)('should throw error when user is not found', async () => {
        const email = 'nonexistent@example.com';
        const password = 'password123';
        userRepository.findByEmail.mockResolvedValue(null);
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid credentials', 'INVALID_CREDENTIALS', 401));
    });
    (0, globals_1.it)('should throw error when credentials are invalid', async () => {
        const email = 'test@example.com';
        const password = 'wrongPassword';
        const mockUser = {
            id: '1',
            email,
            password: 'hashedPassword',
            status: UserStatus_1.UserStatus.ACTIVE
        };
        userRepository.findByEmail.mockResolvedValue(mockUser);
        authService.validateCredentials.mockResolvedValue(false);
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid credentials', 'INVALID_CREDENTIALS', 401));
    });
    (0, globals_1.it)('should throw error when user account is inactive', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const mockUser = {
            id: '1',
            email,
            password: 'hashedPassword',
            status: UserStatus_1.UserStatus.INACTIVE
        };
        userRepository.findByEmail.mockResolvedValue(mockUser);
        authService.validateCredentials.mockResolvedValue(true);
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User account is not active', 'USER_INACTIVE', 403));
    });
    (0, globals_1.it)('should throw error when user account is pending', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const mockUser = {
            id: '1',
            email,
            password: 'hashedPassword',
            status: UserStatus_1.UserStatus.PENDING
        };
        userRepository.findByEmail.mockResolvedValue(mockUser);
        authService.validateCredentials.mockResolvedValue(true);
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('User account is pending verification', 'USER_PENDING', 403));
    });
    (0, globals_1.it)('should throw error when token generation fails', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const mockUser = {
            id: '1',
            email,
            password: 'hashedPassword',
            status: UserStatus_1.UserStatus.ACTIVE
        };
        userRepository.findByEmail.mockResolvedValue(mockUser);
        authService.validateCredentials.mockResolvedValue(true);
        authService.generateToken.mockRejectedValue(new Error('Token generation failed'));
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error generating token', 'TOKEN_GENERATION_ERROR', 500));
    });
});
