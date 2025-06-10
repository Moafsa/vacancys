"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEventHandler = void 0;
const Event_1 = require("../../../domain/events/Event");
const Logger_1 = require("../../../infrastructure/logging/Logger");
const MonitoringService_1 = require("../../../infrastructure/monitoring/MonitoringService");
class UserEventHandler {
    async handle(event) {
        try {
            Logger_1.logger.info(`Processando evento de usuário: ${event.type}`, {
                userId: event.payload.userId,
                action: event.payload.action
            });
            switch (event.type) {
                case Event_1.EventTypes.USER_CREATED:
                    MonitoringService_1.monitoringService.setActiveUsers(await this.getCurrentUserCount());
                    break;
                case Event_1.EventTypes.USER_LOGGED_IN:
                    Logger_1.logger.info(`Usuário logado com sucesso: ${event.payload.email}`);
                    break;
                case Event_1.EventTypes.USER_VERIFIED:
                    Logger_1.logger.info(`Usuário verificado: ${event.payload.email}`);
                    break;
                default:
                    Logger_1.logger.debug(`Evento não tratado: ${event.type}`);
            }
        }
        catch (error) {
            Logger_1.logger.error(`Erro ao processar evento ${event.type}:`, error);
            throw error;
        }
    }
    async getCurrentUserCount() {
        return 1;
    }
}
exports.UserEventHandler = UserEventHandler;
//# sourceMappingURL=UserEventHandler.js.map