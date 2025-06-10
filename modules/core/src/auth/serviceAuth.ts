import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

interface ServiceTokenPayload {
  moduleId: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export class ServiceAuth {
  private readonly secret: Secret;
  private readonly expiresIn: number;

  constructor(secret: Secret, expiresIn: number = 3600) { // 1 hour in seconds
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generateToken(serviceId: string, permissions: string[] = []): string {
    const options: SignOptions = {
      expiresIn: this.expiresIn
    };

    const payload: ServiceTokenPayload = {
      moduleId: serviceId,
      permissions
    };

    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): ServiceTokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as ServiceTokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

class ServiceAuthManager {
  private readonly secret: string;

  constructor() {
    this.secret = this.generateSecret();
  }

  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  generateServiceToken(serviceId: string, permissions: string[] = [], expiresIn: number = 3600): string {
    const auth = new ServiceAuth(this.secret, expiresIn);
    return auth.generateToken(serviceId, permissions);
  }

  verifyServiceToken(token: string): ServiceTokenPayload {
    const auth = new ServiceAuth(this.secret);
    return auth.verifyToken(token);
  }

  hasPermission(payload: ServiceTokenPayload, requiredPermission: string): boolean {
    return payload.permissions?.includes(requiredPermission) || false;
  }
}

export const serviceAuth = new ServiceAuthManager();

// Middleware for Express
export const requireServiceAuth = (requiredPermission?: string) => {
  return (req: any, res: any, next: any) => {
    try {
      const token = req.headers['x-service-token'];
      
      if (!token) {
        return res.status(401).json({ error: 'Service token required' });
      }

      const payload = serviceAuth.verifyServiceToken(token);

      if (requiredPermission && !serviceAuth.hasPermission(payload, requiredPermission)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Attach the verified module info to the request
      req.serviceModule = {
        id: payload.moduleId,
        permissions: payload.permissions
      };

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid service token' });
    }
  };
}; 