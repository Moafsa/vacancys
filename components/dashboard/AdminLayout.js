import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CashIcon,
  BanIcon,
  DocumentReportIcon,
  ChartBarIcon,
  CogIcon,
  PuzzleIcon,
  UserIcon,
} from '@heroicons/react/outline';
import { Header, Sidebar } from './';
import { useTranslation } from 'next-i18next';

function RequireAdminAuth({ children }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Sem token, redirecionando para login');
      router.push('/auth/login');
      return;
    }

    // Verificar se o usuário é um administrador
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('email') || '';
    
    // Permitir acesso somente se o usuário for um administrador
    const hasAdminAccess = userRole === 'ADMIN' || userEmail.includes('admin');
    
    if (!hasAdminAccess) {
      console.log('Acesso negado: o usuário não é um administrador');
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    
    setIsAdmin(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">Você não tem permissão para acessar o painel de administração.</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => router.push('/dashboard/client')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Painel de Cliente
            </button>
            <button
              onClick={() => router.push('/dashboard/freelancer')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              Painel de Freelancer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default function AdminLayout({ children, currentSection = 'dashboard', searchPlaceholder }) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [activeSection, setActiveSection] = useState(currentSection);
  
  // Determinar qual é a seção ativa baseada na URL
  useEffect(() => {
    const path = router.pathname;
    if (path.includes('/users')) {
      setActiveSection('users');
    } else if (path.includes('/modules')) {
      setActiveSection('modules');
    } else if (path.includes('/settings')) {
      setActiveSection('system');
    } else if (path.includes('/projects')) {
      setActiveSection('projects');
    } else if (path.includes('/transactions')) {
      setActiveSection('transactions');
    } else if (path.includes('/disputes')) {
      setActiveSection('disputes');
    } else if (path.includes('/reports')) {
      setActiveSection('reports');
    } else {
      setActiveSection('dashboard');
    }
  }, [router.pathname]);

  const navItems = [
    { name: 'Dashboard', icon: <ChartBarIcon className="w-6 h-6" />, section: 'dashboard', action: () => router.push('/dashboard/admin') },
    { name: 'Usuários', icon: <UserGroupIcon className="w-6 h-6" />, section: 'users', action: () => router.push('/dashboard/admin/users') },
    { name: 'Projetos', icon: <BriefcaseIcon className="w-6 h-6" />, section: 'projects', action: () => router.push('/dashboard/admin/projects') },
    { name: 'Transações', icon: <CashIcon className="w-6 h-6" />, section: 'transactions', action: () => router.push('/dashboard/admin/transactions') },
    { name: 'Módulos', icon: <PuzzleIcon className="w-6 h-6" />, section: 'modules', action: () => router.push('/dashboard/admin/modules') },
    { name: 'Disputas', icon: <BanIcon className="w-6 h-6" />, section: 'disputes', action: () => router.push('/dashboard/admin/disputes') },
    { name: 'Relatórios', icon: <DocumentReportIcon className="w-6 h-6" />, section: 'reports', action: () => router.push('/dashboard/admin/reports') },
    { name: 'Sistema', icon: <CogIcon className="w-6 h-6" />, section: 'system', action: () => router.push('/dashboard/admin/settings') },
    { name: 'Perfil', icon: <UserIcon className="w-6 h-6" />, section: 'profile', action: () => router.push('/dashboard/admin/profile') },
  ];

  return (
    <RequireAdminAuth>
      <div className="min-h-screen bg-gray-100">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            navItems={navItems} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            bgColor="bg-gray-800"
            bgColorDarker="bg-gray-900"
            title="Administração"
          />

          {/* Main content */}
          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            {/* Topo */}
            <Header 
              searchPlaceholder={searchPlaceholder || t('dashboard.searchPlaceholder')}
              onSearch={(term) => console.log('Pesquisando:', term)}
              notificationCount={3}
              messageCount={5}
            />

            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
              {children}
            </main>
          </div>
        </div>
      </div>
    </RequireAdminAuth>
  );
} 