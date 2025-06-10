"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const UserStatus_1 = require("../enums/UserStatus");
class AuthService {
    constructor(userRepository, jwtSecret = process.env.JWT_SECRET || 'default_secret') {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
    }
    async hashPassword(password) {
        return bcryptjs_1.default.hash(password, 10);
    }
    async comparePasswords(password, hashedPassword) {
        return bcryptjs_1.default.compare(password, hashedPassword);
    }
    generateToken(user) {
        return jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, this.jwtSecret, { expiresIn: '24h' });
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await this.hashPassword(data.password);
        const user = new User_1.User({
            id: '',
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            status: UserStatus_1.UserStatus.PENDING,
            isEmailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const createdUser = await this.userRepository.create(user);
        const token = this.generateToken(createdUser);
        const { password, ...userWithoutPassword } = createdUser;
        return {
            user: userWithoutPassword,
            token
        };
    }
    async login(data) {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await this.comparePasswords(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        if (user.status === UserStatus_1.UserStatus.BLOCKED) {
            throw new Error('User is blocked');
        }
        const token = this.generateToken(user);
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
    async verifyEmail(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            const user = await this.userRepository.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            await this.userRepository.update(user.id, {
                isEmailVerified: true,
                status: UserStatus_1.UserStatus.ACTIVE
            });
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return;
        }
        const token = this.generateToken(user);
    }
    async resetPassword(token, newPassword) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            const user = await this.userRepository.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            const hashedPassword = await this.hashPassword(newPassword);
            await this.userRepository.update(user.id, { password: hashedPassword });
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    async validateToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            const user = await this.userRepository.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map