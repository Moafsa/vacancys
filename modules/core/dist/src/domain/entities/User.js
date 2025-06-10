"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
        this.status = data.status;
        this.isEmailVerified = data.isEmailVerified;
        this.lastLoginAt = data.lastLoginAt;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
    verifyEmail() {
        this.isEmailVerified = true;
    }
    updateLastLogin() {
        this.lastLoginAt = new Date();
    }
    toJSON() {
        const { password, ...userWithoutSensitiveData } = this;
        return userWithoutSensitiveData;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map