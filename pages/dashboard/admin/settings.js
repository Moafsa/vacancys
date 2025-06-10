import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  SaveIcon,
  ShieldCheckIcon,
  ColorSwatchIcon,
  MailIcon,
  GlobeAltIcon,
  TranslateIcon,
  DatabaseIcon,
  CloudIcon,
  LockClosedIcon,
  ServerIcon,
  CogIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import AdminLayout from '../../../components/dashboard/AdminLayout';

export default function SystemSettings() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Vacancy',
      description: 'Plataforma de conexão entre freelancers e clientes',
      supportEmail: 'suporte@vacancy.service',
      adminEmail: 'admin@vacancy.service',
      enableMaintenanceMode: false,
      enableRegistration: true,
    },
    security: {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireEmailVerification: true,
      enableTwoFactorAuth: false,
      enableCaptcha: true,
    },
    email: {
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      smtpUser: 'user@example.com',
      smtpPassword: '********',
      senderName: 'Vacancy',
      senderEmail: 'no-reply@vacancy.service',
      enableEmailVerification: true,
    },
    appearance: {
      primaryColor: '#6366F1',
      secondaryColor: '#4F46E5',
      logoURL: '/logo.png',
      faviconURL: '/favicon.ico',
      enableDarkMode: true,
    },
    localization: {
      defaultLanguage: 'pt-BR',
      enableMultiLanguage: true,
      availableLanguages: ['pt-BR', 'en-US', 'es'],
      timezone: 'America/Sao_Paulo',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
    },
    system: {
      enableDebugMode: false,
      logLevel: 'info',
      maxUploadSize: 10,
      backupFrequency: 'daily',
      maxBackupFiles: 7,
    }
  });
  
  // Funções para lidar com mudanças nos campos
  const handleChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };
  
  // Função para salvar configurações
  const saveSettings = async (section) => {
    setLoading(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      console.log(`Salvando configurações de ${section}:`, settings[section]);
      setLoading(false);
      
      // Exibir mensagem de sucesso
      alert(`Configurações de ${section} salvas com sucesso!`);
    }, 1000);
  };

  return (
    <AdminLayout currentSection="system" searchPlaceholder="Pesquisar...">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Configurações do Sistema</h1>
          
          {/* Navegação de abas */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => setSelectedTab('general')}
                className={`${
                  selectedTab === 'general'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                <InformationCircleIcon className="h-5 w-5 inline-block mr-1" />
                Geral
              </button>
              <button
                onClick={() => setSelectedTab('security')}
                className={`${
                  selectedTab === 'security'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                <ShieldCheckIcon className="h-5 w-5 inline-block mr-1" />
                Segurança
              </button>
              <button
                onClick={() => setSelectedTab('email')}
                className={`${
                  selectedTab === 'email'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                <MailIcon className="h-5 w-5 inline-block mr-1" />
                Email
              </button>
              <button
                onClick={() => setSelectedTab('appearance')}
                className={`${
                  selectedTab === 'appearance'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                <ColorSwatchIcon className="h-5 w-5 inline-block mr-1" />
                Aparência
              </button>
              <button
                onClick={() => setSelectedTab('localization')}
                className={`${
                  selectedTab === 'localization'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                <GlobeAltIcon className="h-5 w-5 inline-block mr-1" />
                Localização
              </button>
              <button
                onClick={() => setSelectedTab('system')}
                className={`${
                  selectedTab === 'system'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                <ServerIcon className="h-5 w-5 inline-block mr-1" />
                Sistema
              </button>
            </nav>
          </div>
          
          {/* Conteúdo da aba selecionada */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              {/* Configurações Gerais */}
              {selectedTab === 'general' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações Gerais</h2>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                        Nome do Site
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="siteName"
                          value={settings.general.siteName}
                          onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="description"
                          value={settings.general.description}
                          onChange={(e) => handleChange('general', 'description', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
                        Email de Suporte
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="supportEmail"
                          value={settings.general.supportEmail}
                          onChange={(e) => handleChange('general', 'supportEmail', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                        Email de Administração
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="adminEmail"
                          value={settings.general.adminEmail}
                          onChange={(e) => handleChange('general', 'adminEmail', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="enableMaintenanceMode"
                            type="checkbox"
                            checked={settings.general.enableMaintenanceMode}
                            onChange={(e) => handleChange('general', 'enableMaintenanceMode', e.target.checked)}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enableMaintenanceMode" className="font-medium text-gray-700">
                            Ativar Modo de Manutenção
                          </label>
                          <p className="text-gray-500">O site ficará inacessível para usuários não administradores.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="enableRegistration"
                            type="checkbox"
                            checked={settings.general.enableRegistration}
                            onChange={(e) => handleChange('general', 'enableRegistration', e.target.checked)}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enableRegistration" className="font-medium text-gray-700">
                            Permitir Novos Registros
                          </label>
                          <p className="text-gray-500">Permite que novos usuários se registrem no sistema.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => saveSettings('general')}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Salvar Configurações
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Configurações de Segurança */}
              {selectedTab === 'security' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações de Segurança</h2>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                        Timeout da Sessão (minutos)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="sessionTimeout"
                          min="1"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                        Máximo de Tentativas de Login
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="maxLoginAttempts"
                          min="1"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                        Tamanho Mínimo de Senha
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="passwordMinLength"
                          min="6"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => handleChange('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="requireEmailVerification"
                            type="checkbox"
                            checked={settings.security.requireEmailVerification}
                            onChange={(e) => handleChange('security', 'requireEmailVerification', e.target.checked)}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="requireEmailVerification" className="font-medium text-gray-700">
                            Requerer Verificação de Email
                          </label>
                          <p className="text-gray-500">Usuários precisam verificar seu email antes de acessar o sistema.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="enableTwoFactorAuth"
                            type="checkbox"
                            checked={settings.security.enableTwoFactorAuth}
                            onChange={(e) => handleChange('security', 'enableTwoFactorAuth', e.target.checked)}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enableTwoFactorAuth" className="font-medium text-gray-700">
                            Habilitar Autenticação de Dois Fatores
                          </label>
                          <p className="text-gray-500">Permitir que usuários configurem autenticação de dois fatores.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => saveSettings('security')}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                    >
                      {loading ? 'Salvando...' : 'Salvar Configurações'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Outros painéis de configuração seguiriam o mesmo padrão */}
              {(selectedTab === 'email' || selectedTab === 'appearance' || selectedTab === 'localization' || selectedTab === 'system') && (
                <div className="text-center py-8">
                  <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Configurações de {selectedTab === 'email' ? 'Email' : selectedTab === 'appearance' ? 'Aparência' : selectedTab === 'localization' ? 'Localização' : 'Sistema'}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Esta seção será implementada em breve. Os módulos de configuração serão desenvolvidos separadamente e plugados ao sistema principal.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setSelectedTab('general')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Voltar para Configurações Gerais
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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