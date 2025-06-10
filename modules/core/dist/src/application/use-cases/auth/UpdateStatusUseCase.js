"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusUseCase = void 0;
const ApplicationError_1 = require("../../errors/ApplicationError");
const Status_1 = require("../../../domain/entities/Status");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
class UpdateStatusUseCase {
    constructor(userRepository, emailService, config) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.config = config;
    }
    async execute(userId, status) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ApplicationError_1.ApplicationError('User not found', 'USER_NOT_FOUND', 404);
        }
        if (!Object.values(Status_1.Status).includes(status)) {
            throw new ApplicationError_1.ApplicationError('Invalid status', 'INVALID_STATUS', 400);
        }
        try {
            const userStatus = UserStatus_1.UserStatus[status];
            const updatedUser = await this.userRepository.update(userId, {
                status: userStatus
            });
            await this.sendStatusUpdateEmail(user.email, status);
            return updatedUser;
        }
        catch (error) {
            if (error instanceof ApplicationError_1.ApplicationError) {
                throw error;
            }
            throw new ApplicationError_1.ApplicationError('Error updating user status', 'STATUS_UPDATE_ERROR', 500);
        }
    }
    async sendStatusUpdateEmail(email, status) {
        try {
            const subject = 'Account Status Updated';
            let message = '';
            switch (status) {
                case Status_1.Status.ACTIVE:
                    message = 'Your account has been activated.';
                    break;
                case Status_1.Status.INACTIVE:
                    message = 'Your account has been deactivated.';
                    break;
                case Status_1.Status.BLOCKED:
                    message = 'Your account has been blocked.';
                    break;
                case Status_1.Status.PENDING:
                    message = 'Your account is pending verification.';
                    break;
            }
            await this.emailService.sendEmail({
                to: email,
                from: this.config.email.from,
                subject,
                html: `
          <h1>Account Status Update</h1>
          <p>${message}</p>
          <p>If you believe this was done in error, please contact support.</p>
          <p>Best regards,<br>${this.config.app.name} Team</p>
        `
            });
        }
        catch (error) {
            throw new ApplicationError_1.ApplicationError('Error sending status update email', 'EMAIL_SENDING_ERROR', 500);
        }
    }
}
exports.UpdateStatusUseCase = UpdateStatusUseCase;
//# sourceMappingURL=UpdateStatusUseCase.js.map