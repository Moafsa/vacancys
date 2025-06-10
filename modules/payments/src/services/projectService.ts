import { ModuleClient } from '../../../core/src/infrastructure/communication/ModuleClient';
import { config } from '../config';

interface Project {
  id: string;
  title: string;
  status: string;
}

interface PaymentUpdate {
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

class ProjectService {
  private projectsClient: ModuleClient;

  constructor() {
    this.projectsClient = new ModuleClient({
      sourceModule: 'payments',
      targetModule: 'projects',
      baseURL: config.projectsServiceUrl // e.g. 'http://localhost:3001'
    });
  }

  /**
   * Busca detalhes de um projeto
   */
  async getProject(projectId: string): Promise<Project> {
    try {
      return await this.projectsClient.get<Project>(`/api/projects/${projectId}`);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      throw new Error(`Failed to fetch project ${projectId}`);
    }
  }

  /**
   * Atualiza o status de pagamento de um projeto
   */
  async updateProjectPayment(projectId: string, paymentUpdate: PaymentUpdate): Promise<void> {
    try {
      await this.projectsClient.post(`/api/projects/${projectId}/payment`, paymentUpdate);
    } catch (error) {
      console.error('Failed to update project payment:', error);
      throw new Error(`Failed to update payment for project ${projectId}`);
    }
  }
}

export const projectService = new ProjectService(); 