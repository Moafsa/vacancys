"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const UserRole_1 = require("../../domain/enums/UserRole");
const UserStatus_1 = require("../../domain/enums/UserStatus");
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository || new UserRepository_1.UserRepository();
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
    }
    getUserRepository() {
        return this.userRepository;
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            isEmailVerified: false,
            lastLoginAt: null
        });
        return user;
    }
    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (user.status !== UserStatus_1.UserStatus.ACTIVE) {
            throw new Error('Account is not active');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const updatedUser = await this.userRepository.update(user.id, { lastLoginAt: new Date() });
        const token = this.generateToken(updatedUser);
        const userWithoutPassword = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
            isEmailVerified: updatedUser.isEmailVerified,
            lastLoginAt: updatedUser.lastLoginAt,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };
        return {
            user: userWithoutPassword,
            token
        };
    }
    async verifyEmail(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.update(user.id, {
            isEmailVerified: true
        });
    }
    async resetPassword(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
    }
    async validateToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            return payload;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        return jsonwebtoken_1.default.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map