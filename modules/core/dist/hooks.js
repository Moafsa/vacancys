"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCoreHooks = registerCoreHooks;
const moduleRegistry_1 = require("./infrastructure/moduleRegistry");
const AuthService_1 = require("./application/services/AuthService");
function registerCoreHooks() {
    moduleRegistry_1.moduleRegistry.registerAction('auth.login', async ({ email, password }) => {
        const authService = new AuthService_1.AuthService();
        return await authService.login(email, password);
    });
    moduleRegistry_1.moduleRegistry.registerFilter('auth.validateToken', async (token) => {
        return token;
    });
}
//# sourceMappingURL=hooks.js.map