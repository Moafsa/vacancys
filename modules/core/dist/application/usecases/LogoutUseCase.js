"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUseCase = void 0;
class LogoutUseCase {
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async execute(sessionId) {
        const isValid = await this.sessionService.isSessionValid(sessionId);
        if (!isValid) {
            throw new Error('Invalid or expired session');
        }
        const session = await this.sessionService.getSession(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }
        await this.sessionService.deleteSession(sessionId);
    }
}
exports.LogoutUseCase = LogoutUseCase;
//# sourceMappingURL=LogoutUseCase.js.map