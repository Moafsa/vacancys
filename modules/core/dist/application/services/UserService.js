"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserStatus_1 = require("../../domain/enums/UserStatus");
class UserService {
    constructor(userRepository, eventEmitter) {
        this.userRepository = userRepository;
        this.eventEmitter = eventEmitter;
    }
    async getProfile(id) {
        const user = await this.userRepository.findById(id);
        return user;
    }
    async updateProfile(id, data) {
        const allowedFields = ['name', 'status', 'isEmailVerified'];
        const sanitizedData = Object.keys(data).reduce((acc, key) => {
            if (allowedFields.includes(key)) {
                acc[key] = data[key];
            }
            return acc;
        }, {});
        const user = await this.userRepository.update(id, sanitizedData);
        await this.eventEmitter.emit('user.updated', { userId: id, updates: sanitizedData });
        return user;
    }
    async updateUserRole(id, role) {
        const user = await this.userRepository.update(id, { role });
        await this.eventEmitter.emit('user.role.updated', { userId: id, role });
        return user;
    }
    async listUsers(page = 1, limit = 10) {
        return this.userRepository.list({ page, limit });
    }
    async deactivateUser(id) {
        const user = await this.userRepository.update(id, { status: UserStatus_1.UserStatus.INACTIVE });
        await this.eventEmitter.emit('user.deactivated', { userId: id });
        return user;
    }
    async activateUser(id) {
        const user = await this.userRepository.update(id, { status: UserStatus_1.UserStatus.ACTIVE });
        await this.eventEmitter.emit('user.activated', { userId: id });
        return user;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map