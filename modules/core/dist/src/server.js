"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = require("express-rate-limit");
const path_1 = __importDefault(require("path"));
const http_1 = require("./http");
const hooks_1 = require("./hooks");
console.log('=== [DEBUG] Iniciando server.ts ===');
const app = (0, express_1.default)();
console.log('=== [DEBUG] Express instanciado ===');
app.use(express_1.default.json());
console.log('=== [DEBUG] Middlewares básicos carregados ===');
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 1000
});
app.use(limiter);
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
const staticPath = path_1.default.join(__dirname, '..', 'public');
console.log('Serving static files from:', staticPath);
app.use(express_1.default.static(staticPath));
(0, http_1.registerCoreHttp)(app);
console.log('=== [DEBUG] Rotas do core registradas ===');
(0, hooks_1.registerCoreHooks)();
console.log('=== [DEBUG] Hooks do core registrados ===');
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.get('/api/status', (req, res) => {
    const startTime = process.hrtime();
    const status = {
        status: 'online',
        responseTime: process.hrtime(startTime)[1] / 1000000,
        endpoints: [
            '/health',
            '/api/status',
            '/auth/register',
            '/auth/login',
            '/auth/verify-email',
            '/auth/reset-password/request',
            '/auth/reset-password/confirm'
        ],
        requests: 0,
        timestamp: new Date().toISOString()
    };
    console.log('Status endpoint called, responding with:', status);
    res.json(status);
});
app.get('/', (req, res) => {
    res.redirect('/dashboard-teste.html');
});
app.use((err, req, res, _next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    console.log(`Try accessing the dashboard at http://${HOST}:${PORT}/dashboard-teste.html`);
});
console.log('=== [DEBUG] app.listen chamado ===');
//# sourceMappingURL=server.js.map