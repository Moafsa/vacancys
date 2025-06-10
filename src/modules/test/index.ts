import { ModuleDefinition } from '../../core/ModuleRegistry';

// Action handler de teste
async function testAction(data: any) {
  console.log('Test action executada com dados:', data);
  return { success: true, data };
}

// Filter handler de teste
function testFilter(value: any) {
  console.log('Test filter executado com valor:', value);
  return `${value}-modificado`;
}

// Módulo de teste
export const testModule: ModuleDefinition = {
  name: 'test',
  version: '1.0.0',
  description: 'Módulo de teste para verificar o sistema de plugins',
  actions: [
    {
      name: 'test.action',
      handler: testAction
    }
  ],
  filters: [
    {
      name: 'test.filter',
      handler: testFilter
    }
  ]
}; 