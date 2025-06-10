"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_1 = require("@/domain/entities/UserRole");
const UserStatus_1 = require("@/domain/entities/UserStatus");
describe('TokenPayload', () => {
    it('deve criar um payload com todos os campos', () => {
        const payload = {
            id: '1',
            email: 'test@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            isEmailVerified: true,
        };
        expect(payload.id).toBe('1');
        expect(payload.email).toBe('test@example.com');
        expect(payload.role).toBe(UserRole_1.UserRole.USER);
        expect(payload.status).toBe(UserStatus_1.UserStatus.ACTIVE);
        expect(payload.isEmailVerified).toBe(true);
    });
    it('deve ser um tipo readonly', () => {
        const payload = {
            id: '1',
            email: 'test@example.com',
            role: UserRole_1.UserRole.USER,
            status: UserStatus_1.UserStatus.ACTIVE,
            isEmailVerified: true,
        };
        payload.id = '2';
        expect(payload.id).toBe('1');
    });
});
//# sourceMappingURL=TokenPayload.test.js.map