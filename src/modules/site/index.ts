import { ModuleInfo } from '../../../modules/core/src/infrastructure/moduleRegistry/types';
import { ModuleClient } from '../../../modules/core/src/infrastructure/moduleRegistry/ModuleClient';
import { InMemoryModuleRegistry } from '../../../modules/core/src/infrastructure/moduleRegistry/ModuleRegistry';
import { registerCoreHooks } from '../../../modules/core/src/hooks';

// Fake EventEmitter para o browser
class EventEmitter {
  emit() {}
  on() {}
  off() {}
  close() {}
}

// Fake ModuleRegistry para o browser
class FakeModuleRegistry {
  registerModule(_module: any) {}
  registerAction() {}
  async doAction() {}
  registerFilter() {}
  async applyFilter() {}
  getModule() { return null; }
  getAllModules() { return []; }
  getEndpoint() { return null; }
}

// Singleton instance for the site module
class SiteModule {
  private static instance: SiteModule;
  private moduleClient: ModuleClient;
  private registry: FakeModuleRegistry;

  private constructor() {
    const eventEmitter = new EventEmitter();
    this.registry = new FakeModuleRegistry();
    this.moduleClient = new ModuleClient(this.registry as any);

    // Register core module (fake)
    this.registry.registerModule({
      name: 'core',
      version: '1.0.0',
      description: 'Core module',
      baseUrl: process.env.NEXT_PUBLIC_CORE_URL || 'http://localhost:3002',
      endpoints: {
        'auth.login': '/api/v1/auth/login',
        'auth.register': '/api/v1/auth/register',
        'auth.verify': '/api/v1/auth/verify-email',
        'auth.reset-password': '/api/v1/auth/reset-password/request',
        'auth.me': '/api/v1/auth/me'
      },
      events: {
        publishes: [],
        subscribes: []
      }
    });

    // Não registra hooks reais do core
  }

  public static getInstance(): SiteModule {
    if (!SiteModule.instance) {
      SiteModule.instance = new SiteModule();
    }
    return SiteModule.instance;
  }

  public getClient(): ModuleClient {
    return this.moduleClient;
  }
}

// Export a singleton instance
export const siteModule = SiteModule.getInstance();
export const moduleClient = siteModule.getClient(); 