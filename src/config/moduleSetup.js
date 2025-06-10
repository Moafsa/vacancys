const { initializeModules, moduleRegistry } = require('../modules');

// Inicializa os módulos apenas uma vez
if (!global.modulesInitialized) {
  console.log('Inicializando módulos...');
  initializeModules();
  global.modulesInitialized = true;
  console.log('Módulos inicializados com sucesso');
}

module.exports = { moduleRegistry }; 