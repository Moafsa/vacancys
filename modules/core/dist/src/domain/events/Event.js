"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTypes = void 0;
var EventTypes;
(function (EventTypes) {
    EventTypes["USER_CREATED"] = "USER_CREATED";
    EventTypes["USER_UPDATED"] = "USER_UPDATED";
    EventTypes["USER_DELETED"] = "USER_DELETED";
    EventTypes["USER_ACTIVATED"] = "USER_ACTIVATED";
    EventTypes["USER_DEACTIVATED"] = "USER_DEACTIVATED";
    EventTypes["USER_LOGGED_IN"] = "auth.login";
    EventTypes["USER_LOGGED_OUT"] = "auth.logout";
    EventTypes["PASSWORD_RESET_REQUESTED"] = "auth.password.reset.requested";
    EventTypes["PASSWORD_RESET_COMPLETED"] = "auth.password.reset.completed";
    EventTypes["SYSTEM_ERROR"] = "system.error";
    EventTypes["SYSTEM_WARNING"] = "system.warning";
    EventTypes["SYSTEM_METRICS"] = "system.metrics";
})(EventTypes || (exports.EventTypes = EventTypes = {}));
//# sourceMappingURL=Event.js.map