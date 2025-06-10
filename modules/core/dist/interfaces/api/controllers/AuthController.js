"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const ApplicationError_1 = require("@shared/errors/ApplicationError");
class AuthController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    error: {
                        message: 'Email and password are required',
                        code: 'MISSING_FIELDS',
                        statusCode: 400
                    }
                });
                return;
            }
            const result = await this.loginUseCase.execute({ email, password });
            res.cookie('auth_token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
                sameSite: 'strict'
            });
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof ApplicationError_1.ApplicationError) {
                res.status(error.statusCode).json(error.toJSON());
            }
            else {
                console.error('Error during login:', error);
                res.status(500).json({
                    error: {
                        message: 'Internal server error',
                        code: 'INTERNAL_ERROR',
                        statusCode: 500
                    }
                });
            }
        }
    }
    async logout(req, res) {
        res.clearCookie('auth_token');
        res.status(200).json({ message: 'Logout successful' });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map