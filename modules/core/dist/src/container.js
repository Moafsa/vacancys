"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const PrismaUserRepository_1 = require("./infrastructure/repositories/PrismaUserRepository");
tsyringe_1.container.registerSingleton('IUserRepository', PrismaUserRepository_1.PrismaUserRepository);
//# sourceMappingURL=container.js.map