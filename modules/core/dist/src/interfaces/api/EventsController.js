"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const messaging_1 = require("../../infrastructure/messaging");
const Logger_1 = require("../../infrastructure/logging/Logger");
class EventsController {
    constructor() {
        this.getMetrics = async (req, res) => {
            try {
                const metrics = messaging_1.eventService.getMetrics();
                res.status(200).json({
                    status: 'success',
                    data: metrics
                });
            }
            catch (error) {
                Logger_1.logger.error('Failed to get event service metrics:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to get event service metrics',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        };
        this.getDeadLetterQueueEventTypes = async (req, res) => {
            try {
                const dlq = messaging_1.eventService.getDeadLetterQueue();
                const eventTypes = await dlq.getEventTypes();
                res.status(200).json({
                    status: 'success',
                    data: {
                        eventTypes,
                        count: eventTypes.length
                    }
                });
            }
            catch (error) {
                Logger_1.logger.error('Failed to get DLQ event types:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to get Dead Letter Queue event types',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        };
        this.getDeadLetterQueueEvents = async (req, res) => {
            try {
                const { eventType } = req.params;
                if (!eventType) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Event type is required'
                    });
                    return;
                }
                const dlq = messaging_1.eventService.getDeadLetterQueue();
                const allEvents = await dlq.getEventsByType(eventType);
                if (req.pagination) {
                    const { page, limit, skip } = req.pagination;
                    const paginatedEvents = allEvents.slice(skip, skip + limit);
                    const paginationMetadata = {
                        total: allEvents.length,
                        page,
                        limit,
                        pages: Math.ceil(allEvents.length / limit),
                        hasNext: page < Math.ceil(allEvents.length / limit),
                        hasPrev: page > 1
                    };
                    res.status(200).json({
                        status: 'success',
                        data: {
                            events: paginatedEvents,
                            count: paginatedEvents.length
                        },
                        pagination: paginationMetadata
                    });
                    return;
                }
                res.status(200).json({
                    status: 'success',
                    data: {
                        events: allEvents,
                        count: allEvents.length
                    }
                });
            }
            catch (error) {
                Logger_1.logger.error(`Failed to get DLQ events for type ${req.params.eventType}:`, error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to get events from Dead Letter Queue',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        };
        this.reprocessDeadLetterQueueEvent = async (req, res) => {
            try {
                const { eventType, eventId } = req.params;
                if (!eventType || !eventId) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Event type and event ID are required'
                    });
                    return;
                }
                const dlq = messaging_1.eventService.getDeadLetterQueue();
                const success = await dlq.reprocessEvent(eventId, eventType);
                if (success) {
                    res.status(200).json({
                        status: 'success',
                        message: `Event ${eventId} reprocessed successfully`
                    });
                }
                else {
                    res.status(404).json({
                        status: 'error',
                        message: `Event ${eventId} not found or reprocessing failed`
                    });
                }
            }
            catch (error) {
                Logger_1.logger.error(`Failed to reprocess DLQ event ${req.params.eventId}:`, error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to reprocess event from Dead Letter Queue',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        };
        this.purgeDeadLetterQueueEvents = async (req, res) => {
            try {
                const { eventType } = req.params;
                if (!eventType) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Event type is required'
                    });
                    return;
                }
                const dlq = messaging_1.eventService.getDeadLetterQueue();
                const count = await dlq.purgeEventsByType(eventType);
                res.status(200).json({
                    status: 'success',
                    message: `Purged ${count} events of type ${eventType} from Dead Letter Queue`,
                    data: { count }
                });
            }
            catch (error) {
                Logger_1.logger.error(`Failed to purge DLQ events of type ${req.params.eventType}:`, error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to purge events from Dead Letter Queue',
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        };
    }
}
exports.EventsController = EventsController;
//# sourceMappingURL=EventsController.js.map