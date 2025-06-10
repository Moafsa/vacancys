// API proxy for modules/installed endpoint
export default async function handler(req, res) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    // Always return mock data for this demonstration
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock installed modules
    // Reflecting that core now includes projects and proposals functionality
    const mockInstalledModules = [
      {
        id: 'core',
        name: 'Núcleo do Sistema',
        description: 'Funcionalidades principais incluindo gerenciamento de projetos e propostas',
        status: 'active',
        version: '1.0.0',
        canUninstall: false,
        features: [
          'Gerenciamento de Usuários',
          'Sistema de Autenticação',
          'Gerenciamento de Projetos',
          'Gerenciamento de Propostas'
        ]
      },
      {
        id: 'contracts',
        name: 'Contratos',
        description: 'Geração e gestão de contratos para projetos e propostas',
        status: 'inactive',
        version: '0.9.5',
        development: 'pending'
      }
    ];
    
    return res.status(200).json(mockInstalledModules);
  } catch (error) {
    console.error('Error in modules/installed API route:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 