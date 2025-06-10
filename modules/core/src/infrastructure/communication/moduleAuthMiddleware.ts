import { Request, Response, NextFunction } from 'express';
import { moduleRegistry } from './ModuleRegistry';

// Simple logger implementation
const logger = {
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data);
  },
  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data);
  }
};

export interface ModuleAuthRequest extends Request {
  sourceModule?: string;
}

export const validateModuleCommunication = (targetModule: string) => {
  return (req: ModuleAuthRequest, res: Response, next: NextFunction) => {
    const sourceModule = req.headers['x-source-module'] as string;
    const moduleToken = req.headers['x-module-token'] as string;

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

    const isValid = moduleRegistry.validateCommunication(sourceModule, targetModule, moduleToken);

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

    // Attach the source module to the request for use in route handlers
    req.sourceModule = sourceModule;
    
    next();
  };
}; 