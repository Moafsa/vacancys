"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const RegisterUseCase_1 = require("../../../../application/use-cases/auth/RegisterUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
(0, globals_1.describe)('RegisterUseCase', () => {
    let registerUseCase;
    let userRepository;
    let passwordHashService;
    let jwtService;
    const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword123',
        role: UserRole_1.UserRole.USER,
        status: UserStatus_1.UserStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        toJSON: () => ({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING,
            createdAt: mockUser.createdAt,
            updatedAt: mockUser.updatedAt
        })
    };
    (0, globals_1.beforeEach)(() => {
        userRepository = {
            findByEmail: globals_1.jest.fn(),
            create: globals_1.jest.fn(),
            update: globals_1.jest.fn(),
            delete: globals_1.jest.fn(),
            findById: globals_1.jest.fn(),
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
        registerUseCase = new RegisterUseCase_1.RegisterUseCase(userRepository, passwordHashService);
    });
    (0, globals_1.it)('should successfully register a new user', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'validPassword123!'
        };
        const hashedPassword = 'hashedPassword123';
        const mockUser = {
            id: '1',
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({
                id: '1',
                name: userData.name,
                email: userData.email,
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        };
        userRepository.findByEmail.mockResolvedValue(null);
        passwordHashService.hash.mockResolvedValue(hashedPassword);
        userRepository.create.mockResolvedValue(mockUser);
        const result = await registerUseCase.execute(userData);
        (0, globals_1.expect)(result).toEqual(mockUser.toJSON());
        (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        (0, globals_1.expect)(passwordHashService.hash).toHaveBeenCalledWith(userData.password);
        (0, globals_1.expect)(userRepository.create).toHaveBeenCalledWith({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING
        });
    });
    (0, globals_1.it)('should throw error when email is already registered', async () => {
        const userData = {
            name: 'Test User',
            email: 'existing@example.com',
            password: 'password123'
        };
        userRepository.findByEmail.mockResolvedValue({
            id: '1',
            email: userData.email,
            name: 'Existing User',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            toJSON: () => ({})
        });
        await (0, globals_1.expect)(registerUseCase.execute(userData))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Email already registered', 'EMAIL_ALREADY_REGISTERED', 400));
    });
    (0, globals_1.it)('should throw error when password is invalid', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'weak'
        };
        await (0, globals_1.expect)(registerUseCase.execute(userData))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Invalid password format', 'INVALID_PASSWORD', 400));
    });
    (0, globals_1.it)('should throw error when password hashing fails', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'validPassword123!'
        };
        userRepository.findByEmail.mockResolvedValue(null);
        passwordHashService.hash.mockRejectedValue(new Error('Hashing failed'));
        await (0, globals_1.expect)(registerUseCase.execute(userData))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error hashing password', 'PASSWORD_HASH_ERROR', 500));
    });
    (0, globals_1.it)('should throw error when user creation fails', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'validPassword123!'
        };
        const hashedPassword = 'hashedPassword123';
        userRepository.findByEmail.mockResolvedValue(null);
        passwordHashService.hash.mockResolvedValue(hashedPassword);
        userRepository.create.mockRejectedValue(new Error('Database error'));
        await (0, globals_1.expect)(registerUseCase.execute(userData))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('Error creating user', 'USER_CREATION_ERROR', 500));
    });
});
//# sourceMappingURL=RegisterUseCase.test.js.map