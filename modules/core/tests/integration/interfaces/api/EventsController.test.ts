const EventsControllerModule = require('../../../../src/interfaces/api/EventsController');
const EventsController = EventsControllerModule.EventsController;
const CircuitBreakerModule = require('../../../../src/infrastructure/messaging/CircuitBreaker');
const CircuitState = CircuitBreakerModule.CircuitState;

// Mock do módulo de mensageria
jest.mock('../../../../src/infrastructure/messaging', () => {
  const mockDeadLetterQueue = {
    getEventTypes: jest.fn(),
    getEventsByType: jest.fn(),
    reprocessEvent: jest.fn(),
    purgeEventsByType: jest.fn(),
  };
  
  const mockEventService = {
    getMetrics: jest.fn(),
    getDeadLetterQueue: jest.fn().mockReturnValue(mockDeadLetterQueue),
  };
  
  return {
    eventService: mockEventService,
    DeadLetterQueue: jest.fn().mockImplementation(() => mockDeadLetterQueue),
    ResilientRedisEventService: jest.fn().mockImplementation(() => mockEventService),
  };
});

describe('EventsController Integration Tests', () => {
  let controller;
  let req;
  let res;
  let eventService;
  let deadLetterQueue;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Set up controller
    controller = new EventsController();
    
    // Set up request/response mocks
    req = {
      params: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    // Get mocked services
    eventService = require('../../../../src/infrastructure/messaging').eventService;
    deadLetterQueue = eventService.getDeadLetterQueue();
  });
  
  describe('getMetrics', () => {
    test('should return metrics data', async () => {
      // Set up mock data
      const mockMetrics = {
        circuitBreakerState: CircuitState.CLOSED,
        deadLetterQueueEnabled: true,
        retryEnabled: true
      };
      
      eventService.getMetrics.mockReturnValue(mockMetrics);
      
      // Call the controller method
      await controller.getMetrics(req, res);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockMetrics
      });
    });
    
    test('should handle errors', async () => {
      // Set up mock error
      eventService.getMetrics.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      // Call the controller method
      await controller.getMetrics(req, res);
      
      // Verify error response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Failed to get event service metrics'
      }));
    });
  });
  
  describe('getDeadLetterQueueEventTypes', () => {
    test('should return event types from DLQ', async () => {
      // Set up mock data
      const mockEventTypes = ['ERROR_EVENT', 'TIMEOUT_EVENT'];
      deadLetterQueue.getEventTypes.mockResolvedValue(mockEventTypes);
      
      // Call the controller method
      await controller.getDeadLetterQueueEventTypes(req, res);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          eventTypes: mockEventTypes,
          count: 2
        }
      });
    });
    
    test('should handle errors', async () => {
      // Set up mock error
      deadLetterQueue.getEventTypes.mockRejectedValue(new Error('Test error'));
      
      // Call the controller method
      await controller.getDeadLetterQueueEventTypes(req, res);
      
      // Verify error response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Failed to get Dead Letter Queue event types'
      }));
    });
  });
  
  describe('getDeadLetterQueueEvents', () => {
    test('should return events of a specific type from DLQ', async () => {
      // Set up mock data
      const mockEvents = [
        {
          id: '123',
          originalEvent: {
            type: 'ERROR_EVENT',
            payload: { message: 'Error occurred' },
            createdAt: new Date().toISOString()
          },
          failureReason: 'Test failure',
          attemptCount: 5,
          lastAttemptAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ];
      
      deadLetterQueue.getEventsByType.mockResolvedValue(mockEvents);
      
      // Set up request
      req.params = {
        eventType: 'ERROR_EVENT'
      };
      
      // Call the controller method
      await controller.getDeadLetterQueueEvents(req, res);
      
      // Verify response
      expect(deadLetterQueue.getEventsByType).toHaveBeenCalledWith('ERROR_EVENT');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          events: mockEvents,
          count: 1
        }
      });
    });
    
    test('should handle pagination correctly', async () => {
      // Create a larger set of mock events
      const mockEvents = Array.from({ length: 25 }, (_, i) => ({
        id: `event-${i}`,
        originalEvent: {
          type: 'ERROR_EVENT',
          payload: { message: `Error occurred ${i}` },
          createdAt: new Date().toISOString()
        },
        failureReason: 'Test failure',
        attemptCount: 5,
        lastAttemptAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }));
      
      deadLetterQueue.getEventsByType.mockResolvedValue(mockEvents);
      
      // Set up request with pagination
      req.params = {
        eventType: 'ERROR_EVENT'
      };
      req.pagination = {
        page: 2,
        limit: 10,
        skip: 10
      };
      
      // Call the controller method
      await controller.getDeadLetterQueueEvents(req, res);
      
      // Verify response includes pagination metadata and paginated results
      expect(deadLetterQueue.getEventsByType).toHaveBeenCalledWith('ERROR_EVENT');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          events: mockEvents.slice(10, 20),
          count: 10
        },
        pagination: {
          total: 25,
          page: 2,
          limit: 10,
          pages: 3,
          hasNext: true,
          hasPrev: true
        }
      });
    });
    
    test('should validate required parameters', async () => {
      // Call without eventType
      req.params = {};
      await controller.getDeadLetterQueueEvents(req, res);
      
      // Verify validation error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Event type is required'
      }));
    });
    
    test('should handle errors', async () => {
      // Set up mock error
      deadLetterQueue.getEventsByType.mockRejectedValue(new Error('Test error'));
      
      // Set up request
      req.params = {
        eventType: 'ERROR_EVENT'
      };
      
      // Call the controller method
      await controller.getDeadLetterQueueEvents(req, res);
      
      // Verify error response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Failed to get events from Dead Letter Queue'
      }));
    });
  });
  
  describe('reprocessDeadLetterQueueEvent', () => {
    test('should reprocess a specific event from DLQ', async () => {
      // Set up mock data
      deadLetterQueue.reprocessEvent.mockResolvedValue(true);
      
      // Set up request
      req.params = {
        eventType: 'ERROR_EVENT',
        eventId: '123'
      };
      
      // Call the controller method
      await controller.reprocessDeadLetterQueueEvent(req, res);
      
      // Verify response
      expect(deadLetterQueue.reprocessEvent).toHaveBeenCalledWith('123', 'ERROR_EVENT');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Event 123 reprocessed successfully'
      });
    });
    
    test('should handle event not found', async () => {
      // Set up mock data
      deadLetterQueue.reprocessEvent.mockResolvedValue(false);
      
      // Set up request
      req.params = {
        eventType: 'ERROR_EVENT',
        eventId: '123'
      };
      
      // Call the controller method
      await controller.reprocessDeadLetterQueueEvent(req, res);
      
      // Verify not found response
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Event 123 not found or reprocessing failed'
      }));
    });
    
    test('should validate required parameters', async () => {
      // Call without eventType
      req.params = {
        eventId: '123'
      };
      await controller.reprocessDeadLetterQueueEvent(req, res);
      
      // Verify validation error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Event type and event ID are required'
      });
      
      // Call without eventId
      req.params = {
        eventType: 'ERROR_EVENT'
      };
      await controller.reprocessDeadLetterQueueEvent(req, res);
      
      // Verify validation error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Event type and event ID are required'
      });
    });
    
    test('should handle errors', async () => {
      // Set up mock error
      deadLetterQueue.reprocessEvent.mockRejectedValue(new Error('Test error'));
      
      // Set up request
      req.params = {
        eventType: 'ERROR_EVENT',
        eventId: '123'
      };
      
      // Call the controller method
      await controller.reprocessDeadLetterQueueEvent(req, res);
      
      // Verify error response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Failed to reprocess event from Dead Letter Queue'
      }));
    });
  });
  
  describe('purgeDeadLetterQueueEvents', () => {
    test('should purge events of a specific type from DLQ', async () => {
      // Set up mock data
      deadLetterQueue.purgeEventsByType.mockResolvedValue(5);
      
      // Set up request
      req.params = {
        eventType: 'ERROR_EVENT'
      };
      
      // Call the controller method
      await controller.purgeDeadLetterQueueEvents(req, res);
      
      // Verify response
      expect(deadLetterQueue.purgeEventsByType).toHaveBeenCalledWith('ERROR_EVENT');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Purged 5 events of type ERROR_EVENT from Dead Letter Queue',
        data: {
          count: 5
        }
      });
    });
    
    test('should handle no events found', async () => {
      // Set up mock data
      deadLetterQueue.purgeEventsByType.mockResolvedValue(0);
      
      // Set up request
      req.params = {
        eventType: 'ERROR_EVENT'
      };
      
      // Call the controller method
      await controller.purgeDeadLetterQueueEvents(req, res);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Purged 0 events of type ERROR_EVENT from Dead Letter Queue',
        data: {
          count: 0
        }
      });
    });
    
    test('should validate required parameters', async () => {
      // Call without eventType
      req.params = {};
      await controller.purgeDeadLetterQueueEvents(req, res);
      
      // Verify validation error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Event type is required'
      }));
    });
    
    test('should handle errors', async () => {
      // Set up mock error
      deadLetterQueue.purgeEventsByType.mockRejectedValue(new Error('Test error'));
      
      // Set up request
      req.params = {
        eventType: 'ERROR_EVENT'
      };
      
      // Call the controller method
      await controller.purgeDeadLetterQueueEvents(req, res);
      
      // Verify error response
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Failed to purge events from Dead Letter Queue'
      }));
    });
  });
}); 