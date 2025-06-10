// API proxy for installing a module
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  // Get the module ID from the URL
  const { id } = req.query;

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Map of module details with development status
    const moduleDetails = {
      'reviews': {
        name: 'Sistema de Avaliações',
        description: 'Avaliações e feedback para freelancers e clientes',
        version: '1.0.0',
        development: 'planned',
        eta: 'Q4 2023'
      },
      'analytics': {
        name: 'Analytics',
        description: 'Métricas e análises do sistema e usuários',
        version: '0.9.0',
        development: 'planned',
        eta: 'Q1 2024'
      },
      'notifications': {
        name: 'Sistema de Notificações',
        description: 'Notificações por email, SMS e push para usuários',
        version: '1.1.0',
        development: 'planned',
        eta: 'Q2 2024'
      },
      'reports': {
        name: 'Relatórios Avançados',
        description: 'Relatórios personalizados e exportação de dados',
        version: '0.8.5',
        development: 'planned',
        eta: 'Q3 2024'
      }
    };
    
    // Get module details or use generic data
    const moduleInfo = moduleDetails[id] || {
      name: `Módulo ${id}`,
      development: 'planned',
      eta: 'a ser definida'
    };
    
    // Return informative message about the module's development status
    return res.status(200).json({
      id,
      name: moduleInfo.name,
      status: 'planned',
      development: moduleInfo.development,
      message: `O módulo "${moduleInfo.name}" está planejado mas ainda não está disponível para instalação. A previsão de desenvolvimento é para ${moduleInfo.eta}.`,
      eta: moduleInfo.eta
    });
  } catch (error) {
    console.error(`Error installing module ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 