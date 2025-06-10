"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        module: 'core',
        timestamp: new Date().toISOString()
    });
});
app.get('/api/core/status', (req, res) => {
    res.json({
        status: 'online',
        module: 'core',
        version: '1.0.0',
        environment: 'development',
        timestamp: new Date().toISOString()
    });
});
app.get('/api/admin', (req, res) => {
    res.json({
        message: 'Área de administradores',
        role: 'ADMIN'
    });
});
app.get('/api/users', (req, res) => {
    res.json({
        message: 'Área de usuários',
        role: 'USER'
    });
});
const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`Servidor Express rodando em http://localhost:${PORT}`);
    console.log(`Verifique o status em http://localhost:${PORT}/api/health`);
    console.log(`Verifique o status do core em http://localhost:${PORT}/api/core/status`);
});
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} já está em uso. Tente outra porta.`);
    }
    else {
        console.error('Erro ao iniciar o servidor:', error);
    }
    process.exit(1);
});
//# sourceMappingURL=express-server.js.map