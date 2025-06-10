"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const LoginUseCase_1 = require("../../../../application/use-cases/auth/LoginUseCase");
const ApplicationError_1 = require("../../../../application/errors/ApplicationError");
const UserRole_1 = require("../../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../../domain/entities/UserStatus");
(0, globals_1.describe)('LoginUseCase', () => {
    let loginUseCase;
    let userRepository;
    let hashService;
    let jwtTokenService;
    const mockUser = new User_1.UserEntity('1', 'John Doe', 'john@example.com', 'hashedPassword123', UserRole_1.UserRole.USER, UserStatus_1.UserStatus.ACTIVE, new Date(), new Date());
    (0, globals_1.beforeEach)(() => {
        userRepository = {
            findByEmail: globals_1.jest.fn(),
            create: globals_1.jest.fn(),
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
        jwtTokenService = {
            generateToken: globals_1.jest.fn(),
            verifyToken: globals_1.jest.fn(),
            revokeToken: globals_1.jest.fn()
        };
        loginUseCase = new LoginUseCase_1.LoginUseCase(userRepository, hashService, jwtTokenService);
    });
    (0, globals_1.it)('should successfully login with valid credentials', async () => {
        const email = 'test@example.com';
        const password = 'validPassword123!';
        const mockToken = 'valid.jwt.token';
        userRepository.findByEmail.mockResolvedValue(mockUser);
        hashService.compare.mockResolvedValue(true);
        jwtTokenService.generateToken.mockReturnValue(mockToken);
        const result = await loginUseCase.execute({ email, password });
        (0, globals_1.expect)(result).toEqual({
            token: mockToken,
            user: {
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockUser.role
            }
        });
        (0, globals_1.expect)(userRepository.findByEmail).toHaveBeenCalledWith(email);
        (0, globals_1.expect)(hashService.compare).toHaveBeenCalledWith(password, mockUser.password);
        (0, globals_1.expect)(jwtTokenService.generateToken).toHaveBeenCalledWith({
            userId: mockUser.id,
            email: mockUser.email,
            role: mockUser.role
        });
    });
    (0, globals_1.it)('should throw error when user is not found', async () => {
        const email = 'nonexistent@example.com';
        const password = 'password123';
        userRepository.findByEmail.mockResolvedValue(null);
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('INVALID_CREDENTIALS', 'Credenciais inválidas', 401));
    });
    (0, globals_1.it)('should throw error when credentials are invalid', async () => {
        const email = 'test@example.com';
        const password = 'wrongPassword';
        userRepository.findByEmail.mockResolvedValue(mockUser);
        hashService.compare.mockResolvedValue(false);
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('INVALID_CREDENTIALS', 'Credenciais inválidas', 401));
    });
    (0, globals_1.it)('should throw error when user account is inactive', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const inactiveUser = new User_1.UserEntity('1', 'John Doe', email, 'hashedPassword', UserRole_1.UserRole.USER, UserStatus_1.UserStatus.INACTIVE, new Date(), new Date());
        userRepository.findByEmail.mockResolvedValue(inactiveUser);
        hashService.compare.mockResolvedValue(true);
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('INACTIVE_USER', 'Usuário inativo', 403));
    });
    (0, globals_1.it)('should throw error when user account is pending', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const pendingUser = new User_1.UserEntity('1', 'John Doe', email, 'hashedPassword', UserRole_1.UserRole.USER, UserStatus_1.UserStatus.PENDING, new Date(), new Date());
        userRepository.findByEmail.mockResolvedValue(pendingUser);
        hashService.compare.mockResolvedValue(true);
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('USER_PENDING', 'Usuário pendente de verificação', 403));
    });
    (0, globals_1.it)('should throw error when token generation fails', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        userRepository.findByEmail.mockResolvedValue(mockUser);
        hashService.compare.mockResolvedValue(true);
        jwtTokenService.generateToken.mockImplementation(() => {
            throw new Error('Token generation failed');
        });
        await (0, globals_1.expect)(loginUseCase.execute({ email, password }))
            .rejects
            .toThrow(new ApplicationError_1.ApplicationError('TOKEN_GENERATION_ERROR', 'Erro ao gerar token', 500));
    });
});
//# sourceMappingURL=LoginUseCase.test.js.map