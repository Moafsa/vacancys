import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  CogIcon, 
  ChartBarIcon, 
  ClipboardCheckIcon,
  CreditCardIcon,
  ChatAlt2Icon,
  PuzzleIcon,
  CalendarIcon,
  LightningBoltIcon,
  UsersIcon
} from '@heroicons/react/outline';
import { Header } from '../../components/dashboard';

export default function Dashboard() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    async function fetchUserRole() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        const res = await fetch('/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
          setError('Não autenticado. Faça login novamente.');
          setLoading(false);
          router.push('/auth/login');
          return;
        }
        
        const userData = await res.json();
        setUser(userData);
        
        const userRole = userData.role;
        localStorage.setItem('userRole', userRole);
        
        // Não redirecionamos imediatamente para mostrar a dashboard unificada
        setLoading(false);
      } catch (err) {
        console.error('[DEBUG] Erro ao buscar perfil do usuário:', err);
        setError('Erro ao buscar perfil do usuário.');
        setLoading(false);
      }
    }
    fetchUserRole();
  }, [router]);

  const handleDashboardSelect = (dashboardType) => {
    setRedirecting(true);
    // Redirecionamento após seleção
    router.push(`/dashboard/${dashboardType}`);
  };

  const isAdmin = user?.role === 'ADMIN';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <h2 className="mt-6 text-xl font-medium text-gray-900">{t('loading')}</h2>
          <p className="mt-2 text-sm text-gray-500">{t('loading_dashboard')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="mt-3 text-xl font-medium text-gray-900">{t('error')}</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              {t('back_to_login')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <h2 className="mt-6 text-xl font-medium text-gray-900">{t('redirecting')}</h2>
          <p className="mt-2 text-sm text-gray-500">{t('redirecting_to_dashboard')}</p>
        </div>
      </div>
    );
  }

  // Diferentes dashboards disponíveis
  const dashboards = [
    {
      id: "freelancer",
      title: t("dashboard.freelancer.title"),
      description: t("dashboard.freelancer.description"),
      icon: <BriefcaseIcon className="h-10 w-10" />,
      color: "bg-green-600",
      hoverColor: "bg-green-700",
      features: [
        { name: t("dashboard.freelancer.feature1"), icon: <ClipboardCheckIcon className="h-5 w-5" /> },
        { name: t("dashboard.freelancer.feature2"), icon: <ChatAlt2Icon className="h-5 w-5" /> },
        { name: t("dashboard.freelancer.feature3"), icon: <CreditCardIcon className="h-5 w-5" /> }
      ]
    },
    {
      id: "client",
      title: t("dashboard.client.title"),
      description: t("dashboard.client.description"),
      icon: <UserGroupIcon className="h-10 w-10" />,
      color: "bg-blue-600",
      hoverColor: "bg-blue-700",
      features: [
        { name: t("dashboard.client.feature1"), icon: <PuzzleIcon className="h-5 w-5" /> },
        { name: t("dashboard.client.feature2"), icon: <ChatAlt2Icon className="h-5 w-5" /> },
        { name: t("dashboard.client.feature3"), icon: <CalendarIcon className="h-5 w-5" /> }
      ]
    },
    ...(isAdmin ? [{
      id: "admin",
      title: t("dashboard.admin.title"),
      description: t("dashboard.admin.description"),
      icon: <CogIcon className="h-10 w-10" />,
      color: "bg-indigo-600",
      hoverColor: "bg-indigo-700",
      features: [
        { name: t("dashboard.admin.feature1"), icon: <UsersIcon className="h-5 w-5" /> },
        { name: t("dashboard.admin.feature2"), icon: <ChartBarIcon className="h-5 w-5" /> },
        { name: t("dashboard.admin.feature3"), icon: <CogIcon className="h-5 w-5" /> }
      ]
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchPlaceholder={t('dashboard.searchPlaceholder')} 
        onSearch={() => {}} 
        notificationCount={3}
        messageCount={2}
      />

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho do Dashboard */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.welcome', { name: user?.name || '' })}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {t('dashboard.select_panel')}
            </p>
          </div>

          {/* Gráfico de status */}
          <div className="mb-12 bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">{t('dashboard.activity_summary')}</h2>
              <p className="text-sm text-gray-500">{t('dashboard.recent_activity')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <ClipboardCheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">{t('dashboard.active_projects')}</div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <CreditCardIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-green-600">0</div>
                  <div className="text-sm text-gray-600">{t('dashboard.sent_proposals')}</div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
                <div className="rounded-full bg-indigo-100 p-3 mr-4">
                  <ChatAlt2Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-indigo-600">0</div>
                  <div className="text-sm text-gray-600">{t('dashboard.unread_messages')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards de Dashboards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <div 
                key={dashboard.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleDashboardSelect(dashboard.id)}
              >
                <div className={`${dashboard.color} p-4`}>
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-lg p-3">
                      {dashboard.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white">{dashboard.title}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-gray-600 mb-4">{dashboard.description}</p>
                  
                  <div className="space-y-3">
                    {dashboard.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`text-${dashboard.color.split('-')[1]}-500 mr-2`}>
                          {feature.icon}
                        </div>
                        <span className="text-sm text-gray-600">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-5">
                    <button 
                      className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${dashboard.color} hover:${dashboard.hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${dashboard.color.split('-')[1]}-500`}
                    >
                      <LightningBoltIcon className="h-5 w-5 mr-2" />
                      {t('dashboard.access_dashboard', { dashboard: dashboard.title })}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Seção de recursos em destaque */}
          <div className="mt-12">
            <h2 className="text-lg font-medium text-gray-900 mb-6">{t('dashboard.featured_resources')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{t('dashboard.meeting_room.title')}</h3>
                  <p className="opacity-90 mb-4">{t('dashboard.meeting_room.desc')}</p>
                  <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    {t('dashboard.meeting_room.button')}
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{t('dashboard.smart_translator.title')}</h3>
                  <p className="opacity-90 mb-4">{t('dashboard.smart_translator.desc')}</p>
                  <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    {t('dashboard.smart_translator.button')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 