import { moduleRegistry } from '../core/ModuleRegistry';
import authModule from './auth';

// Registra todos os módulos
export function initializeModules() {
  // Módulo de autenticação
  moduleRegistry.registerModule(authModule);

  console.log('Módulos registrados:', Array.from(moduleRegistry.getModules().keys()));
} 