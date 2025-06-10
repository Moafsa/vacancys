"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeadLetterQueue = void 0;
class DeadLetterQueue {
    constructor(maxSize = 1000) {
        this.messages = new Map();
        this.maxSize = maxSize;
    }
    async addMessage(messageId, message, error, retryCount, originalQueue) {
        if (this.messages.size >= this.maxSize) {
            const oldestKey = Array.from(this.messages.keys())[0];
            this.messages.delete(oldestKey);
        }
        this.messages.set(messageId, {
            message,
            error: error.message,
            timestamp: new Date(),
            retryCount,
            originalQueue
        });
    }
    async getMessage(messageId) {
        return this.messages.get(messageId);
    }
    async getAllMessages() {
        return Array.from(this.messages.values());
    }
    async removeMessage(messageId) {
        return this.messages.delete(messageId);
    }
    async retryMessage(messageId) {
        const message = this.messages.get(messageId);
        if (message) {
            this.messages.delete(messageId);
        }
        return message;
    }
    async clear() {
        this.messages.clear();
    }
    getSize() {
        return this.messages.size;
    }
}
exports.DeadLetterQueue = DeadLetterQueue;
//# sourceMappingURL=DeadLetterQueue.js.map