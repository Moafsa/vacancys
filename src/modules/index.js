const { moduleRegistry } = require('../core/ModuleRegistry');
const { authModule } = require('./auth');

// Registra todos os módulos
function initializeModules() {
  // Módulo de autenticação
  moduleRegistry.registerModule(authModule);

  console.log('Módulos registrados:', Array.from(moduleRegistry.getModules().keys()));
}

module.exports = {
  moduleRegistry,
  initializeModules
}; 