"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const CreateUserUseCase_1 = require("../../../application/use-cases/user/CreateUserUseCase");
const BcryptPasswordHashService_1 = require("../../../infrastructure/services/BcryptPasswordHashService");
const PrismaUserRepository_1 = require("../../../infrastructure/database/PrismaUserRepository");
const PrismaClient_1 = require("../../../infrastructure/database/PrismaClient");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
const userRepository = new PrismaUserRepository_1.PrismaUserRepository(PrismaClient_1.prisma);
const passwordHashService = new BcryptPasswordHashService_1.BcryptPasswordHashService();
const createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(userRepository, passwordHashService);
const userController = new UserController_1.UserController(createUserUseCase);
userRouter.post('/', userController.createUser.bind(userController));
//# sourceMappingURL=userRoutes.js.map