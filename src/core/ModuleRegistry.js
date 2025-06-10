const EventEmitter = require('events');

class ModuleRegistry {
  constructor() {
    if (!ModuleRegistry.instance) {
      this.modules = new Map();
      this.eventEmitter = new EventEmitter();
      ModuleRegistry.instance = this;
    }
    return ModuleRegistry.instance;
  }

  // Retorna todos os módulos registrados
  getModules() {
    return this.modules;
  }

  // Registra um novo módulo
  registerModule(module) {
    this.modules.set(module.name, module);
    
    // Registra as actions do módulo
    module.actions.forEach(action => {
      this.eventEmitter.on(action.name, action.handler);
    });

    console.log(`Módulo "${module.name}" registrado com sucesso`);
    console.log('Actions:', module.actions.map(a => a.name));
    console.log('Filters:', module.filters.map(f => f.name));
  }

  // Executa uma action
  async doAction(actionName, data) {
    const listeners = this.eventEmitter.listeners(actionName);
    if (listeners.length === 0) {
      throw new Error(`Action "${actionName}" não encontrada`);
    }

    // Executa a action e retorna o resultado
    const results = await Promise.all(
      listeners.map(listener => listener(data))
    );

    return results[0];
  }

  // Aplica um filtro
  applyFilter(filterName, value, ...args) {
    const modules = Array.from(this.modules.values());
    
    return modules.reduce((filteredValue, module) => {
      const filter = module.filters.find(f => f.name === filterName);
      if (filter) {
        return filter.handler(filteredValue, ...args);
      }
      return filteredValue;
    }, value);
  }
}

// Exporta uma única instância
const moduleRegistry = new ModuleRegistry();
Object.freeze(moduleRegistry);

module.exports = { moduleRegistry }; 