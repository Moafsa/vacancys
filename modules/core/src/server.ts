import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { registerCoreHttp } from './http';
import { registerCoreHooks } from './hooks';
import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';

console.log('=== [DEBUG] Iniciando server.ts ===');

const app = express();
console.log('=== [DEBUG] Express instanciado ===');

// Basic middlewares first
app.use(express.json());
console.log('=== [DEBUG] Middlewares básicos carregados ===');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// CORS with all origins allowed
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

// Security with relaxed settings for development
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use(limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files - must come before API routes
const staticPath = path.join(__dirname, '..', 'public');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

// Auth Routes
// const authRoutes = new AuthRoutes();
// app.use('/api/v1/auth', authRoutes.getRouter());

// Plug core HTTP routes and hooks
const prisma = new PrismaClient();
const eventEmitter = new EventEmitter();
registerCoreHttp(app, prisma, eventEmitter);
console.log('=== [DEBUG] Rotas do core registradas ===');
registerCoreHooks(app);
console.log('=== [DEBUG] Hooks do core registrados ===');

// API Routes
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
    responseTime: process.hrtime(startTime)[1] / 1000000, // Convert to milliseconds
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

// Root route - must come after static files
app.get('/', (req, res) => {
  res.redirect('/dashboard-teste.html');
});

// Error handling middleware - must be last
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
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