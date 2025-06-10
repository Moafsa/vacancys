"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptPasswordHashService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptPasswordHashService {
    constructor(saltRounds = 10) {
        this.saltRounds = saltRounds;
    }
    async hash(password) {
        return bcrypt_1.default.hash(password, this.saltRounds);
    }
    async compare(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
}
exports.BcryptPasswordHashService = BcryptPasswordHashService;
//# sourceMappingURL=BcryptPasswordHashService.js.map