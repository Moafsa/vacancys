"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingMetrics = void 0;
class MessagingMetrics {
    constructor() {
        this.metrics = new Map();
        this.circuitBreakerStateChanges = [];
        this.retryAttempts = [];
    }
    recordEventPublished(eventType, processingTime) {
        this.initializeEventMetrics(eventType);
        const metrics = this.metrics.get(eventType);
        metrics.published++;
        metrics.processingTime.push(processingTime);
    }
    recordEventFailed(eventType) {
        this.initializeEventMetrics(eventType);
        const metrics = this.metrics.get(eventType);
        metrics.failed++;
    }
    recordEventRetried(eventType) {
        this.initializeEventMetrics(eventType);
        const metrics = this.metrics.get(eventType);
        metrics.retried++;
    }
    recordEventDeadLettered(eventType) {
        this.initializeEventMetrics(eventType);
        const metrics = this.metrics.get(eventType);
        metrics.deadLettered++;
    }
    recordCircuitBreakerStateChange(state) {
        this.circuitBreakerStateChanges.push({
            count: this.circuitBreakerStateChanges.length + 1,
            timestamp: new Date()
        });
    }
    recordRetryAttempt() {
        this.retryAttempts.push({
            count: this.retryAttempts.length + 1,
            timestamp: new Date()
        });
    }
    getEventMetrics(eventType) {
        return this.metrics.get(eventType);
    }
    getAllEventMetrics() {
        return new Map(this.metrics);
    }
    getCircuitBreakerMetrics() {
        return [...this.circuitBreakerStateChanges];
    }
    getRetryMetrics() {
        return [...this.retryAttempts];
    }
    getAggregatedMetrics() {
        const totalEvents = Array.from(this.metrics.values()).reduce((acc, metrics) => acc + metrics.published, 0);
        const totalFailures = Array.from(this.metrics.values()).reduce((acc, metrics) => acc + metrics.failed, 0);
        const totalRetries = Array.from(this.metrics.values()).reduce((acc, metrics) => acc + metrics.retried, 0);
        const totalDeadLettered = Array.from(this.metrics.values()).reduce((acc, metrics) => acc + metrics.deadLettered, 0);
        const averageProcessingTimes = new Map();
        this.metrics.forEach((metrics, eventType) => {
            if (metrics.processingTime.length > 0) {
                const average = metrics.processingTime.reduce((a, b) => a + b, 0) / metrics.processingTime.length;
                averageProcessingTimes.set(eventType, average);
            }
        });
        return {
            totalEvents,
            totalFailures,
            totalRetries,
            totalDeadLettered,
            circuitBreakerChanges: this.circuitBreakerStateChanges.length,
            retryAttempts: this.retryAttempts.length,
            averageProcessingTimes: Object.fromEntries(averageProcessingTimes)
        };
    }
    initializeEventMetrics(eventType) {
        if (!this.metrics.has(eventType)) {
            this.metrics.set(eventType, {
                published: 0,
                failed: 0,
                retried: 0,
                deadLettered: 0,
                processingTime: []
            });
        }
    }
    clearOldMetrics(olderThan) {
        this.circuitBreakerStateChanges = this.circuitBreakerStateChanges.filter(metric => metric.timestamp > olderThan);
        this.retryAttempts = this.retryAttempts.filter(metric => metric.timestamp > olderThan);
        this.metrics.forEach(metrics => {
            metrics.processingTime = metrics.processingTime.slice(-1000);
        });
    }
}
exports.MessagingMetrics = MessagingMetrics;
//# sourceMappingURL=MessagingMetrics.js.map