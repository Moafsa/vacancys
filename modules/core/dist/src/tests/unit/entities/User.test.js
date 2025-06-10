"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("@/domain/entities/User");
const UserRole_1 = require("@/domain/entities/UserRole");
const UserStatus_1 = require("@/domain/entities/UserStatus");
describe('User', () => {
    it('should create a user with all fields', () => {
        const user = new User_1.User({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            isEmailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        expect(user.id).toBe('1');
        expect(user.name).toBe('John Doe');
        expect(user.email).toBe('john@example.com');
        expect(user.password).toBe('hashedPassword');
        expect(user.role).toBe(UserRole_1.UserRole.USER);
        expect(user.status).toBe(UserStatus_1.UserStatus.ACTIVE);
        expect(user.isEmailVerified).toBe(true);
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.updatedAt).toBeInstanceOf(Date);
    });
    it('should return a JSON object without password', () => {
        const now = new Date();
        const user = new User_1.User({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashedPassword',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            isEmailVerified: true,
            createdAt: now,
            updatedAt: now
        });
        const json = user.toJSON();
        expect(json).toEqual({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            isEmailVerified: true,
            createdAt: now,
            updatedAt: now
        });
        expect(Object.keys(json)).not.toContain('password');
    });
});
//# sourceMappingURL=User.test.js.map