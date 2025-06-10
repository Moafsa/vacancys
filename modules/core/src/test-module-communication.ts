import { ModuleClient } from './infrastructure/communication/ModuleClient';

async function testModuleCommunication() {
  try {
    const projectsClient = new ModuleClient({
      sourceModule: 'core',
      targetModule: 'projects',
      baseURL: 'http://localhost:3000' // porta do módulo projects
    });

    console.log('Tentando comunicação com o módulo projects...');

    // Primeiro testa o health check (não requer autenticação)
    const health = await projectsClient.get('/health');
    console.log('Health check response:', health);

    // Testa a rota que requer autenticação
    const testResponse = await projectsClient.get('/test');
    console.log('Test response:', testResponse);

    console.log('Teste de comunicação concluído com sucesso!');
  } catch (error) {
    console.error('Erro no teste de comunicação:', error);
  }
}

// Executa o teste
testModuleCommunication(); 