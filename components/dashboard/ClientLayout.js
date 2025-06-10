import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  ChartBarIcon,
  SearchIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChatIcon,
  UserIcon,
  CreditCardIcon,
  ClipboardCheckIcon,
  CogIcon,
  PlusCircleIcon
} from '@heroicons/react/outline';
import { Header, Sidebar } from './';
import { useTranslation } from 'next-i18next';

// RequireClientAuth reutilizado em todas as páginas do cliente
function RequireClientAuth({ children }) {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      try {
        const res = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            router.push('/auth/login');
          }
          setLoading(false);
          return;
        }
        const data = await res.json();
        setRole(data.role);
        setLoading(false);
        if (data.role === 'ADMIN') router.push('/dashboard/admin');
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    }
    fetchRole();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return children;
}

export default function ClientLayout({ children }) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = router.pathname;
  
  // Determinar a seção ativa com base na URL atual
  const getActiveSection = () => {
    if (pathname.includes('/profile')) return 'profile';
    if (pathname.includes('/post-job')) return 'post-job';
    if (pathname.includes('/my-projects')) return 'my-projects';
    if (pathname.includes('/proposals')) return 'proposals';
    if (pathname.includes('/messages')) return 'messages';
    if (pathname.includes('/contracts')) return 'contracts';
    if (pathname.includes('/payments')) return 'payments';
    if (pathname.includes('/settings')) return 'settings';
    return 'dashboard'; // padrão para /dashboard/client
  };
  
  const [activeSection, setActiveSection] = useState(getActiveSection());
  
  // Atualizar a seção ativa quando a URL mudar
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [pathname]);
  
  // Navegar para a seção quando clicar no menu
  const handleSectionChange = (section) => {
    setActiveSection(section);
    
    if (section === 'dashboard') {
      router.push('/dashboard/client');
    } else {
      router.push(`/dashboard/client/${section}`);
    }
  };

  // Itens de navegação para o cliente
  const navItems = [
    { name: 'Dashboard', icon: <ChartBarIcon className="w-5 h-5" />, section: 'dashboard' },
    { name: 'Post a Job', icon: <PlusCircleIcon className="w-5 h-5" />, section: 'post-job' },
    { name: 'My Projects', icon: <BriefcaseIcon className="w-5 h-5" />, section: 'my-projects' },
    { name: 'Proposals', icon: <DocumentTextIcon className="w-5 h-5" />, section: 'proposals' },
    { name: 'Messages', icon: <ChatIcon className="w-5 h-5" />, section: 'messages', badge: 3 },
    { name: 'Contracts', icon: <ClipboardCheckIcon className="w-5 h-5" />, section: 'contracts' },
    { name: 'My Profile', icon: <UserIcon className="w-5 h-5" />, section: 'profile' },
    { name: 'Payments', icon: <CreditCardIcon className="w-5 h-5" />, section: 'payments' },
    { name: 'Settings', icon: <CogIcon className="w-5 h-5" />, section: 'settings' },
  ];

  return (
    <RequireClientAuth>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            navItems={navItems} 
            activeSection={activeSection} 
            setActiveSection={handleSectionChange} 
            bgColor="bg-gradient-to-b from-blue-600 to-blue-700"
            bgColorDarker="bg-blue-800"
            bgColorHover="bg-blue-500"
            title="Vacancy Client"
          />

          {/* Main content */}
          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            {/* Top bar */}
            <Header 
              searchPlaceholder={t('dashboard.searchPlaceholder')}
              onSearch={(term) => console.log('Searching for:', term)}
              onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              notificationCount={2}
              messageCount={3}
            />

            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              {children}
            </main>
          </div>
        </div>
      </div>
    </RequireClientAuth>
  );
} 