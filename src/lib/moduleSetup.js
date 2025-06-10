const { initializeModules, moduleRegistry } = require('../modules');

// Inicializa os módulos apenas uma vez
if (!global.modulesInitialized) {
  initializeModules();
  global.modulesInitialized = true;
  console.log('Módulos inicializados com sucesso');
}

module.exports = { moduleRegistry }; 