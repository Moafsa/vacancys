"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = require("../../application/services/AuthService");
class AuthController {
    constructor() {
        this.authService = new AuthService_1.AuthService();
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            const result = await this.authService.login(email, password);
            console.log('AuthController - Login result:', result);
            res.status(200).json({ success: true, token: result.token, user: result.user });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Invalid credentials') {
                res.status(401).json({ error: error.message });
                return;
            }
            if (error instanceof Error && error.message === 'User is blocked') {
                res.status(403).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=AuthController.js.map