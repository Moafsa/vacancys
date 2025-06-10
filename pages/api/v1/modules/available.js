// API proxy for modules/available endpoint
export default async function handler(req, res) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  try {
    // Always return mock data for demonstration
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock available modules
    // Excluding projects and proposals since they're now part of core
    const mockAvailableModules = [
      {
        id: 'reviews',
        name: 'Sistema de Avaliações',
        description: 'Avaliações e feedback para freelancers e clientes',
        version: '1.0.0',
        development: 'planned'
      },
      {
        id: 'analytics',
        name: 'Analytics',
        description: 'Métricas e análises do sistema e usuários',
        version: '0.9.0',
        development: 'planned'
      },
      {
        id: 'notifications',
        name: 'Sistema de Notificações',
        description: 'Notificações por email, SMS e push para usuários',
        version: '1.1.0',
        development: 'planned'
      },
      {
        id: 'reports',
        name: 'Relatórios Avançados',
        description: 'Relatórios personalizados e exportação de dados',
        version: '0.8.5',
        development: 'planned'
      }
    ];
    
    return res.status(200).json(mockAvailableModules);
  } catch (error) {
    console.error('Error in modules/available API route:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 