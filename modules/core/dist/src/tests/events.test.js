"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const RedisEventService_1 = require("../infrastructure/messaging/RedisEventService");
const UserRole_1 = require("../domain/entities/UserRole");
const UserStatus_1 = require("../domain/entities/UserStatus");
(0, globals_1.describe)('RedisEventService', () => {
    let eventService;
    let mockHandler;
    const fixedDate = new Date('2025-03-25T02:15:10.686Z');
    (0, globals_1.beforeEach)(async () => {
        mockHandler = {
            handle: globals_1.jest.fn(),
            eventType: 'USER_CREATED'
        };
        eventService = new RedisEventService_1.RedisEventService();
        await eventService.connect();
    });
    (0, globals_1.afterEach)(async () => {
        await eventService.disconnect();
    });
    (0, globals_1.it)('deve publicar e receber eventos', async () => {
        const event = {
            type: 'USER_CREATED',
            payload: {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.PENDING,
                createdAt: fixedDate,
                updatedAt: fixedDate
            },
            createdAt: fixedDate
        };
        await eventService.subscribe('USER_CREATED', mockHandler);
        await eventService.publish(event);
        await new Promise(resolve => setTimeout(resolve, 100));
        (0, globals_1.expect)(mockHandler.handle).toHaveBeenCalledWith({
            type: 'USER_CREATED',
            payload: {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.PENDING,
                createdAt: fixedDate.toISOString(),
                updatedAt: fixedDate.toISOString()
            },
            createdAt: fixedDate.toISOString()
        });
    });
    (0, globals_1.it)('deve ignorar eventos de tipos diferentes', async () => {
        const event = {
            type: 'USER_UPDATED',
            payload: {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: UserRole_1.UserRole.USER,
                status: UserStatus_1.UserStatus.ACTIVE,
                createdAt: fixedDate,
                updatedAt: fixedDate
            },
            createdAt: fixedDate
        };
        await eventService.subscribe('USER_CREATED', mockHandler);
        await eventService.publish(event);
        await new Promise(resolve => setTimeout(resolve, 100));
        (0, globals_1.expect)(mockHandler.handle).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=events.test.js.map