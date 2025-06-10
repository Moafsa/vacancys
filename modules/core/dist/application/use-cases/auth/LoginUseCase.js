"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const ApplicationError_1 = require("../../errors/ApplicationError");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class LoginUseCase {
    constructor(userRepository, tokenService, logger) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.logger = logger;
    }
    async execute(credentials) {
        try {
            const user = await this.userRepository.findByEmail(credentials.email);
            if (!user) {
                this.logger.warn('Tentativa de login com email inválido', { email: credentials.email });
                throw new ApplicationError_1.ApplicationError('INVALID_CREDENTIALS', 'Email ou senha inválidos', 401);
            }
            if (user.status === 'INACTIVE') {
                this.logger.warn('Tentativa de login com usuário inativo', { userId: user.id });
                throw new ApplicationError_1.ApplicationError('USER_INACTIVE', 'Usuário está inativo', 401);
            }
            if (user.status === 'PENDING') {
                this.logger.warn('Tentativa de login com usuário pendente', { userId: user.id });
                throw new ApplicationError_1.ApplicationError('USER_PENDING', 'Usuário está pendente de aprovação', 401);
            }
            if (user.status === 'BLOCKED') {
                this.logger.warn('Tentativa de login com usuário bloqueado', { userId: user.id });
                throw new ApplicationError_1.ApplicationError('USER_BLOCKED', 'Usuário está bloqueado', 401);
            }
            const isValidPassword = await bcryptjs_1.default.compare(credentials.password, user.password);
            if (!isValidPassword) {
                this.logger.warn('Tentativa de login com senha inválida', { userId: user.id });
                throw new ApplicationError_1.ApplicationError('INVALID_CREDENTIALS', 'Email ou senha inválidos', 401);
            }
            const token = await this.tokenService.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
                status: user.status
            });
            this.logger.info('Login realizado com sucesso', { userId: user.id });
            return {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };
        }
        catch (error) {
            if (error instanceof ApplicationError_1.ApplicationError) {
                throw error;
            }
            this.logger.error('Erro ao realizar login', { error: error instanceof Error ? error.message : 'Unknown error' });
            throw new ApplicationError_1.ApplicationError('LOGIN_ERROR', 'Erro ao realizar login', 500);
        }
    }
}
exports.LoginUseCase = LoginUseCase;
//# sourceMappingURL=LoginUseCase.js.map