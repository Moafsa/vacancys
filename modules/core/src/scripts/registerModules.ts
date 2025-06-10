import { moduleRegistry } from '../infrastructure/moduleRegistry';
import { MODULE_COMMUNICATION_MAP } from '../infrastructure/communication/ModuleRegistry';
import { ModuleInfo } from '../infrastructure/moduleRegistry/types';

async function registerAvailableModules() {
  // Register core module
  const coreModule: ModuleInfo = {
    name: 'core',
    version: '1.0.0',
    description: 'Core module with authentication, user management, and RBAC',
    baseUrl: process.env.CORE_API_URL || 'http://localhost:3000',
    endpoints: {
      auth: '/auth',
      users: '/users',
      rbac: '/rbac',
      modules: '/modules'
    },
    events: {
      publishes: ['user.created', 'user.updated', 'user.deleted'],
      subscribes: []
    }
  };

  await moduleRegistry.registerModule(coreModule);

  // Register other modules based on MODULE_COMMUNICATION_MAP
  for (const moduleName of Object.keys(MODULE_COMMUNICATION_MAP)) {
    if (moduleName === 'core') continue; // Already registered

    const moduleInfo: ModuleInfo = {
      name: moduleName,
      version: '1.0.0',
      description: `${moduleName} module`,
      baseUrl: `${process.env.CORE_API_URL || 'http://localhost:3000'}/${moduleName}`,
      endpoints: {},
      events: {
        publishes: [],
        subscribes: []
      }
    };

    await moduleRegistry.registerModule(moduleInfo);
  }

  console.log('All modules registered successfully!');
}

// Run if called directly
if (require.main === module) {
  registerAvailableModules().catch(console.error);
}

export { registerAvailableModules }; 