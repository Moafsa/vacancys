"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const UserStatus_1 = require("../../domain/enums/UserStatus");
class LoginUseCase {
    constructor(userRepository, sessionService, hashService, tokenService) {
        this.userRepository = userRepository;
        this.sessionService = sessionService;
        this.hashService = hashService;
        this.tokenService = tokenService;
    }
    async execute(request) {
        const { email, password } = request;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (user.status === UserStatus_1.UserStatus.INACTIVE) {
            throw new Error('User account is inactive');
        }
        if (!user.isEmailVerified) {
            throw new Error('Email not verified');
        }
        const isPasswordValid = await this.hashService.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const token = await this.tokenService.generate({
            sub: user.id,
            email: user.email,
            role: user.role
        });
        const session = await this.sessionService.createSession(user, token);
        return {
            session,
            token
        };
    }
}
exports.LoginUseCase = LoginUseCase;
//# sourceMappingURL=LoginUseCase.js.map