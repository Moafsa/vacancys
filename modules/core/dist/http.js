"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCoreHttp = registerCoreHttp;
const authRoutes_1 = require("./infrastructure/http/routes/authRoutes");
const userRoutes_1 = require("./infrastructure/http/routes/userRoutes");
const UserService_1 = require("./application/services/UserService");
const UserRepository_1 = require("./infrastructure/repositories/UserRepository");
const EventEmitter_1 = require("./infrastructure/messaging/EventEmitter");
function registerCoreHttp(app) {
    const authRoutes = new authRoutes_1.AuthRoutes();
    app.use('/api/v1/auth', authRoutes.getRouter());
    const userRepository = new UserRepository_1.UserRepository();
    const eventEmitter = new EventEmitter_1.EventEmitter();
    const userService = new UserService_1.UserService(userRepository, eventEmitter);
    app.use('/api/v1/users', (0, userRoutes_1.userRoutes)(userService, userRepository));
}
//# sourceMappingURL=http.js.map