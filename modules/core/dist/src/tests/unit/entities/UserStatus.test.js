"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserStatus_1 = require("@/domain/entities/UserStatus");
describe('UserStatus', () => {
    it('deve ter os valores corretos', () => {
        expect(UserStatus_1.UserStatus.ACTIVE).toBe('ACTIVE');
        expect(UserStatus_1.UserStatus.INACTIVE).toBe('INACTIVE');
        expect(UserStatus_1.UserStatus.PENDING).toBe('PENDING');
    });
    it('deve ser um enum', () => {
        expect(typeof UserStatus_1.UserStatus).toBe('object');
        expect(Object.keys(UserStatus_1.UserStatus)).toHaveLength(3);
    });
});
//# sourceMappingURL=UserStatus.test.js.map