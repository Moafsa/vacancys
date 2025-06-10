import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  UserIcon,
  BellIcon,
  CogIcon,
  DocumentTextIcon,
  ChatIcon,
  SupportIcon,
  ChartBarIcon,
  ClipboardListIcon,
  BriefcaseIcon,
  CashIcon,
  QuestionMarkCircleIcon,
  PuzzleIcon,
  UserGroupIcon,
  LightningBoltIcon,
} from '@heroicons/react/outline';
import { Header, Sidebar, StatCard, ActionCard } from '../../components/dashboard';

function RequireUserAuth({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Sem token, redirecionando para login');
      router.push('/auth/login');
      return;
    }
    
    setIsAuthenticated(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">Você precisa estar autenticado para acessar esta página.</p>
          <div>
            <button
              onClick={() => router.push('/auth/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default function UserDashboard() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats] = useState({
    completedProjects: 8,
    openProjects: 2,
    totalEarnings: 12750,
    unreadMessages: 3,
    notifications: 4,
    activeContracts: 2
  });
  
  const [activities] = useState([
    { id: 1, type: 'message', content: 'Nova mensagem de Maria Silva', date: '2 horas atrás' },
    { id: 2, type: 'project', content: 'Projeto "Desenvolvimento de Website" foi atualizado', date: '5 horas atrás' },
    { id: 3, type: 'payment', content: 'Pagamento de R$1.500 recebido', date: '1 dia atrás' },
    { id: 4, type: 'system', content: 'Verificação de conta concluída', date: '2 dias atrás' },
  ]);
  
  const [recommendedActions] = useState([
    { id: 1, title: 'Complete seu perfil', description: 'Adicione mais informações para aumentar suas chances', progress: 75 },
    { id: 2, title: 'Verifique suas habilidades', description: 'Faça testes para validar suas habilidades', progress: 40 },
    { id: 3, title: 'Configure seus métodos de pagamento', description: 'Adicione um método de pagamento para receber', progress: 100 },
  ]);

  const navItems = [
    { name: 'Dashboard', icon: <ChartBarIcon className="w-5 h-5" />, section: 'dashboard' },
    { name: 'Meu Perfil', icon: <UserIcon className="w-5 h-5" />, section: 'profile' },
    { name: 'Projetos', icon: <BriefcaseIcon className="w-5 h-5" />, section: 'projects' },
    { name: 'Mensagens', icon: <ChatIcon className="w-5 h-5" />, section: 'messages', badge: stats.unreadMessages },
    { name: 'Contratos', icon: <DocumentTextIcon className="w-5 h-5" />, section: 'contracts' },
    { name: 'Pagamentos', icon: <CashIcon className="w-5 h-5" />, section: 'payments' },
    { name: 'Suporte', icon: <SupportIcon className="w-5 h-5" />, section: 'support' },
    { name: 'Configurações', icon: <CogIcon className="w-5 h-5" />, section: 'settings' },
  ];

  useEffect(() => {
    // Buscar informações do usuário
    const fetchUserInfo = async () => {
      try {
        const userEmail = localStorage.getItem('email') || '';
        const userRole = localStorage.getItem('userRole') || 'USER';
        
        // Checagem simples - em produção chamaria a API
        if (!userEmail) {
          router.push('/auth/login');
          return;
        }
        
        setUserInfo({
          email: userEmail,
          role: userRole,
          name: userEmail.split('@')[0],
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        });
        
        // Redirecionar para dashboard específico com base no papel do usuário
        if (userRole === 'ADMIN') {
          router.push('/dashboard/admin/users');
        } else if (userRole === 'FREELANCER') {
          router.push('/dashboard/freelancer');
        } else if (userRole === 'CLIENT') {
          router.push('/dashboard/client');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [router]);
  
  // Se ainda estiver carregando, mostrar indicador
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <RequireUserAuth>
      <div className="min-h-screen bg-gray-100">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            navItems={navItems} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            bgColor="bg-gray-800"
            bgColorDarker="bg-gray-900"
            title="Vacancy Dashboard"
          />

          {/* Main content */}
          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            {/* Top bar */}
            <Header 
              searchPlaceholder={t('dashboard.searchPlaceholder')} 
              onSearch={(term) => console.log('Pesquisando:', term)}
              notificationCount={stats.notifications}
              messageCount={stats.unreadMessages}
              userImage={userInfo?.avatar}
            />

            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              {activeSection === 'dashboard' && (
                <div className="py-6 px-4 sm:px-6 lg:px-8">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                    Bem-vindo(a), {userInfo?.name || 'Usuário'}
                  </h1>
                  
                  {/* Role Selection Cards */}
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Escolha seu perfil</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <div onClick={() => router.push('/dashboard/client')} className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white transition-all duration-200 transform hover:scale-105 cursor-pointer">
                        <div className="flex items-center mb-4">
                          <UserGroupIcon className="h-8 w-8 mr-3" />
                          <h3 className="text-xl font-bold">Cliente</h3>
                        </div>
                        <p>Contrate freelancers e gerencie seus projetos</p>
                      </div>
                      
                      <div onClick={() => router.push('/dashboard/freelancer')} className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white transition-all duration-200 transform hover:scale-105 cursor-pointer">
                        <div className="flex items-center mb-4">
                          <BriefcaseIcon className="h-8 w-8 mr-3" />
                          <h3 className="text-xl font-bold">Freelancer</h3>
                        </div>
                        <p>Encontre projetos e ofereça seus serviços</p>
                      </div>
                      
                      {userInfo?.role === 'ADMIN' && (
                        <div onClick={() => router.push('/dashboard/admin/users')} className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg shadow-lg p-6 text-white transition-all duration-200 transform hover:scale-105 cursor-pointer">
                          <div className="flex items-center mb-4">
                            <CogIcon className="h-8 w-8 mr-3" />
                            <h3 className="text-xl font-bold">Administrador</h3>
                          </div>
                          <p>Gerencie a plataforma e seus usuários</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="my-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Resumo</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      <StatCard 
                        icon={<BriefcaseIcon className="h-6 w-6 text-indigo-500" />}
                        title="Projetos Concluídos"
                        value={stats.completedProjects}
                      />
                      <StatCard 
                        icon={<ClipboardListIcon className="h-6 w-6 text-green-500" />}
                        title="Projetos Ativos"
                        value={stats.openProjects}
                      />
                      <StatCard 
                        icon={<CashIcon className="h-6 w-6 text-yellow-500" />}
                        title="Ganhos Totais"
                        value={`R$${stats.totalEarnings.toLocaleString()}`}
                      />
                      <StatCard 
                        icon={<DocumentTextIcon className="h-6 w-6 text-blue-500" />}
                        title="Contratos Ativos"
                        value={stats.activeContracts}
                      />
                    </div>
                  </div>
                  
                  {/* Recent Activity & Actions */}
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Recent Activity */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Atividade Recente</h3>
                      </div>
                      <ul className="divide-y divide-gray-200">
                        {activities.map((activity) => (
                          <li key={activity.id} className="px-4 py-4 hover:bg-gray-50">
                            <div className="flex items-center">
                              <span className="mr-3">
                                {activity.type === 'message' && <ChatIcon className="h-5 w-5 text-blue-500" />}
                                {activity.type === 'project' && <BriefcaseIcon className="h-5 w-5 text-green-500" />}
                                {activity.type === 'payment' && <CashIcon className="h-5 w-5 text-yellow-500" />}
                                {activity.type === 'system' && <CogIcon className="h-5 w-5 text-gray-500" />}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{activity.content}</p>
                                <p className="text-sm text-gray-500">{activity.date}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="px-4 py-4 border-t border-gray-200">
                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          Ver todas as atividades
                        </a>
                      </div>
                    </div>
                    
                    {/* Recommended Actions */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Ações Recomendadas</h3>
                      </div>
                      <ul className="divide-y divide-gray-200">
                        {recommendedActions.map((action) => (
                          <li key={action.id} className="px-4 py-4 hover:bg-gray-50">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                              <p className="text-sm text-gray-500 mb-2">{action.description}</p>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    action.progress === 100 
                                      ? 'bg-green-500' 
                                      : action.progress > 50 
                                        ? 'bg-yellow-500' 
                                        : 'bg-indigo-500'
                                  }`} 
                                  style={{ width: `${action.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500">{action.progress}% completo</span>
                                {action.progress < 100 && (
                                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                                    Completar
                                  </button>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Help Section */}
                  <div className="mt-8 bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900">Precisa de ajuda?</h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Nosso suporte está disponível para ajudá-lo com qualquer dúvida.</p>
                      </div>
                      <div className="mt-5 flex">
                        <button 
                          onClick={() => setActiveSection('support')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                          <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
                          Contatar Suporte
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === 'profile' && (
                <div className="py-6 px-4 sm:px-6 lg:px-8">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-6">Meu Perfil</h1>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img className="h-24 w-24 rounded-full" src={userInfo?.avatar} alt="" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{userInfo?.name}</h3>
                          <p className="text-sm text-gray-500">{userInfo?.email}</p>
                          <p className="text-sm text-gray-500">Perfil: {userInfo?.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Nome completo</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Não informado</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userInfo?.email}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Não informado</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Não informado</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Perfis disponíveis</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                <div className="w-0 flex-1 flex items-center">
                                  <UserGroupIcon className="flex-shrink-0 h-5 w-5 text-blue-500" />
                                  <span className="ml-2 flex-1 w-0 truncate">Cliente</span>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <button 
                                    onClick={() => router.push('/dashboard/client')}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    Acessar
                                  </button>
                                </div>
                              </li>
                              <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                <div className="w-0 flex-1 flex items-center">
                                  <BriefcaseIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                                  <span className="ml-2 flex-1 w-0 truncate">Freelancer</span>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <button 
                                    onClick={() => router.push('/dashboard/freelancer')}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    Acessar
                                  </button>
                                </div>
                              </li>
                              {userInfo?.role === 'ADMIN' && (
                                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                  <div className="w-0 flex-1 flex items-center">
                                    <CogIcon className="flex-shrink-0 h-5 w-5 text-purple-500" />
                                    <span className="ml-2 flex-1 w-0 truncate">Administrador</span>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <button 
                                      onClick={() => router.push('/dashboard/admin/users')}
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                      Acessar
                                    </button>
                                  </div>
                                </li>
                              )}
                            </ul>
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="px-4 py-4 border-t border-gray-200">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                      >
                        Editar Perfil
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection !== 'dashboard' && activeSection !== 'profile' && (
                <div className="py-6 px-4 sm:px-6 lg:px-8">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-6">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                    <div className="text-center py-12">
                      <PuzzleIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Módulo não instalado</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Este módulo será implementado em breve. Os módulos serão desenvolvidos separadamente e plugados ao sistema principal.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </RequireUserAuth>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 