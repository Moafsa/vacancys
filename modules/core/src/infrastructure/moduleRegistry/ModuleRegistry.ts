import { ModuleInfo, ModuleRegistry } from './types';
import { EventEmitter } from '../messaging/EventEmitter';

// Tipos explícitos para handlers
export type ActionHandler = (args: any) => Promise<any>;
export type FilterHandler = (value: any, ...args: any[]) => Promise<any>;

export class InMemoryModuleRegistry implements ModuleRegistry {
  private modules: Map<string, ModuleInfo> = new Map();
  private eventEmitter: EventEmitter;
  private actions: Map<string, ActionHandler> = new Map();
  private filters: Map<string, FilterHandler> = new Map();

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  registerModule(moduleInfo: ModuleInfo): void {
    this.modules.set(moduleInfo.name, moduleInfo);
    
    // Register event handlers
    moduleInfo.events.subscribes.forEach(eventType => {
      this.eventEmitter.on(eventType, async (_data) => {
        // Forward event to module's event endpoint
        // Implementation of event forwarding...
      });
    });

    // Emit module registration event
    this.eventEmitter.emit('module.registered', moduleInfo);
  }

  getModule(name: string): ModuleInfo | undefined {
    return this.modules.get(name);
  }

  getAllModules(): ModuleInfo[] {
    return Array.from(this.modules.values());
  }

  getEndpoint(moduleName: string, endpointKey: string): string {
    const module = this.modules.get(moduleName);
    if (!module) {
      throw new Error(`Module ${moduleName} not found`);
    }
    const endpoint = module.endpoints[endpointKey];
    if (!endpoint) {
      throw new Error(`Endpoint ${endpointKey} not found in module ${moduleName}`);
    }
    return `${module.baseUrl}${endpoint}`;
  }

  // WordPress-like actions/filters
  registerAction(actionName: string, handler: ActionHandler): void {
    this.actions.set(actionName, handler);
  }

  async doAction(actionName: string, args: any): Promise<any> {
    const handler = this.actions.get(actionName);
    if (!handler) throw new Error(`Action ${actionName} not registered`);
    return await handler(args);
  }

  registerFilter(filterName: string, handler: FilterHandler): void {
    this.filters.set(filterName, handler);
  }

  async applyFilter(filterName: string, value: any, ...args: any[]): Promise<any> {
    const handler = this.filters.get(filterName);
    if (!handler) return value;
    return await handler(value, ...args);
  }
} 