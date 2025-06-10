export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000,   // 30 seconds
  backoffFactor: 2
};

export class RetryManager {
  private readonly config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    if (config.maxAttempts !== undefined && config.maxAttempts <= 0) {
      throw new Error('maxAttempts must be greater than 0');
    }
    if (config.initialDelay !== undefined && config.initialDelay < 0) {
      throw new Error('initialDelay must be greater than or equal to 0');
    }
    if (config.maxDelay !== undefined && config.maxDelay < config.initialDelay) {
      throw new Error('maxDelay must be greater than or equal to initialDelay');
    }
    if (config.backoffFactor !== undefined && config.backoffFactor <= 1) {
      throw new Error('backoffFactor must be greater than 1');
    }
    
    this.config = { ...DEFAULT_RETRY_CONFIG, ...config };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (!operation || typeof operation !== 'function') {
      throw new Error('Operation must be a function');
    }

    let attempt = 1;
    let delay = this.config.initialDelay;

    while (attempt <= this.config.maxAttempts) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === this.config.maxAttempts) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`Operation failed after ${attempt} attempts. Last error: ${errorMessage}`);
        }

        await this.wait(delay);
        delay = Math.min(delay * this.config.backoffFactor, this.config.maxDelay);
        attempt++;
      }
    }

    throw new Error('Unexpected error: Maximum attempts reached without resolution');
  }

  private wait(ms: number): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return Promise.resolve();
    }
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getConfig(): RetryConfig {
    return { ...this.config };
  }
} 