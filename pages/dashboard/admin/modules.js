import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  SwitchHorizontalIcon,
  PuzzleIcon,
  InformationCircleIcon,
  DownloadIcon,
  TrashIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import AdminLayout from '../../../components/dashboard/AdminLayout';

export default function ModulesManagement() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modules, setModules] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch modules from API
  useEffect(() => {
  const fetchModules = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setError('You must be logged in to view this page');
          setLoading(false);
          return;
        }
        
        // Fetch installed modules
        const installedResponse = await fetch('/api/v1/modules/installed', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!installedResponse.ok) {
          throw new Error(`Error fetching installed modules: ${installedResponse.statusText}`);
        }
        
        const installedData = await installedResponse.json();
        setModules(installedData || []);
        
        // Fetch available modules
        const availableResponse = await fetch('/api/v1/modules/available', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!availableResponse.ok) {
          throw new Error(`Error fetching available modules: ${availableResponse.statusText}`);
        }
        
        const availableData = await availableResponse.json();
        setAvailableModules(availableData || []);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModules();
  }, []);
  
  // Função para alternar status do módulo
  const toggleModuleStatus = async (moduleId) => {
    setLoading(true);
    setNotification(null);
    
    try {
      const token = localStorage.getItem('token');
      const moduleToToggle = modules.find(m => m.id === moduleId);
      
      if (!moduleToToggle) {
        throw new Error(`Module with ID ${moduleId} not found`);
      }
      
      const newStatus = moduleToToggle.status === 'active' ? 'inactive' : 'active';
      const endpoint = `/api/v1/modules/${moduleId}/${newStatus === 'active' ? 'activate' : 'deactivate'}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        setNotification({
          type: 'error',
          message: responseData.message || `Failed to ${newStatus === 'active' ? 'activate' : 'deactivate'} module`
        });
        return;
      }
      
      setModules(modules.map(module => {
        if (module.id === moduleId) {
          return responseData;
        }
        return module;
      }));
      
      setNotification({
        type: 'success',
        message: responseData.message || `Module ${responseData.name} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      });
    } catch (err) {
      console.error('Error toggling module status:', err);
      setNotification({
        type: 'error',
        message: `Failed to ${moduleToToggle?.status === 'active' ? 'deactivate' : 'activate'} module. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Função para instalar um novo módulo
  const installModule = async (moduleId) => {
    setLoading(true);
    setNotification(null);
    
    try {
      const token = localStorage.getItem('token');
      const moduleToInstall = availableModules.find(m => m.id === moduleId);
      
      if (!moduleToInstall) {
        throw new Error(`Module with ID ${moduleId} not found`);
      }
      
      const response = await fetch(`/api/v1/modules/${moduleId}/install`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        setNotification({
          type: 'error',
          message: responseData.message || 'Failed to install module'
        });
        return;
      }
      
      // Se o módulo está no estado de desenvolvimento "planned", mostrar mensagem
      if (responseData.development === 'planned') {
        setNotification({
          type: 'info',
          message: responseData.message || `Module ${moduleToInstall.name} is planned but not yet available.`
        });
        return;
      }
      
      // Se o módulo foi instalado com sucesso, atualizar os estados
      setModules([...modules, responseData]);
      setAvailableModules(availableModules.filter(m => m.id !== moduleId));
      
      setNotification({
        type: 'success',
        message: responseData.message || `Module ${moduleToInstall.name} installed successfully`
      });
    } catch (err) {
      console.error('Error installing module:', err);
      setNotification({
        type: 'error',
        message: `Failed to install module. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para desinstalar um módulo
  const uninstallModule = async (moduleId) => {
    if (!confirm('Tem certeza que deseja desinstalar este módulo?')) {
      return;
    }
    
    setLoading(true);
    setNotification(null);
    
    try {
      const token = localStorage.getItem('token');
      const moduleToUninstall = modules.find(m => m.id === moduleId);
      
      if (!moduleToUninstall) {
        throw new Error(`Module with ID ${moduleId} not found`);
      }
      
      const response = await fetch(`/api/v1/modules/${moduleId}/uninstall`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        setNotification({
          type: 'error',
          message: responseData.message || 'Failed to uninstall module'
        });
        return;
      }
      
      // Se a operação foi bem-sucedida
      if (responseData.success) {
        // Atualizar estado
        setModules(modules.filter(m => m.id !== moduleId));
        
        // Adicionar de volta aos módulos disponíveis
        setAvailableModules([
          ...availableModules,
          {
            id: moduleToUninstall.id,
            name: moduleToUninstall.name,
            description: moduleToUninstall.description,
            version: moduleToUninstall.version,
          }
        ]);
        
        setNotification({
          type: 'success',
          message: responseData.message || `Module ${moduleToUninstall.name} uninstalled successfully`
        });
      }
    } catch (err) {
      console.error('Error uninstalling module:', err);
      setNotification({
        type: 'error',
        message: `Failed to uninstall module. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar módulos
  const filteredModules = modules.filter(
    module => module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAvailableModules = availableModules.filter(
    module => module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper para renderizar o status de desenvolvimento
  const renderDevelopmentStatus = (module) => {
    if (!module.development) return null;
    
    let statusColor = '';
    let statusText = 'Unknown';
    
    if (module.development === 'planned') {
      statusColor = 'blue';
      statusText = 'Planejado';
    } else if (module.development === 'pending') {
      statusColor = 'yellow';
      statusText = 'Em Desenvolvimento';
    } else if (module.development === 'ready') {
      statusColor = 'green';
      statusText = 'Pronto';
    }
    
    return (
      <span 
        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          module.development === 'planned' ? 'bg-blue-100 text-blue-800' : 
          module.development === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          module.development === 'ready' ? 'bg-green-100 text-green-800' : 
          'bg-gray-100 text-gray-800'
        }`}
      >
        {statusText}
        {module.progress && ` (${module.progress})`}
      </span>
    );
  };

  return (
    <AdminLayout currentSection="modules" searchPlaceholder="Buscar módulos...">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Gerenciamento de Módulos</h1>
          
          {/* Mostrar notificações */}
          {notification && (
            <div className={`border-l-4 p-4 mb-6 ${
              notification.type === 'error' ? 'bg-red-50 border-red-400' : 
              notification.type === 'success' ? 'bg-green-50 border-green-400' : 
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {notification.type === 'error' && (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  )}
                  {notification.type === 'success' && (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'info' && (
                    <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    notification.type === 'error' ? 'text-red-700' : 
                    notification.type === 'success' ? 'text-green-700' : 
                    'text-blue-700'
                  }`}>{notification.message}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Mostrar erros se houver */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Seção de módulos instalados */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Módulos Instalados</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredModules.length === 0 ? (
                <li className="px-4 py-4 sm:px-6">
                  <p className="text-sm text-gray-500">Nenhum módulo instalado.</p>
                </li>
              ) : (
                filteredModules.map((module) => (
                  <li key={module.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <PuzzleIcon className={`h-8 w-8 ${module.status === 'active' ? 'text-green-500' : 'text-gray-400'}`} />
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{module.name}</h3>
                            <span 
                              className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                module.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {module.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                            {renderDevelopmentStatus(module)}
                          </div>
                          <p className="text-sm text-gray-500">{module.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Versão: {module.version}</p>
                          {module.features && module.features.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700 mb-1">Funcionalidades:</p>
                              <ul className="text-xs text-gray-500 list-disc pl-4">
                                {module.features.map((feature, index) => (
                                  <li key={index}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleModuleStatus(module.id)}
                          disabled={module.canUninstall === false && module.status === 'active' || loading}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white ${
                            module.status === 'active' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                          } focus:outline-none disabled:opacity-50`}
                        >
                          <SwitchHorizontalIcon className="h-4 w-4 mr-1" />
                          {module.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                        {module.canUninstall !== false && (
                          <button
                            onClick={() => uninstallModule(module.id)}
                            disabled={loading}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Desinstalar
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          
          {/* Seção de módulos disponíveis */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Módulos Disponíveis</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredAvailableModules.length === 0 ? (
                <li className="px-4 py-4 sm:px-6">
                  <p className="text-sm text-gray-500">Nenhum módulo disponível para instalação.</p>
                </li>
              ) : (
                filteredAvailableModules.map((module) => (
                  <li key={module.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <PuzzleIcon className="h-8 w-8 text-gray-400" />
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{module.name}</h3>
                            {renderDevelopmentStatus(module)}
                          </div>
                          <p className="text-sm text-gray-500">{module.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Versão: {module.version}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => installModule(module.id)}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                      >
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Instalar
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          
          {/* Overlay de carregamento */}
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                <span>Processando...</span>
              </div>
        </div>
      )}
    </div>
      </div>
    </AdminLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 