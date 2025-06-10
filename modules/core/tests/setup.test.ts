// Arquivo de configuração para o jest
process.env.TS_JEST_DISABLE_VER_CHECKER = "true";

// Definir timeout para testes (10 segundos)
jest.setTimeout(10000);

// Desabilitar logs durante os testes, exceto se DEBUG estiver habilitado
if (!process.env.DEBUG) {
  // Suprimir logs durante os testes
  console.log = jest.fn();
  console.debug = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  // Manter erro visível
  // console.error = jest.fn();
}

// Limpar todos os mocks automaticamente entre testes
beforeEach(() => {
  jest.clearAllMocks();
});

// Restaurar todos os mocks após cada arquivo de teste
afterAll(() => {
  jest.restoreAllMocks();
});

// Aumentar timeout para operações assíncronas em testes de integração
if (process.env.JEST_PROJECT === 'integration') {
  jest.setTimeout(15000);
} 