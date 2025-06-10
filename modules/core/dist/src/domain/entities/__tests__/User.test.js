"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../User");
const UserRole_1 = require("../../enums/UserRole");
const UserStatus_1 = require("../../enums/UserStatus");
describe('User', () => {
    const mockUserData = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole_1.UserRole.USER,
        status: UserStatus_1.UserStatus.ACTIVE,
        isEmailVerified: false,
        lastLoginAt: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    };
    let user;
    beforeEach(() => {
        user = new User_1.User(mockUserData);
    });
    describe('constructor', () => {
        it('should create a user instance with all properties', () => {
            expect(user).toEqual(expect.objectContaining(mockUserData));
        });
    });
    describe('verifyEmail', () => {
        it('should mark email as verified', () => {
            user.verifyEmail();
            expect(user.isEmailVerified).toBe(true);
        });
    });
    describe('updateLastLogin', () => {
        it('should update lastLoginAt to current time', () => {
            const beforeDate = new Date();
            user.updateLastLogin();
            const afterDate = new Date();
            expect(user.lastLoginAt).toBeInstanceOf(Date);
            expect(user.lastLoginAt.getTime()).toBeGreaterThanOrEqual(beforeDate.getTime());
            expect(user.lastLoginAt.getTime()).toBeLessThanOrEqual(afterDate.getTime());
        });
    });
    describe('toJSON', () => {
        it('should return user data without sensitive information', () => {
            const json = user.toJSON();
            expect(json).toHaveProperty('id', user.id);
            expect(json).toHaveProperty('name', user.name);
            expect(json).toHaveProperty('email', user.email);
            expect(json).toHaveProperty('role', user.role);
            expect(json).toHaveProperty('status', user.status);
            expect(json).toHaveProperty('isEmailVerified', user.isEmailVerified);
            expect(json).toHaveProperty('lastLoginAt', user.lastLoginAt);
            expect(json).toHaveProperty('createdAt', user.createdAt);
            expect(json).toHaveProperty('updatedAt', user.updatedAt);
            expect(json).not.toHaveProperty('password');
        });
    });
});
//# sourceMappingURL=User.test.js.map