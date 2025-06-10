import express from 'express';
import crypto from 'crypto';

// Mapa de comunicação entre módulos
const MODULE_COMMUNICATION_MAP = {
  core: ['*'],
  projects: ['core']
};

// Registro de tokens dos módulos
const moduleTokens = new Map<string, string>();

// Gerar tokens para os módulos
Object.keys(MODULE_COMMUNICATION_MAP).forEach(moduleName => {
  moduleTokens.set(moduleName, crypto.randomBytes(32).toString('hex'));
});

// Middleware de autenticação entre módulos
export const validateModuleCommunication = (targetModule: string) => {
  return (req: any, res: any, next: any) => {
    const sourceModule = req.headers['x-source-module'] as string;
    const moduleToken = req.headers['x-module-token'] as string;

    if (!sourceModule || !moduleToken) {
      return res.status(401).json({
        error: 'Module authentication required',
        details: 'Missing x-source-module or x-module-token header'
      });
    }

    const validToken = moduleTokens.get(sourceModule);
    if (!validToken || validToken !== moduleToken) {
      return res.status(401).json({
        error: 'Invalid module token'
      });
    }

    const allowedTargets = MODULE_COMMUNICATION_MAP[sourceModule];
    if (!allowedTargets || (!allowedTargets.includes('*') && !allowedTargets.includes(targetModule))) {
      return res.status(403).json({
        error: 'Communication not allowed',
        details: `Module ${sourceModule} is not allowed to communicate with ${targetModule}`
      });
    }

    // Anexa o módulo de origem à requisição
    req.sourceModule = sourceModule;
    next();
  };
};

// Cliente HTTP para comunicação entre módulos
export class ModuleClient {
  private readonly sourceModule: string;
  private readonly targetModule: string;
  private readonly baseURL: string;

  constructor(config: { sourceModule: string; targetModule: string; baseURL: string }) {
    this.sourceModule = config.sourceModule;
    this.targetModule = config.targetModule;
    this.baseURL = config.baseURL;

    // Valida se o módulo de origem existe
    if (!moduleTokens.has(this.sourceModule)) {
      throw new Error(`Module ${this.sourceModule} not registered`);
    }

    // Valida se a comunicação é permitida
    const allowedTargets = MODULE_COMMUNICATION_MAP[this.sourceModule];
    if (!allowedTargets || (!allowedTargets.includes('*') && !allowedTargets.includes(this.targetModule))) {
      throw new Error(`Module ${this.sourceModule} is not allowed to communicate with ${this.targetModule}`);
    }
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-source-module': this.sourceModule,
      'x-module-token': moduleTokens.get(this.sourceModule)
    };
  }

  async get(path: string) {
    const response = await fetch(`${this.baseURL}${path}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async post(path: string, data: any) {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

// Função para obter o token de um módulo
export function getModuleToken(moduleName: string): string | undefined {
  return moduleTokens.get(moduleName);
}

// Exemplo de uso:
/*
// No módulo projects:
app.get('/test', validateModuleCommunication('projects'), (req, res) => {
  res.json({ message: 'Test successful', callingModule: req.sourceModule });
});

// No módulo core:
const projectsClient = new ModuleClient({
  sourceModule: 'core',
  targetModule: 'projects',
  baseURL: 'http://localhost:3000'
});

const response = await projectsClient.get('/test');
*/ 