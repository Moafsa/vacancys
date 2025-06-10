"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryModuleRegistry = void 0;
class InMemoryModuleRegistry {
    constructor(eventEmitter) {
        this.modules = new Map();
        this.actions = new Map();
        this.filters = new Map();
        this.eventEmitter = eventEmitter;
    }
    registerModule(moduleInfo) {
        this.modules.set(moduleInfo.name, moduleInfo);
        moduleInfo.events.subscribes.forEach(eventType => {
            this.eventEmitter.on(eventType, async (_data) => {
            });
        });
        this.eventEmitter.emit('module.registered', moduleInfo);
    }
    getModule(name) {
        return this.modules.get(name);
    }
    getAllModules() {
        return Array.from(this.modules.values());
    }
    getEndpoint(moduleName, endpointKey) {
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
    registerAction(actionName, handler) {
        this.actions.set(actionName, handler);
    }
    async doAction(actionName, args) {
        const handler = this.actions.get(actionName);
        if (!handler)
            throw new Error(`Action ${actionName} not registered`);
        return await handler(args);
    }
    registerFilter(filterName, handler) {
        this.filters.set(filterName, handler);
    }
    async applyFilter(filterName, value, ...args) {
        const handler = this.filters.get(filterName);
        if (!handler)
            return value;
        return await handler(value, ...args);
    }
}
exports.InMemoryModuleRegistry = InMemoryModuleRegistry;
//# sourceMappingURL=ModuleRegistry.js.map