import axios, { AxiosInstance } from 'axios';
import { ModuleRegistry } from './types';

export class ModuleClient {
  private registry: ModuleRegistry;
  private axiosInstance: AxiosInstance;

  constructor(registry: ModuleRegistry) {
    this.registry = registry;
    this.axiosInstance = axios.create({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async callEndpoint(moduleName: string, endpointKey: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) {
    const url = this.registry.getEndpoint(moduleName, endpointKey);
    
    try {
      const response = await this.axiosInstance({
        method,
        url,
        data
      });
      return response.data;
    } catch (error) {
      console.error(`Error calling ${moduleName} endpoint ${endpointKey}:`, error);
      throw error;
    }
  }

  async get(moduleName: string, endpointKey: string) {
    return this.callEndpoint(moduleName, endpointKey, 'GET');
  }

  async post(moduleName: string, endpointKey: string, data: any) {
    return this.callEndpoint(moduleName, endpointKey, 'POST', data);
  }

  async put(moduleName: string, endpointKey: string, data: any) {
    return this.callEndpoint(moduleName, endpointKey, 'PUT', data);
  }

  async delete(moduleName: string, endpointKey: string) {
    return this.callEndpoint(moduleName, endpointKey, 'DELETE');
  }
} 