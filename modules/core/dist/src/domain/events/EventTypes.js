"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypes = void 0;
var EventTypes;
(function (EventTypes) {
    EventTypes["USER_CREATED"] = "user.created";
    EventTypes["USER_UPDATED"] = "user.updated";
    EventTypes["USER_DELETED"] = "user.deleted";
    EventTypes["USER_VERIFIED"] = "user.verified";
    EventTypes["USER_PASSWORD_RESET"] = "user.password.reset";
    EventTypes["USER_TWO_FACTOR_ENABLED"] = "user.two_factor.enabled";
    EventTypes["USER_TWO_FACTOR_DISABLED"] = "user.two_factor.disabled";
    EventTypes["USER_LOGIN"] = "user.login";
    EventTypes["USER_LOGOUT"] = "user.logout";
})(EventTypes || (exports.EventTypes = EventTypes = {}));
//# sourceMappingURL=EventTypes.js.map