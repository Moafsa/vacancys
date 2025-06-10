"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRegistry = exports.eventEmitter = void 0;
const ModuleRegistry_1 = require("./ModuleRegistry");
const EventEmitter_1 = require("../messaging/EventEmitter");
exports.eventEmitter = new EventEmitter_1.EventEmitter();
exports.moduleRegistry = new ModuleRegistry_1.InMemoryModuleRegistry(exports.eventEmitter);
//# sourceMappingURL=index.js.map