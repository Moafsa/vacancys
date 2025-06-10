"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const ApplicationError_1 = require("../../errors/ApplicationError");
const UserRole_1 = require("../../../domain/entities/UserRole");
const UserStatus_1 = require("../../../domain/entities/UserStatus");
class CreateUserUseCase {
    constructor(userRepository, hashService) {
        this.userRepository = userRepository;
        this.hashService = hashService;
    }
    async execute(data) {
        if (data.password.length < 6) {
            throw new ApplicationError_1.ApplicationError('INVALID_PASSWORD', 'Password must be at least 6 characters long');
        }
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ApplicationError_1.ApplicationError('USER_ALREADY_EXISTS', 'User with this email already exists');
        }
        const hashedPassword = await this.hashService.hash(data.password);
        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.PENDING,
            toJSON() {
                const user = this;
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };
            }
        });
        return user;
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
//# sourceMappingURL=CreateUserUseCase.js.map