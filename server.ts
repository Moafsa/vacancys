import express, { Request, Response, NextFunction } from 'express';
import next from 'next';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { registerCoreHttp } from './modules/core/src/http';
import { prisma } from './src/lib/prisma';
import { EventEmitter } from 'events';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

console.log('JWT_SECRET:', process.env.JWT_SECRET);

app.prepare().then(() => {
  console.log('Next.js app prepared');
  
  const server = express();

  // Middlewares
  server.use(compression());
  server.use(helmet({
    contentSecurityPolicy: false,
  }));
  server.use(cors());
  server.use(cookieParser());
  server.use(express.json());

  // Custom middleware for logging requests
  server.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Error handling middleware
  server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // Plug core HTTP routes
  const eventEmitter = new EventEmitter();
  registerCoreHttp(server, prisma, eventEmitter);

  // Default route handler
  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Error preparing Next.js app:', err);
  process.exit(1);
}); 