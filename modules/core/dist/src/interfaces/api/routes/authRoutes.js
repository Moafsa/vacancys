"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const LoginUseCase_1 = require("../../../application/use-cases/auth/LoginUseCase");
const JwtTokenService_1 = require("../../../infrastructure/services/JwtTokenService");
const config_1 = __importDefault(require("../../../config/config"));
function createAuthRouter(userRepository, hashService) {
    const router = (0, express_1.Router)();
    const jwtService = new JwtTokenService_1.JwtTokenService(config_1.default.jwt.secret);
    const loginUseCase = new LoginUseCase_1.LoginUseCase(userRepository, hashService, jwtService);
    const authController = new AuthController_1.AuthController(loginUseCase);
    router.post('/login', (req, res) => authController.login(req, res));
    return router;
}
//# sourceMappingURL=authRoutes.js.map