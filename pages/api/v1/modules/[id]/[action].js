// API proxy for activating or deactivating a module
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  // Get the module ID and action from the URL
  const { id, action } = req.query;

  // Validate the action
  if (action !== 'activate' && action !== 'deactivate') {
    return res.status(400).json({ message: 'Invalid action. Must be either "activate" or "deactivate"' });
  }

  try {
    // Special handling for core module - cannot be deactivated
    if (id === 'core' && action === 'deactivate') {
      return res.status(400).json({ 
        message: 'O módulo Core não pode ser desativado pois é necessário para o funcionamento do sistema.',
        reason: 'core_required'
      });
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Map known modules to their details
    const moduleDetails = {
      'core': {
        name: 'Núcleo do Sistema',
        description: 'Funcionalidades principais incluindo gerenciamento de projetos e propostas',
        version: '1.0.0',
        canUninstall: false,
        features: [
          'Gerenciamento de Usuários',
          'Sistema de Autenticação',
          'Gerenciamento de Projetos',
          'Gerenciamento de Propostas'
        ],
        activationMessage: 'O Núcleo do Sistema foi ativado com sucesso.',
        deactivationMessage: 'O Núcleo do Sistema não pode ser desativado.'
      },
      'contracts': {
        name: 'Contratos',
        description: 'Geração e gestão de contratos para projetos e propostas',
        version: '0.9.5',
        development: 'pending',
        progress: '85%',
        activationMessage: 'O módulo Contratos foi ativado. Nota: Este módulo está em desenvolvimento (85% concluído) e algumas funcionalidades podem estar incompletas.',
        deactivationMessage: 'O módulo Contratos foi desativado.'
      },
      'reviews': {
        name: 'Sistema de Avaliações',
        description: 'Avaliações e feedback para freelancers e clientes',
        version: '1.0.0',
        development: 'planned',
        activationMessage: 'O módulo de Avaliações foi ativado.',
        deactivationMessage: 'O módulo de Avaliações foi desativado.'
      },
      'analytics': {
        name: 'Analytics',
        description: 'Métricas e análises do sistema e usuários',
        version: '0.9.0',
        development: 'planned',
        activationMessage: 'O módulo Analytics foi ativado.',
        deactivationMessage: 'O módulo Analytics foi desativado.'
      },
      'notifications': {
        name: 'Sistema de Notificações',
        description: 'Notificações por email, SMS e push para usuários',
        version: '1.1.0',
        development: 'planned',
        activationMessage: 'O módulo de Notificações foi ativado.',
        deactivationMessage: 'O módulo de Notificações foi desativado.'
      },
      'reports': {
        name: 'Relatórios Avançados',
        description: 'Relatórios personalizados e exportação de dados',
        version: '0.8.5',
        development: 'planned',
        activationMessage: 'O módulo de Relatórios foi ativado.',
        deactivationMessage: 'O módulo de Relatórios foi desativado.'
      }
    };
    
    // Get the module details or use a generic one if not found
    const details = moduleDetails[id] || {
      name: `Módulo ${id}`,
      description: 'Descrição não disponível',
      version: '1.0.0',
      activationMessage: `O módulo ${id} foi ativado com sucesso.`,
      deactivationMessage: `O módulo ${id} foi desativado com sucesso.`
    };
    
    // Return the module with updated status
    const mockUpdatedModule = {
      id,
      ...details,
      status: action === 'activate' ? 'active' : 'inactive',
      message: action === 'activate' ? details.activationMessage : details.deactivationMessage
    };
    
    return res.status(200).json(mockUpdatedModule);
  } catch (error) {
    console.error(`Error ${action}ing module ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 