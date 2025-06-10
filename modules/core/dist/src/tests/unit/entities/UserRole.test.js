"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = require("@/domain/entities/UserRole");
describe('UserRole', () => {
    it('should have correct enum values', () => {
        expect(UserRole_1.UserRole.ADMIN).toBe('ADMIN');
        expect(UserRole_1.UserRole.USER).toBe('USER');
    });
    it('should be an enum', () => {
        expect(typeof UserRole_1.UserRole).toBe('object');
        expect(Object.keys(UserRole_1.UserRole)).toHaveLength(2);
    });
});
//# sourceMappingURL=UserRole.test.js.map