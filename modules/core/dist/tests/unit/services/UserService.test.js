"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const UserService_1 = require("../../../application/services/UserService");
const ApplicationError_1 = require("../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
(0, globals_1.describe)('UserService', () => {
    let userService;
    let userRepository;
    let hashService;
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
        userService = new UserService_1.UserService(userRepository, hashService);
    });
    (0, globals_1.describe)('createUser', () => {
        const createUserData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        };
        (0, globals_1.it)('deve criar um usuário com sucesso', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            hashService.hash.mockResolvedValue('hashedPassword123');
            userRepository.create.mockResolvedValue(mockUser);
            const result = await userService.createUser(createUserData);
            (0, globals_1.expect)(result).toEqual(mockUser);
            (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(createUserData.email);
            (0, globals_1.expect)(hashService.hash).toHaveBeenCalledWith(createUserData.password);
            (0, globals_1.expect)(userRepository.create).toHaveBeenCalledWith({
                name: createUserData.name,
                email: createUserData.email,
                password: 'hashedPassword123',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.PENDING,
                toJSON: globals_1.expect.any(Function)
            });
        });
        (0, globals_1.it)('deve lançar erro quando o email já existe', async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);
            await (0, globals_1.expect)(userService.createUser(createUserData)).rejects.toThrow(new ApplicationError_1.ApplicationError('USER_ALREADY_EXISTS', 'User with this email already exists'));
            (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(createUserData.email);
            (0, globals_1.expect)(hashService.hash).not.toHaveBeenCalled();
            (0, globals_1.expect)(userRepository.create).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('deve lançar erro quando a senha é muito curta', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            await (0, globals_1.expect)(userService.createUser({
                ...createUserData,
                password: '12345'
            })).rejects.toThrow(new ApplicationError_1.ApplicationError('INVALID_PASSWORD', 'Password must be at least 6 characters long'));
            (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(createUserData.email);
            (0, globals_1.expect)(hashService.hash).not.toHaveBeenCalled();
            (0, globals_1.expect)(userRepository.create).not.toHaveBeenCalled();
        });
    });
});
