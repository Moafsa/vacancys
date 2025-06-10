"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestUser = createTestUser;
exports.getTestToken = getTestToken;
exports.cleanupTestUser = cleanupTestUser;
const User_1 = require("../../../domain/entities/User");
const tsyringe_1 = require("tsyringe");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
async function createTestUser() {
    const userRepository = tsyringe_1.container.resolve('IUserRepository');
    const testUser = User_1.User.create({
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        name: 'Test User',
        role: 'USER'
    });
    await userRepository.create(testUser);
    return testUser;
}
async function getTestToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, config_1.config.jwt.secret, { expiresIn: '1h' });
}
async function cleanupTestUser(userId) {
    const userRepository = tsyringe_1.container.resolve('IUserRepository');
    await userRepository.delete(userId);
}
//# sourceMappingURL=auth.js.map