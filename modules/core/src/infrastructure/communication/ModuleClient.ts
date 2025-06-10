import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders } from 'axios';
import { moduleRegistry } from './ModuleRegistry';

interface ModuleClientConfig {
  sourceModule: string;
  targetModule: string;
  baseURL: string;
}

export class ModuleClient {
  private readonly client: AxiosInstance;
  private readonly sourceModule: string;
  private readonly targetModule: string;
  private readonly moduleToken: string;

  constructor(config: ModuleClientConfig) {
    this.sourceModule = config.sourceModule;
    this.targetModule = config.targetModule;

    const token = moduleRegistry.getModuleToken(this.sourceModule);
    if (!token) {
      throw new Error(`Module ${this.sourceModule} not registered`);
    }
    this.moduleToken = token;

    // Validate if communication is allowed
    const isAllowed = moduleRegistry.validateCommunication(
      this.sourceModule,
      this.targetModule,
      this.moduleToken
    );

    if (!isAllowed) {
      throw new Error(
        `Module ${this.sourceModule} is not allowed to communicate with ${this.targetModule}`
      );
    }

    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('x-source-module', this.sourceModule);
    headers.set('x-target-module', this.targetModule);
    headers.set('x-module-token', this.moduleToken);

    this.client = axios.create({
      baseURL: config.baseURL,
      headers
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use((config) => {
      if (!config.headers) {
        const headers = new AxiosHeaders();
        headers.set('Content-Type', 'application/json');
        headers.set('x-source-module', this.sourceModule);
        headers.set('x-target-module', this.targetModule);
        headers.set('x-module-token', this.moduleToken);
        config.headers = headers;
      }
      
      console.log(`[ModuleClient] ${this.sourceModule} -> ${this.targetModule}:`, {
        method: config.method,
        url: config.url
      });
      return config;
    });
  }

  /**
   * Make a GET request to another module
   */
  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(path, config);
    return response.data;
  }

  /**
   * Make a POST request to another module
   */
  async post<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(path, data, config);
    return response.data;
  }

  /**
   * Make a PUT request to another module
   */
  async put<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(path, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request to another module
   */
  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(path, config);
    return response.data;
  }
}

// Example usage:
/*
const projectsClient = new ModuleClient({
  sourceModule: 'payments',
  targetModule: 'projects',
  baseURL: 'http://localhost:3001'
});

const project = await projectsClient.get('/api/projects/123');
*/ 