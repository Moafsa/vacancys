import { DeadLetterQueue } from '../DeadLetterQueue';

describe('DeadLetterQueue', () => {
  let dlq: DeadLetterQueue;
  const maxSize = 2;
  const messageId = 'test-id';
  const message = { data: 'test' };
  const error = new Error('Test error');
  const retryCount = 3;
  const originalQueue = 'test-queue';

  beforeEach(() => {
    dlq = new DeadLetterQueue(maxSize);
  });

  describe('constructor', () => {
    it('should use default maxSize when not provided', () => {
      const defaultDlq = new DeadLetterQueue();
      expect(defaultDlq.getSize()).toBe(0);
    });

    it('should use provided maxSize', () => {
      expect(dlq.getSize()).toBe(0);
    });
  });

  describe('addMessage', () => {
    it('should add message successfully', async () => {
      await dlq.addMessage(messageId, message, error, retryCount, originalQueue);
      
      const storedMessage = await dlq.getMessage(messageId);
      expect(storedMessage).toBeDefined();
      expect(storedMessage?.message).toEqual(message);
      expect(storedMessage?.error).toBe(error.message);
      expect(storedMessage?.retryCount).toBe(retryCount);
      expect(storedMessage?.originalQueue).toBe(originalQueue);
      expect(storedMessage?.timestamp).toBeInstanceOf(Date);
    });

    it('should remove oldest message when queue is full', async () => {
      const firstId = 'first';
      const secondId = 'second';
      const thirdId = 'third';

      await dlq.addMessage(firstId, message, error, retryCount, originalQueue);
      await dlq.addMessage(secondId, message, error, retryCount, originalQueue);
      await dlq.addMessage(thirdId, message, error, retryCount, originalQueue);

      expect(await dlq.getMessage(firstId)).toBeUndefined();
      expect(await dlq.getMessage(secondId)).toBeDefined();
      expect(await dlq.getMessage(thirdId)).toBeDefined();
      expect(dlq.getSize()).toBe(maxSize);
    });
  });

  describe('getMessage', () => {
    it('should return undefined for non-existent message', async () => {
      expect(await dlq.getMessage('non-existent')).toBeUndefined();
    });

    it('should return message for existing id', async () => {
      await dlq.addMessage(messageId, message, error, retryCount, originalQueue);
      
      const storedMessage = await dlq.getMessage(messageId);
      expect(storedMessage).toBeDefined();
      expect(storedMessage?.message).toEqual(message);
    });
  });

  describe('getAllMessages', () => {
    it('should return empty array when queue is empty', async () => {
      const messages = await dlq.getAllMessages();
      expect(messages).toEqual([]);
    });

    it('should return all messages in queue', async () => {
      await dlq.addMessage('id1', message, error, retryCount, originalQueue);
      await dlq.addMessage('id2', message, error, retryCount, originalQueue);

      const messages = await dlq.getAllMessages();
      expect(messages).toHaveLength(2);
      expect(messages[0].message).toEqual(message);
      expect(messages[1].message).toEqual(message);
    });
  });

  describe('removeMessage', () => {
    it('should return false when removing non-existent message', async () => {
      expect(await dlq.removeMessage('non-existent')).toBe(false);
    });

    it('should remove existing message and return true', async () => {
      await dlq.addMessage(messageId, message, error, retryCount, originalQueue);
      
      expect(await dlq.removeMessage(messageId)).toBe(true);
      expect(await dlq.getMessage(messageId)).toBeUndefined();
    });
  });

  describe('retryMessage', () => {
    it('should return undefined for non-existent message', async () => {
      expect(await dlq.retryMessage('non-existent')).toBeUndefined();
    });

    it('should remove and return message for retry', async () => {
      await dlq.addMessage(messageId, message, error, retryCount, originalQueue);
      
      const retryMessage = await dlq.retryMessage(messageId);
      expect(retryMessage).toBeDefined();
      expect(retryMessage?.message).toEqual(message);
      expect(await dlq.getMessage(messageId)).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should remove all messages', async () => {
      await dlq.addMessage('id1', message, error, retryCount, originalQueue);
      await dlq.addMessage('id2', message, error, retryCount, originalQueue);
      
      await dlq.clear();
      expect(dlq.getSize()).toBe(0);
      expect(await dlq.getAllMessages()).toEqual([]);
    });
  });

  describe('getSize', () => {
    it('should return correct size', async () => {
      expect(dlq.getSize()).toBe(0);
      
      await dlq.addMessage(messageId, message, error, retryCount, originalQueue);
      expect(dlq.getSize()).toBe(1);
      
      await dlq.removeMessage(messageId);
      expect(dlq.getSize()).toBe(0);
    });
  });
}); 