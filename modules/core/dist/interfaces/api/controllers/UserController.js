"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const ApplicationError_1 = require("../../../application/errors/ApplicationError");
class UserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
    mapUserToResponse(user) {
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
    async createUser(req, res) {
        try {
            const user = await this.createUserUseCase.execute(req.body);
            const userResponse = this.mapUserToResponse(user);
            res.status(201).json(userResponse);
        }
        catch (error) {
            if (error instanceof ApplicationError_1.ApplicationError) {
                res.status(error.statusCode || 400).json({
                    error: {
                        code: error.code,
                        message: error.message,
                        statusCode: error.statusCode
                    }
                });
            }
            else {
                res.status(500).json({
                    error: {
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Erro interno do servidor',
                        statusCode: 500
                    }
                });
            }
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map