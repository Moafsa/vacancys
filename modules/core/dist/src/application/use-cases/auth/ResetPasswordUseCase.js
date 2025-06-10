"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUseCase = void 0;
const ApplicationError_1 = require("../../errors/ApplicationError");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
class ResetPasswordUseCase {
    constructor(userRepository, passwordHashService, jwtTokenService) {
        this.userRepository = userRepository;
        this.passwordHashService = passwordHashService;
        this.jwtTokenService = jwtTokenService;
    }
    async execute(token, newPassword) {
        try {
            const decodedToken = await this.jwtTokenService.verifyToken(token);
            const user = await this.userRepository.findById(decodedToken.userId);
            if (!user) {
                throw new ApplicationError_1.ApplicationError('USER_NOT_FOUND', 'User not found', 404);
            }
            if (user.status !== UserStatus_1.UserStatus.ACTIVE) {
                throw new ApplicationError_1.ApplicationError('INACTIVE_USER', 'User is inactive', 403);
            }
            const hashedPassword = await this.passwordHashService.hash(newPassword);
            await this.userRepository.update(user.id, { password: hashedPassword });
        }
        catch (error) {
            if (error instanceof ApplicationError_1.ApplicationError) {
                throw error;
            }
            if (error instanceof Error && error.message === 'Invalid token') {
                throw new ApplicationError_1.ApplicationError('INVALID_TOKEN', 'Invalid or expired token', 401);
            }
            if (error instanceof Error && error.message === 'Update failed') {
                throw new ApplicationError_1.ApplicationError('UPDATE_FAILED', 'Failed to update password', 500);
            }
            throw error;
        }
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
//# sourceMappingURL=ResetPasswordUseCase.js.map