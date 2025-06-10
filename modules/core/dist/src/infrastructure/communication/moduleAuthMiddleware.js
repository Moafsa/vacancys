"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateModuleCommunication = void 0;
const ModuleRegistry_1 = require("./ModuleRegistry");
const logger = {
    error: (message, data) => {
        console.error(`[ERROR] ${message}`, data);
    },
    info: (message, data) => {
        console.info(`[INFO] ${message}`, data);
    }
};
const validateModuleCommunication = (targetModule) => {
    return (req, res, next) => {
        const sourceModule = req.headers['x-source-module'];
        const moduleToken = req.headers['x-module-token'];
        if (!sourceModule || !moduleToken) {
            logger.error('Missing module authentication headers', {
                sourceModule,
                targetModule,
                path: req.path
            });
            return res.status(401).json({
                error: 'Module authentication required',
                details: 'Missing x-source-module or x-module-token header'
            });
        }
        const isValid = ModuleRegistry_1.moduleRegistry.validateCommunication(sourceModule, targetModule, moduleToken);
        if (!isValid) {
            logger.error('Invalid module communication attempt', {
                sourceModule,
                targetModule,
                path: req.path
            });
            return res.status(403).json({
                error: 'Communication not allowed',
                details: `Module ${sourceModule} is not allowed to communicate with ${targetModule}`
            });
        }
        req.sourceModule = sourceModule;
        next();
    };
};
exports.validateModuleCommunication = validateModuleCommunication;
//# sourceMappingURL=moduleAuthMiddleware.js.map