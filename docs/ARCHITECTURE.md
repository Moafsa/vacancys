# Arquitetura do Sistema

## Visão Geral

O sistema utiliza uma arquitetura baseada em plugins, inspirada no WordPress, onde cada funcionalidade é um módulo independente que pode ser facilmente adicionado ou removido. **Todos os módulos, são plugáveis e não sobem servidor próprio**. O site principal (raiz) é o host, responsável por orquestrar, registrar hooks/actions e montar rotas HTTP.

## Sistema de Módulos

### Conceito
Similar ao WordPress, nosso sistema utiliza:
- **Actions**: Pontos de extensão onde módulos podem executar código
- **Filters**: Funções que podem modificar dados durante o processamento
- **Hooks**: Combinação de actions e filters que permitem extensibilidade

### Estrutura de um Módulo

```typescript
// Exemplo de definição de módulo plugável
export function registerCoreHooks(app) {
  // Registra actions e filters do core
}

export { AuthService } from './application/services/AuthService';
// ...outros exports
```

### Exemplo de Integração no Site Principal

```typescript
import express from 'express';
import { AuthService, registerCoreHooks } from '../../modules/core';
import { registerProposalHooks } from '../../modules/proposals'; // futuro

const app = express();

registerCoreHooks(app);
registerProposalHooks(app);

app.listen(3000);
```

## Como Funciona

### Actions (do_action)
```typescript
// Executar uma action
await moduleRegistry.doAction('auth.login', { email, password });
```

### Filters (apply_filters)
```typescript
// Aplicar um filtro
const valorModificado = moduleRegistry.applyFilter('auth.validateToken', token);
```

## Vantagens desta Arquitetura

1. **Desacoplamento**: Módulos são independentes e não precisam conhecer uns aos outros
2. **Extensibilidade**: Novos módulos podem ser adicionados sem modificar o código existente
3. **Manutenibilidade**: Cada módulo é responsável por sua própria lógica
4. **Testabilidade**: Módulos podem ser testados isoladamente
5. **Escalabilidade**: Sistema cresce organicamente com novos módulos

## Módulos Principais

### Auth Module (Core)
- Gerencia autenticação e autorização
- Actions: `auth.login`, `auth.register`
- Filters: `auth.validateToken`

### Projects Module
- Gerencia projetos e tarefas
- Actions: `project.create`, `project.update`
- Filters: `project.validate`

## Desenvolvimento de Novos Módulos

1. Crie uma pasta para seu módulo em `modules/`
2. Exporte serviços, entidades, hooks/actions e tipos
3. Forneça função de registro de hooks/actions
4. Registre o módulo no sistema via site principal
5. Documente os hooks disponíveis

## Boas Práticas

1. Use nomes descritivos para actions e filters
2. Documente todos os hooks
3. Mantenha módulos focados em uma responsabilidade
4. Siga o padrão de nomenclatura: `moduleName.actionName`
5. Evite dependências entre módulos

## Comparação com WordPress

Nossa implementação segue os mesmos princípios do WordPress:
- Sistema de plugins (módulos)
- Actions e Filters
- Hooks para extensibilidade
- Registro automático de funcionalidades

A principal diferença é que usamos TypeScript para maior segurança de tipos e melhor tooling.

## Estado Atual do Projeto

- A landing page principal já está implementada e funcional, seguindo o padrão visual e de experiência de plataformas como Upwork e Workana.
- O módulo core (autenticação, usuários, etc.) está plugável e segue o padrão de arquitetura modular (actions, filters, hooks). A integração é feita via função de registro (ex: registerCoreHooks(app)), mas há pontos onde a lógica do core pode estar acoplada à raiz para facilitar o MVP. Recomenda-se revisar e garantir que toda a lógica do core seja registrada via interface de integração, mantendo a independência dos módulos.
- O dashboard de admin está funcional e protegido por autenticação JWT.
- O seed de admin e a estrutura de banco de dados estão operacionais.
- A documentação dos hooks/actions/filters do core está em progresso.

## Próximos Passos

- Garantir que todos os módulos (core, projetos, etc.) sejam plugáveis e registrados apenas via funções de integração, sem acoplamento direto à raiz.
- Documentar todos os hooks/actions/filters disponíveis em cada módulo.
- Expandir a proteção de rotas e autenticação para os dashboards de usuário (freelancer/cliente).
- Integrar e testar o módulo de projetos como plugin.
- Implementar autenticação social, multilíngue completo e demais diferenciais do roadmap. 