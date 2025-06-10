import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';

interface ModuleConfig {
  name: string;
  allowedTargets: string[];
  token?: string;
}

export const MODULE_COMMUNICATION_MAP = {
  core: ['*'],  // core pode falar com todos
  projects: ['core', 'payments', 'messaging', 'reviews'],
  payments: ['core', 'projects', 'credits'],
  messaging: ['core', 'projects', 'ai_translation'],
  reviews: ['core', 'projects'],
  skills: ['core', 'projects'],
  admin: ['*'],  // admin pode falar com todos
  analytics: ['*'],  // analytics pode ler de todos
  ai_translation: ['core', 'messaging'],
  meetings: ['core', 'messaging'],
  ai_matchmaking: ['core', 'projects'],
  credits: ['core', 'payments'],
  security: ['*'],  // security pode monitorar todos
  localization: ['core'],
  affiliates: ['core', 'payments'],
  integration_hub: ['*']  // hub de integração pode se comunicar com todos
};

class ModuleRegistry {
  private modules: Map<string, ModuleConfig>;
  private readonly secretKey: string;
  private readonly tokenExpiration: number;

  constructor() {
    this.modules = new Map();
    this.secretKey = process.env.MODULE_AUTH_SECRET || crypto.randomBytes(32).toString('hex');
    this.tokenExpiration = 3600; // 1 hora em segundos
    this.initializeModules();
  }

  private initializeModules() {
    Object.entries(MODULE_COMMUNICATION_MAP).forEach(([moduleName, allowedTargets]) => {
      this.registerModule(moduleName, allowedTargets as string[]);
    });
  }

  private registerModule(name: string, allowedTargets: string[]) {
    const token = this.generateToken(name, allowedTargets);
    this.modules.set(name, { name, allowedTargets, token });
  }

  private generateToken(moduleName: string, allowedTargets: string[]): string {
    const payload = {
      moduleName,
      allowedTargets
    };

    const options: SignOptions = {
      expiresIn: this.tokenExpiration
    };

    return jwt.sign(payload, this.secretKey, options);
  }

  public getModuleConfig(moduleName: string): ModuleConfig | undefined {
    return this.modules.get(moduleName);
  }

  public validateCommunication(sourceModule: string, targetModule: string, token: string): boolean {
    const source = this.modules.get(sourceModule);
    if (!source || source.token !== token) {
      return false;
    }

    // Módulos com '*' podem se comunicar com qualquer outro módulo
    if (source.allowedTargets.includes('*')) {
      return true;
    }

    return source.allowedTargets.includes(targetModule);
  }

  public getModuleToken(moduleName: string): string | undefined {
    return this.modules.get(moduleName)?.token;
  }
}

export const moduleRegistry = new ModuleRegistry(); 