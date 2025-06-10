"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = require("./authRoutes");
const userRoutes_1 = require("./userRoutes");
const emailRoutes_1 = require("./emailRoutes");
const profileRoutes_1 = require("./profileRoutes");
const AuthService_1 = require("../../../application/services/AuthService");
const UserService_1 = require("../../../application/services/UserService");
const EmailService_1 = require("../../../application/services/EmailService");
const UserProfileService_1 = require("../../../application/services/UserProfileService");
const UserRepository_1 = require("../../repositories/UserRepository");
const UserProfileRepository_1 = require("../../repositories/UserProfileRepository");
const EventEmitter_1 = require("../../messaging/EventEmitter");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const v1_1 = __importDefault(require("./v1"));
const metrics_1 = __importDefault(require("./admin/metrics"));
const activities_1 = __importDefault(require("./admin/activities"));
const router = (0, express_1.Router)();
const userRepository = new UserRepository_1.UserRepository();
const userProfileRepository = new UserProfileRepository_1.UserProfileRepository();
const eventEmitter = new EventEmitter_1.EventEmitter();
const authService = new AuthService_1.AuthService(userRepository);
const userService = new UserService_1.UserService(userRepository, eventEmitter);
const emailService = new EmailService_1.EmailService(userRepository);
const userProfileService = new UserProfileService_1.UserProfileService(userProfileRepository, userRepository);
const authRoutes = new authRoutes_1.AuthRoutes(authService, userRepository);
const emailRoutes = new emailRoutes_1.EmailRoutes(emailService, userRepository);
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vacancy Core API',
            version: '1.0.0',
            description: 'API documentation for the Vacancy Core module',
            contact: {
                name: 'API Support',
                email: 'support@vacancy.com'
            }
        },
        servers: [
            {
                url: '/api',
                description: 'API server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [
        './src/infrastructure/http/routes/v1/**/*.ts',
        './src/infrastructure/http/routes/v1/**/*.js'
    ]
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
router.use('/docs', swagger_ui_express_1.default.serve);
router.get('/docs', swagger_ui_express_1.default.setup(swaggerSpec));
router.use('/v1', v1_1.default);
router.use('/auth', authRoutes.getRouter());
router.use('/users', (0, userRoutes_1.userRoutes)(userService, userRepository));
router.use('/email', emailRoutes.getRouter());
router.use('/profiles', (0, profileRoutes_1.profileRoutes)(userProfileService, userRepository, userProfileRepository));
router.use('/admin', [metrics_1.default, activities_1.default]);
router.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
});
exports.default = router;
//# sourceMappingURL=index.js.map