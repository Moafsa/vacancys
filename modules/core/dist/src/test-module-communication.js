"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleClient_1 = require("./infrastructure/communication/ModuleClient");
async function testModuleCommunication() {
    try {
        const projectsClient = new ModuleClient_1.ModuleClient({
            sourceModule: 'core',
            targetModule: 'projects',
            baseURL: 'http://localhost:3000'
        });
        console.log('Tentando comunicação com o módulo projects...');
        const health = await projectsClient.get('/health');
        console.log('Health check response:', health);
        const testResponse = await projectsClient.get('/test');
        console.log('Test response:', testResponse);
        console.log('Teste de comunicação concluído com sucesso!');
    }
    catch (error) {
        console.error('Erro no teste de comunicação:', error);
    }
}
testModuleCommunication();
//# sourceMappingURL=test-module-communication.js.map