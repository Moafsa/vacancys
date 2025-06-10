import { EventEmitter } from 'events';

export interface ModuleAction {
  name: string;
  handler: (data: any) => Promise<any>;
}

export interface ModuleFilter {
  name: string;
  handler: (value: any, ...args: any[]) => any;
}

export interface ModuleDefinition {
  name: string;
  version: string;
  description: string;
  actions: ModuleAction[];
  filters: ModuleFilter[];
}

class ModuleRegistry {
  private static instance: ModuleRegistry;
  private modules: Map<string, ModuleDefinition>;
  private eventEmitter: EventEmitter;

  private constructor() {
    this.modules = new Map();
    this.eventEmitter = new EventEmitter();
  }

  public static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  // Retorna todos os módulos registrados
  public getModules(): Map<string, ModuleDefinition> {
    return this.modules;
  }

  // Registra um novo módulo
  public registerModule(module: ModuleDefinition): void {
    this.modules.set(module.name, module);
    
    // Registra as actions do módulo
    module.actions.forEach(action => {
      this.eventEmitter.on(action.name, action.handler);
    });

    console.log(`Módulo "${module.name}" registrado com sucesso`);
    console.log('Actions:', module.actions.map(a => a.name));
    console.log('Filters:', module.filters.map(f => f.name));
  }

  // Executa uma action (similar ao do_action do WordPress)
  public async doAction(actionName: string, data?: any): Promise<any> {
    const listeners = this.eventEmitter.listeners(actionName);
    if (listeners.length === 0) {
      throw new Error(`Action "${actionName}" não encontrada`);
    }

    // No WordPress, actions podem retornar valores
    const results = await Promise.all(
      listeners.map(listener => listener(data))
    );

    return results[0]; // Retorna o resultado do primeiro listener
  }

  // Aplica um filtro (similar ao apply_filters do WordPress)
  public applyFilter(filterName: string, value: any, ...args: any[]): any {
    const modules = Array.from(this.modules.values());
    
    return modules.reduce((filteredValue, module) => {
      const filter = module.filters.find(f => f.name === filterName);
      if (filter) {
        return filter.handler(filteredValue, ...args);
      }
      return filteredValue;
    }, value);
  }

  // Adiciona uma action (similar ao add_action do WordPress)
  public addAction(name: string, handler: (data: any) => Promise<any>): void {
    this.eventEmitter.on(name, handler);
    console.log(`Action "${name}" adicionada`);
  }

  // Adiciona um filtro (similar ao add_filter do WordPress)
  public addFilter(name: string, handler: (value: any, ...args: any[]) => any): void {
    const systemModule: ModuleDefinition = {
      name: 'system',
      version: '1.0.0',
      description: 'System module',
      actions: [],
      filters: [{ name, handler }]
    };
    
    this.registerModule(systemModule);
    console.log(`Filter "${name}" adicionado`);
  }

  public registerAction(name: string, handler: (data: any) => Promise<any>): void {
    this.addAction(name, handler);
  }

  public registerFilter(name: string, handler: (value: any, ...args: any[]) => any): void {
    this.addFilter(name, handler);
  }
}

export const moduleRegistry = ModuleRegistry.getInstance(); 