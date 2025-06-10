import { InMemoryModuleRegistry } from './ModuleRegistry';
import { EventEmitter } from '../messaging/EventEmitter';

// Instância global do event emitter
export const eventEmitter = new EventEmitter();
 
// Instância global do moduleRegistry
export const moduleRegistry = new InMemoryModuleRegistry(eventEmitter); 