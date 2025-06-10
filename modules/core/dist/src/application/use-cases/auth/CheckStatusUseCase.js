"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckStatusUseCase = void 0;
const ApplicationError_1 = require("../../errors/ApplicationError");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
class CheckStatusUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, status) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404);
        }
        const userStatus = UserStatus_1.UserStatus[status];
        return user.status === userStatus;
    }
}
exports.CheckStatusUseCase = CheckStatusUseCase;
//# sourceMappingURL=CheckStatusUseCase.js.map