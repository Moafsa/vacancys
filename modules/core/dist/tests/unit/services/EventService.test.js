"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const EventService_1 = require("../../../infrastructure/services/EventService");
const EventType_1 = require("../../../domain/enums/EventType");
(0, globals_1.describe)('EventService', () => {
    let eventService;
    let mockRedisClient;
    let mockSubscriber;
    let mockPublisher;
    (0, globals_1.beforeEach)(() => {
        mockSubscriber = {
            subscribe: globals_1.jest.fn(),
            on: globals_1.jest.fn(),
            unsubscribe: globals_1.jest.fn()
        };
        mockPublisher = {
            publish: globals_1.jest.fn()
        };
        mockRedisClient = {
            duplicate: globals_1.jest.fn().mockReturnValue(mockSubscriber),
            publish: globals_1.jest.fn()
        };
        eventService = new EventService_1.EventService(mockRedisClient);
    });
    (0, globals_1.afterEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('subscribe', () => {
        (0, globals_1.it)('deve inscrever um handler para um tipo de evento', async () => {
            // Arrange
            const eventType = EventType_1.EventType.USER_CREATED;
            const handler = globals_1.jest.fn();
            // Act
            await eventService.subscribe(eventType, handler);
            // Assert
            (0, globals_1.expect)(mockSubscriber.subscribe).toHaveBeenCalledWith(`event:${eventType}`);
            (0, globals_1.expect)(mockSubscriber.on).toHaveBeenCalledWith('message', globals_1.expect.any(Function));
        });
        (0, globals_1.it)('deve chamar o handler quando um evento é recebido', async () => {
            // Arrange
            const eventType = EventType_1.EventType.USER_CREATED;
            const handler = globals_1.jest.fn();
            const eventPayload = {
                userId: '123',
                timestamp: new Date().toISOString()
            };
            // Act
            await eventService.subscribe(eventType, handler);
            const messageHandler = mockSubscriber.on.mock.calls[0][1];
            messageHandler(`event:${eventType}`, JSON.stringify(eventPayload));
            // Assert
            (0, globals_1.expect)(handler).toHaveBeenCalledWith(eventPayload);
        });
        (0, globals_1.it)('deve lançar erro quando a inscrição falha', async () => {
            // Arrange
            const eventType = EventType_1.EventType.USER_CREATED;
            const handler = globals_1.jest.fn();
            mockSubscriber.subscribe.mockRejectedValue(new Error('Redis error'));
            // Act & Assert
            await (0, globals_1.expect)(eventService.subscribe(eventType, handler))
                .rejects
                .toThrow('Failed to subscribe to event');
        });
    });
    (0, globals_1.describe)('unsubscribe', () => {
        (0, globals_1.it)('deve cancelar a inscrição de um handler', async () => {
            // Arrange
            const eventType = EventType_1.EventType.USER_CREATED;
            const handler = globals_1.jest.fn();
            // Act
            await eventService.subscribe(eventType, handler);
            await eventService.unsubscribe(eventType, handler);
            // Assert
            (0, globals_1.expect)(mockSubscriber.unsubscribe).toHaveBeenCalledWith(`event:${eventType}`);
        });
        (0, globals_1.it)('deve lançar erro quando o cancelamento da inscrição falha', async () => {
            // Arrange
            const eventType = EventType_1.EventType.USER_CREATED;
            const handler = globals_1.jest.fn();
            mockSubscriber.unsubscribe.mockRejectedValue(new Error('Redis error'));
            // Act & Assert
            await (0, globals_1.expect)(eventService.unsubscribe(eventType, handler))
                .rejects
                .toThrow('Failed to unsubscribe from event');
        });
    });
    (0, globals_1.describe)('publish', () => {
        (0, globals_1.it)('deve publicar um evento', async () => {
            // Arrange
            const eventType = EventType_1.EventType.USER_CREATED;
            const eventPayload = {
                userId: '123',
                timestamp: new Date().toISOString()
            };
            // Act
            await eventService.publish(eventType, eventPayload);
            // Assert
            (0, globals_1.expect)(mockPublisher.publish).toHaveBeenCalledWith(`event:${eventType}`, JSON.stringify(eventPayload));
        });
        (0, globals_1.it)('deve lançar erro quando a publicação falha', async () => {
            // Arrange
            const eventType = EventType_1.EventType.USER_CREATED;
            const eventPayload = {
                userId: '123',
                timestamp: new Date().toISOString()
            };
            mockPublisher.publish.mockRejectedValue(new Error('Redis error'));
            // Act & Assert
            await (0, globals_1.expect)(eventService.publish(eventType, eventPayload))
                .rejects
                .toThrow('Failed to publish event');
        });
    });
    (0, globals_1.describe)('publishBatch', () => {
        (0, globals_1.it)('deve publicar múltiplos eventos', async () => {
            // Arrange
            const events = [
                {
                    type: EventType_1.EventType.USER_CREATED,
                    payload: { userId: '123', timestamp: new Date().toISOString() }
                },
                {
                    type: EventType_1.EventType.USER_UPDATED,
                    payload: { userId: '123', timestamp: new Date().toISOString() }
                }
            ];
            // Act
            await eventService.publishBatch(events);
            // Assert
            (0, globals_1.expect)(mockPublisher.publish).toHaveBeenCalledTimes(2);
            (0, globals_1.expect)(mockPublisher.publish).toHaveBeenNthCalledWith(1, `event:${EventType_1.EventType.USER_CREATED}`, JSON.stringify(events[0].payload));
            (0, globals_1.expect)(mockPublisher.publish).toHaveBeenNthCalledWith(2, `event:${EventType_1.EventType.USER_UPDATED}`, JSON.stringify(events[1].payload));
        });
        (0, globals_1.it)('deve lançar erro quando a publicação em lote falha', async () => {
            // Arrange
            const events = [
                {
                    type: EventType_1.EventType.USER_CREATED,
                    payload: { userId: '123', timestamp: new Date().toISOString() }
                }
            ];
            mockPublisher.publish.mockRejectedValue(new Error('Redis error'));
            // Act & Assert
            await (0, globals_1.expect)(eventService.publishBatch(events))
                .rejects
                .toThrow('Failed to publish batch events');
        });
    });
    (0, globals_1.describe)('error handling', () => {
        (0, globals_1.it)('deve tratar erros de parsing de JSON', async () => {
            // Arrange
            const eventType = EventType_1.EventType.USER_CREATED;
            const handler = globals_1.jest.fn();
            const invalidJson = 'invalid-json';
            // Act
            await eventService.subscribe(eventType, handler);
            const messageHandler = mockSubscriber.on.mock.calls[0][1];
            messageHandler(`event:${eventType}`, invalidJson);
            // Assert
            (0, globals_1.expect)(handler).not.toHaveBeenCalled();
        });
        (0, globals_1.it)('deve tratar erros de handler', async () => {
            // Arrange
            const eventType = EventType_1.EventType.USER_CREATED;
            const handler = globals_1.jest.fn().mockRejectedValue(new Error('Handler error'));
            const eventPayload = {
                userId: '123',
                timestamp: new Date().toISOString()
            };
            // Act
            await eventService.subscribe(eventType, handler);
            const messageHandler = mockSubscriber.on.mock.calls[0][1];
            messageHandler(`event:${eventType}`, JSON.stringify(eventPayload));
            // Assert
            (0, globals_1.expect)(handler).toHaveBeenCalledWith(eventPayload);
        });
    });
});
