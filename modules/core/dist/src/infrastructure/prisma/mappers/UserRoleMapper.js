"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleMapper = void 0;
const client_1 = require("@prisma/client");
const UserRole_1 = require("../../../domain/enums/UserRole");
class UserRoleMapper {
    static toDomain(prismaRole) {
        const roleMap = {
            ADMIN: UserRole_1.UserRole.ADMIN,
            USER: UserRole_1.UserRole.USER,
        };
        return roleMap[prismaRole];
    }
    static toPrisma(domainRole) {
        const roleMap = {
            ADMIN: client_1.Role.ADMIN,
            USER: client_1.Role.USER,
        };
        return roleMap[domainRole];
    }
}
exports.UserRoleMapper = UserRoleMapper;
//# sourceMappingURL=UserRoleMapper.js.map