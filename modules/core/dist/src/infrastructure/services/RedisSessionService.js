"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisSessionService = void 0;
const uuid_1 = require("uuid");
class RedisSessionService {
    constructor(redis) {
        this.keyPrefix = 'session:';
        this.userSessionsPrefix = 'user-sessions:';
        this.defaultExpirationHours = 24;
        this.redis = redis;
    }
    async createSession(user, token, options) {
        const sessionId = (0, uuid_1.v4)();
        const now = new Date();
        const expiresInHours = (options === null || options === void 0 ? void 0 : options.expiresInHours) || this.defaultExpirationHours;
        const expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000);
        const session = {
            id: sessionId,
            userId: user.id,
            token,
            expiresAt,
            createdAt: now,
            updatedAt: now,
            lastActivity: now,
            isActive: true,
            ipAddress: options === null || options === void 0 ? void 0 : options.ipAddress,
            userAgent: options === null || options === void 0 ? void 0 : options.userAgent,
        };
        const key = this.getSessionKey(sessionId);
        await this.redis.setex(key, expiresInHours * 60 * 60, JSON.stringify(session));
        await this.addToUserSessions(user.id, sessionId);
        return session;
    }
    async getSession(sessionId) {
        const key = this.getSessionKey(sessionId);
        const data = await this.redis.get(key);
        if (!data)
            return null;
        const session = JSON.parse(data);
        session.expiresAt = new Date(session.expiresAt);
        session.createdAt = new Date(session.createdAt);
        session.updatedAt = new Date(session.updatedAt);
        session.lastActivity = new Date(session.lastActivity);
        return session;
    }
    async updateSession(sessionId, updates) {
        const session = await this.getSession(sessionId);
        if (!session)
            return null;
        const updatedSession = {
            ...session,
            ...updates,
            updatedAt: new Date(),
        };
        const key = this.getSessionKey(sessionId);
        const ttl = await this.redis.ttl(key);
        if (ttl > 0) {
            await this.redis.setex(key, ttl, JSON.stringify(updatedSession));
            return updatedSession;
        }
        return null;
    }
    async deleteSession(sessionId) {
        const session = await this.getSession(sessionId);
        if (!session)
            return false;
        const key = this.getSessionKey(sessionId);
        await this.redis.del(key);
        await this.removeFromUserSessions(session.userId, sessionId);
        return true;
    }
    async getUserSessions(userId) {
        const sessionIds = await this.redis.smembers(this.getUserSessionsKey(userId));
        const sessions = [];
        for (const sessionId of sessionIds) {
            const session = await this.getSession(sessionId);
            if (session && session.isActive) {
                sessions.push(session);
            }
        }
        return sessions;
    }
    async deleteUserSessions(userId) {
        const sessionIds = await this.redis.smembers(this.getUserSessionsKey(userId));
        for (const sessionId of sessionIds) {
            await this.deleteSession(sessionId);
        }
        await this.redis.del(this.getUserSessionsKey(userId));
    }
    async cleanExpiredSessions() {
        const keys = await this.redis.keys(`${this.keyPrefix}*`);
        for (const key of keys) {
            const data = await this.redis.get(key);
            if (data) {
                const session = JSON.parse(data);
                if (new Date(session.expiresAt) < new Date()) {
                    await this.deleteSession(session.id);
                }
            }
        }
    }
    async isSessionValid(sessionId) {
        const session = await this.getSession(sessionId);
        if (!session)
            return false;
        return session.isActive && new Date(session.expiresAt) > new Date();
    }
    async updateLastActivity(sessionId) {
        await this.updateSession(sessionId, { lastActivity: new Date() });
    }
    getSessionKey(sessionId) {
        return `${this.keyPrefix}${sessionId}`;
    }
    getUserSessionsKey(userId) {
        return `${this.userSessionsPrefix}${userId}`;
    }
    async addToUserSessions(userId, sessionId) {
        await this.redis.sadd(this.getUserSessionsKey(userId), sessionId);
    }
    async removeFromUserSessions(userId, sessionId) {
        await this.redis.srem(this.getUserSessionsKey(userId), sessionId);
    }
}
exports.RedisSessionService = RedisSessionService;
//# sourceMappingURL=RedisSessionService.js.map