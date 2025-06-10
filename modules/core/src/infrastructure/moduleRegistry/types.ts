export interface ModuleInfo {
  name: string;
  version: string;
  description: string;
  baseUrl: string;
  endpoints: {
    [key: string]: string;
  };
  events: {
    publishes: string[];
    subscribes: string[];
  };
}

export interface ModuleRegistry {
  registerModule(moduleInfo: ModuleInfo): void;
  getModule(name: string): ModuleInfo | undefined;
  getAllModules(): ModuleInfo[];
  getEndpoint(moduleName: string, endpointKey: string): string;
} 