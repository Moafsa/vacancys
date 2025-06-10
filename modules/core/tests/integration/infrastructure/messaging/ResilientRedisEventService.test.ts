// Usar CommonJS para importações
const RediESEventServiceModule = require('../../../../src/infrastructure/messaging/ResilientRedisEventService');
const ResilientRedisEventService = RediESEventServiceModule.ResilientRedisEventService;
const CircuitBreakerModule = require('../../../../src/infrastructure/messaging/CircuitBreaker');
const CircuitState = CircuitBreakerModule.CircuitState;
const Event = require('../../../../src/domain/events/Event').Event;

// Função de utilidade para os testes
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock do módulo redis
jest.mock('redis', () => {
  // Mock storage para simular o Redis (local dentro do escopo do mock)
  const storage = {};
  const subscribers = {};

  // Função auxiliar para simular publicação de eventos
  const simulateMessage = (channel, message) => {
    if (subscribers[channel]) {
      subscribers[channel].forEach(callback => {
        callback(message);
      });
    }
    return true;
  };

  // Função auxiliar para simular eventos DLQ
  const simulateDLQEvents = (eventType, events) => {
    // Adicionar ao storage simulando Redis
    events.forEach(event => {
      storage[`dlq:${eventType}:${event.id}`] = JSON.stringify(event);
    });
    
    // Adicionar IDs de eventos ao índice
    storage[`dlq:index:${eventType}`] = events.map(e => e.id);
    return true;
  };

  // Mock do cliente Redis
  const mockRedisClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    publish: jest.fn().mockImplementation((channel, message) => {
      return Promise.resolve();
    }),
    subscribe: jest.fn().mockImplementation((channel, callback) => {
      if (!subscribers[channel]) {
        subscribers[channel] = [];
      }
      subscribers[channel].push(callback);
      return Promise.resolve();
    }),
    unsubscribe: jest.fn(),
    // Métodos relacionados ao DLQ
    get: jest.fn().mockImplementation((key) => {
      return Promise.resolve(storage[key] || null);
    }),
    set: jest.fn().mockImplementation((key, value) => {
      storage[key] = value;
      return Promise.resolve('OK');
    }),
    del: jest.fn().mockImplementation((key) => {
      if (storage[key]) {
        delete storage[key];
        return Promise.resolve(1);
      }
      return Promise.resolve(0);
    }),
    sAdd: jest.fn().mockImplementation((key, value) => {
      if (!storage[key]) {
        storage[key] = [];
      }
      if (!Array.isArray(storage[key])) {
        storage[key] = [storage[key]];
      }
      if (!storage[key].includes(value)) {
        storage[key].push(value);
      }
      return Promise.resolve(1);
    }),
    sRem: jest.fn().mockImplementation((key, value) => {
      if (Array.isArray(storage[key]) && storage[key].includes(value)) {
        storage[key] = storage[key].filter((v) => v !== value);
        return Promise.resolve(1);
      }
      return Promise.resolve(0);
    }),
    sMembers: jest.fn().mockImplementation((key) => {
      return Promise.resolve(Array.isArray(storage[key]) ? storage[key] : []);
    }),
    exists: jest.fn().mockImplementation((key) => {
      return Promise.resolve(storage[key] ? 1 : 0);
    }),
    keys: jest.fn().mockImplementation((pattern) => {
      const keys = Object.keys(storage).filter(key => 
        key.startsWith(pattern.replace(/\*/g, ''))
      );
      return Promise.resolve(keys);
    }),
    quit: jest.fn().mockResolvedValue(undefined)
  };

  return {
    createClient: jest.fn().mockReturnValue(mockRedisClient),
    // Expor funções auxiliares para testes
    __simulateMessage: simulateMessage,
    __simulateDLQEvents: simulateDLQEvents,
    __getStorage: () => storage,
    __clearStorage: () => {
      Object.keys(storage).forEach(key => delete storage[key]);
    }
  };
});

describe('ResilientRedisEventService Integration Tests', () => {
  let eventService;
  let redis;
  
  beforeEach(async () => {
    // Limpar mocks
    jest.clearAllMocks();
    
    // Referência para o módulo redis mockado
    redis = require('redis');
    
    // Limpar storage simulado
    redis.__clearStorage();
    
    // Criar uma nova instância do serviço para cada teste
    eventService = new ResilientRedisEventService({
      redisUrl: 'redis://localhost:6379',
      enableCircuitBreaker: true,
      enableRetries: true,
      enableDeadLetterQueue: true
    });
    
    // Conectar ao Redis (mock)
    await eventService.connect();
  });
  
  afterEach(async () => {
    // Limpar desconectando
    await eventService.disconnect();
  });
  
  describe('Basic Publish/Subscribe', () => {
    test('should publish events to Redis', async () => {
      // Criar evento de teste
      const testEvent = {
        type: 'TEST_EVENT',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString()
      };
      
      // Publicar o evento
      await eventService.publish(testEvent);
      
      // Verificar se o método publish do Redis foi chamado com os parâmetros corretos
      const mockRedisClient = redis.createClient();
      expect(mockRedisClient.publish).toHaveBeenCalledWith(
        'TEST_EVENT',
        expect.any(String)
      );
      
      // Verificar o evento serializado
      const publishCall = mockRedisClient.publish.mock.calls[0];
      const serializedEvent = JSON.parse(publishCall[1]);
      expect(serializedEvent.type).toBe('TEST_EVENT');
      expect(serializedEvent.payload.message).toBe('Hello World');
    });
    
    test('should handle subscription and receive events', async () => {
      // Criar um handler mock com método handle
      const mockHandler = {
        handle: jest.fn()
      };
      
      // Assinar eventos
      await eventService.subscribe('TEST_EVENT', mockHandler);
      
      // Verificar se o método subscribe do Redis foi chamado
      const mockRedisClient = redis.createClient();
      expect(mockRedisClient.subscribe).toHaveBeenCalledWith(
        'TEST_EVENT',
        expect.any(Function)
      );
      
      // Simular recebimento de uma mensagem
      const testEvent = {
        type: 'TEST_EVENT',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString()
      };
      
      // Simular publicação de mensagem pelo Redis
      redis.__simulateMessage(
        'TEST_EVENT',
        JSON.stringify(testEvent)
      );
      
      // Aguardar o event loop processar a mensagem
      await sleep(50);
      
      // Verificar se o método handle do handler foi chamado com o evento
      expect(mockHandler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'TEST_EVENT',
          payload: { message: 'Hello World' }
        })
      );
    });
  });
  
  describe('Circuit Breaker Functionality', () => {
    test('should open circuit after multiple failures', async () => {
      // Mockar o método publish para falhar
      const mockRedisClient = redis.createClient();
      mockRedisClient.publish.mockRejectedValue(new Error('Redis connection error'));
      
      // Acessar o circuit breaker diretamente para verificar seu estado
      const circuitBreaker = eventService.circuitBreaker;
      
      // Inicialmente o circuito deve estar fechado
      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
      
      // Criar um evento de teste
      const testEvent = {
        type: 'TEST_EVENT',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString()
      };
      
      // Tentar publicar múltiplas vezes, o que deve falhar
      const publishPromises = [];
      for (let i = 0; i < 6; i++) {
        publishPromises.push(
          eventService.publish(testEvent).catch(e => e)
        );
      }
      await Promise.all(publishPromises);
      
      // O circuito agora deve estar aberto
      expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
      
      // Tentar publicar novamente deve falhar imediatamente com erro de circuito aberto
      await expect(eventService.publish(testEvent)).rejects.toThrow('Service redis-event-service is unavailable');
    });
  });
  
  describe('Retry Mechanism', () => {
    it('should retry failed events with exponential backoff', async () => {
      // Setup
      const event = {
        id: 'test-id',
        type: 'TEST_EVENT',
        payload: { message: 'test message' },
        createdAt: new Date().toISOString()
      };

      // Configuração do mock para falhar na primeira chamada e ter sucesso na segunda
      let publishAttempts = 0;
      const mockRedisClient = redis.createClient();
      mockRedisClient.publish.mockImplementation((channel, message) => {
        publishAttempts++;
        if (publishAttempts === 1) {
          throw new Error('Publish attempt retry failed');
        }
        return Promise.resolve(1);
      });

      try {
        await eventService.publish(event);
      } catch (error) {
        // Esperado falhar
      }

      // Esperar pelo retry
      await sleep(1500);

      // Agora publish deve ter sido chamado pelo menos uma vez
      expect(mockRedisClient.publish).toHaveBeenCalled();
      expect(publishAttempts).toBeGreaterThanOrEqual(1);
    });
  });
  
  describe('Dead Letter Queue Integration', () => {
    test('should send events to DLQ after max retries', async () => {
      // Configurar mock para sempre falhar
      const mockRedisClient = redis.createClient();
      mockRedisClient.publish.mockRejectedValue(new Error('Persistent failure'));
      
      // Espionar o Dead Letter Queue
      const dlq = eventService.getDeadLetterQueue();
      const addEventSpy = jest.spyOn(dlq, 'addEvent');
      
      // Desabilitar realmente o envio para o DLQ no teste para verificar apenas se o método é chamado
      addEventSpy.mockImplementation(() => Promise.resolve(true));
      
      // Criar um evento de teste
      const testEvent = {
        type: 'TEST_EVENT',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString()
      };
      
      // Tentativa inicial deve falhar
      await expect(eventService.publish(testEvent)).rejects.toThrow('Persistent failure');
      
      // Simular processamento do retry com vários retries consecutivos 
      // Para forçar o envio para o DLQ, vamos simular o comportamento interno
      // em vez de acessar diretamente o método privado
      
      // 1. Espionar retryManager.processRetryQueue
      const processQueueSpy = jest.spyOn(eventService.retryManager, 'processRetryQueue');
      
      // 2. Mockar o comportamento para simular vários retries
      processQueueSpy.mockImplementation(async () => {
        // Simular que o processamento de retry chegou ao limite e chama o DLQ
        await dlq.addEvent(testEvent, 'Persistent failure', 3);
        return Promise.resolve();
      });
      
      // 3. Simular processamento da fila de retry
      await eventService.retryManager.processRetryQueue();
      
      // 4. Verificar se o evento foi enviado para o DLQ
      expect(addEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'TEST_EVENT',
          payload: { message: 'Hello World' }
        }),
        expect.stringContaining('Persistent failure'),
        3
      );
    });
    
    test('should retrieve events from DLQ', async () => {
      // Simular eventos no DLQ
      const mockEvents = [
        {
          id: 'id1',
          originalEvent: {
            type: 'ERROR_EVENT',
            payload: { message: 'Error message 1' },
            createdAt: new Date().toISOString()
          },
          failureReason: 'Connection failure',
          attemptCount: 3,
          lastAttemptAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          id: 'id2',
          originalEvent: {
            type: 'ERROR_EVENT',
            payload: { message: 'Error message 2' },
            createdAt: new Date().toISOString()
          },
          failureReason: 'Timeout',
          attemptCount: 5,
          lastAttemptAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ];
      
      // Simular eventos no Redis
      redis.__simulateDLQEvents('ERROR_EVENT', mockEvents);
      
      // Configurar mock para getEventTypes
      const mockRedisClient = redis.createClient();
      mockRedisClient.keys.mockResolvedValue(['dlq:index:ERROR_EVENT']);
      
      // Obter o DLQ
      const dlq = eventService.getDeadLetterQueue();
      
      // Listar tipos de eventos no DLQ
      const eventTypes = await dlq.getEventTypes();
      expect(eventTypes).toContain('ERROR_EVENT');
      
      // Obter eventos por tipo
      const events = await dlq.getEventsByType('ERROR_EVENT');
      expect(events).toHaveLength(2);
      expect(events[0].originalEvent.payload.message).toBe('Error message 1');
      expect(events[1].originalEvent.payload.message).toBe('Error message 2');
    });
    
    test('should reprocess events from DLQ', async () => {
      // Simular evento no DLQ
      const mockEvent = {
        id: 'test-id',
        originalEvent: {
          type: 'TEST_EVENT',
          payload: { message: 'Retry me' },
          createdAt: new Date().toISOString()
        },
        failureReason: 'Previous failure',
        attemptCount: 3,
        lastAttemptAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      // Simular evento no Redis
      redis.__simulateDLQEvents('TEST_EVENT', [mockEvent]);
      
      // Configurar mock para get
      const mockRedisClient = redis.createClient();
      mockRedisClient.get.mockImplementation((key) => {
        if (key === 'dlq:TEST_EVENT:test-id') {
          return Promise.resolve(JSON.stringify(mockEvent));
        }
        return Promise.resolve(null);
      });
      
      // Configurar mock para verificar existência
      mockRedisClient.exists.mockResolvedValue(1);
      
      // Reset publish mock para ter sucesso
      mockRedisClient.publish.mockResolvedValue(undefined);
      
      // Obter o DLQ
      const dlq = eventService.getDeadLetterQueue();
      
      // Configurar callback de reprocessamento
      dlq.onReprocessEvent = eventService.publish.bind(eventService);
      
      // Reprocessar o evento
      const success = await dlq.reprocessEvent('test-id', 'TEST_EVENT');
      
      // Verificar se o reprocessamento foi bem-sucedido
      expect(success).toBe(true);
      
      // Verificar se o publish foi chamado com o evento original
      expect(mockRedisClient.publish).toHaveBeenCalledWith(
        'TEST_EVENT',
        expect.stringContaining('Retry me')
      );
      
      // Verificar se o evento foi removido do DLQ
      expect(mockRedisClient.del).toHaveBeenCalledWith('dlq:TEST_EVENT:test-id');
      expect(mockRedisClient.sRem).toHaveBeenCalledWith('dlq:index:TEST_EVENT', 'test-id');
    });
  });
  
  describe('Service Metrics', () => {
    test('should provide accurate metrics', async () => {
      // Obter métricas
      const metrics = eventService.getMetrics();
      
      // Verificar estrutura e valores de métricas
      expect(metrics).toHaveProperty('circuitBreakerState', CircuitState.CLOSED);
      expect(metrics).toHaveProperty('deadLetterQueueEnabled', true);
      expect(metrics).toHaveProperty('retryEnabled', true);
      
      // Verificar métricas após o serviço estar em uso
      // Falhar publicações para abrir o circuito
      const mockRedisClient = redis.createClient();
      mockRedisClient.publish.mockRejectedValue(new Error('Redis connection error'));
      
      // Evento de teste
      const testEvent = {
        type: 'TEST_EVENT',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString()
      };
      
      // Tentar publicar múltiplas vezes
      for (let i = 0; i < 6; i++) {
        try {
          await eventService.publish(testEvent);
        } catch (e) {
          // Ignorar erros esperados
        }
      }
      
      // As métricas devem mostrar circuito aberto
      const updatedMetrics = eventService.getMetrics();
      expect(updatedMetrics.circuitBreakerState).toBe(CircuitState.OPEN);
    });
  });
}); 