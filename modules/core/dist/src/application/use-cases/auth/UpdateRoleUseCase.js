"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoleUseCase = void 0;
const ApplicationError_1 = require("../../errors/ApplicationError");
const Role_1 = require("../../../domain/entities/Role");
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
class UpdateRoleUseCase {
    constructor(userRepository, emailService, config) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.config = config;
    }
    async execute(userId, role) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404);
        }
        if (!Object.values(Role_1.Role).includes(role)) {
            throw new ApplicationError_1.ApplicationError('Invalid role', 'INVALID_ROLE', 400);
        }
        if (user.status !== UserStatus_1.UserStatus.ACTIVE) {
            throw new ApplicationError_1.ApplicationError('User account is not active', 'USER_INACTIVE', 403);
        }
        try {
            const userRole = UserRole_1.UserRole[role];
            const updatedUser = await this.userRepository.update(userId, {
                role: userRole
            });
            await this.sendRoleUpdateEmail(user.email, role);
            return updatedUser;
        }
        catch (error) {
            if (error instanceof ApplicationError_1.ApplicationError) {
                throw error;
            }
            throw new ApplicationError_1.ApplicationError('Error updating user role', 'ROLE_UPDATE_ERROR', 500);
        }
    }
    async sendRoleUpdateEmail(email, role) {
        try {
            const roleDisplay = role === Role_1.Role.ADMIN ? 'Administrator' :
                role === Role_1.Role.RECRUITER ? 'Recruiter' : 'User';
            await this.emailService.sendEmail({
                to: email,
                from: this.config.email.from,
                subject: 'Role Update Confirmation',
                html: `
          <h1>Role Update Confirmation</h1>
          <p>Your role has been updated to ${roleDisplay}.</p>
          <p>If you did not request this change, please contact support immediately.</p>
          <p>Best regards,<br>${this.config.app.name} Team</p>
        `
            });
        }
        catch (error) {
            throw new ApplicationError_1.ApplicationError('Error sending role update email', 'EMAIL_SENDING_ERROR', 500);
        }
    }
}
exports.UpdateRoleUseCase = UpdateRoleUseCase;
//# sourceMappingURL=UpdateRoleUseCase.js.map