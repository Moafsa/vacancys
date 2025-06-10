"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRATION = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
exports.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';
//# sourceMappingURL=jwt.js.map