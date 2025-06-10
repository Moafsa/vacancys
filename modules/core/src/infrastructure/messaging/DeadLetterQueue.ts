interface DeadLetterMessage {
  message: any;
  error: string;
  timestamp: Date;
  retryCount: number;
  originalQueue: string;
}

export class DeadLetterQueue {
  private messages: Map<string, DeadLetterMessage>;
  private readonly maxSize: number;

  constructor(maxSize: number = 1000) {
    this.messages = new Map();
    this.maxSize = maxSize;
  }

  async addMessage(
    messageId: string,
    message: any,
    error: Error,
    retryCount: number,
    originalQueue: string
  ): Promise<void> {
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

  async getMessage(messageId: string): Promise<DeadLetterMessage | undefined> {
    return this.messages.get(messageId);
  }

  async getAllMessages(): Promise<DeadLetterMessage[]> {
    return Array.from(this.messages.values());
  }

  async removeMessage(messageId: string): Promise<boolean> {
    return this.messages.delete(messageId);
  }

  async retryMessage(messageId: string): Promise<DeadLetterMessage | undefined> {
    const message = this.messages.get(messageId);
    if (message) {
      this.messages.delete(messageId);
    }
    return message;
  }

  async clear(): Promise<void> {
    this.messages.clear();
  }

  getSize(): number {
    return this.messages.size;
  }
} 