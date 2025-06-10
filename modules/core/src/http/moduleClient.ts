import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders } from 'axios';
import { serviceAuth } from '../auth/serviceAuth';

interface ModuleClientConfig {
  moduleId: string;
  baseURL: string;
  permissions: string[];
}

export class ModuleClient {
  private readonly client: AxiosInstance;
  private readonly moduleId: string;
  private readonly permissions: string[];

  constructor(config: ModuleClientConfig) {
    this.moduleId = config.moduleId;
    this.permissions = config.permissions;

    this.client = axios.create({
      baseURL: config.baseURL,
      headers: new AxiosHeaders({
        'Content-Type': 'application/json'
      })
    });

    // Add service token to all requests
    this.client.interceptors.request.use((config) => {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      
      config.headers.set('x-service-token', serviceAuth.generateServiceToken(
        this.moduleId,
        this.permissions,
        3600
      ));
      
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
const userModuleClient = new ModuleClient({
  moduleId: 'vacancy-module',
  baseURL: 'http://localhost:3001',
  permissions: ['user.read', 'user.write']
});

const users = await userModuleClient.get('/users');
*/ 