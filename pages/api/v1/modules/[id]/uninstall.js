// API proxy for uninstalling a module
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
    
    // Check if this is a core module that cannot be uninstalled
    if (id === 'core') {
      return res.status(400).json({ 
        message: 'O módulo Core não pode ser desinstalado pois é necessário para o funcionamento do sistema.',
        reason: 'core_required' 
      });
    }
    
    // Map of module details with development status
    const moduleDetails = {
      'contracts': {
        name: 'Contratos',
        description: 'Geração e gestão de contratos para projetos e propostas',
        version: '0.9.5',
        development: 'pending',
        eta: 'Q3 2023',
        progress: '85%'
      }
    };
    
    // Check if module is in development
    if (moduleDetails[id]) {
      const module = moduleDetails[id];
      return res.status(400).json({
        message: `O módulo "${module.name}" está atualmente em desenvolvimento (${module.progress} concluído) e não pode ser desinstalado neste momento. Previsão de conclusão: ${module.eta}.`,
        reason: 'in_development',
        development: module.development,
        progress: module.progress,
        eta: module.eta
      });
    }
    
    // Success response for uninstallation
    return res.status(200).json({ 
      success: true,
      id,
      message: `O módulo ${id} foi desinstalado com sucesso.`
    });
  } catch (error) {
    console.error(`Error uninstalling module ${id}:`, error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 