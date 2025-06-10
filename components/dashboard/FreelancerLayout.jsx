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
  LightningBoltIcon,
  AcademicCapIcon,
  CogIcon
} from '@heroicons/react/outline';
import { Header, Sidebar } from './';
import { useTranslation } from 'next-i18next';

// RequireUserAuth reutilizado em todas as páginas do freelancer
function RequireUserAuth({ children }) {
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

export default function FreelancerLayout({ children }) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = router.pathname;
  
  // Determinar a seção ativa com base na URL atual
  const getActiveSection = () => {
    if (pathname.includes('/profile')) return 'profile';
    if (pathname.includes('/find-work')) return 'find-work';
    if (pathname.includes('/my-jobs')) return 'my-jobs';
    if (pathname.includes('/proposals')) return 'proposals';
    if (pathname.includes('/messages')) return 'messages';
    if (pathname.includes('/stats')) return 'stats';
    if (pathname.includes('/payments')) return 'payments';
    if (pathname.includes('/credits')) return 'credits';
    if (pathname.includes('/skills')) return 'skills';
    if (pathname.includes('/settings')) return 'settings';
    return 'dashboard'; // padrão para /dashboard/freelancer
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
      router.push('/dashboard/freelancer');
    } else {
      router.push(`/dashboard/freelancer/${section}`);
    }
  };

  // Usar a mesma estrutura de itens de navegação que estava na página do dashboard
  const navItems = [
    { name: 'Dashboard', icon: <ChartBarIcon className="w-5 h-5" />, section: 'dashboard' },
    { name: 'Find Work', icon: <SearchIcon className="w-5 h-5" />, section: 'find-work' },
    { name: 'My Jobs', icon: <BriefcaseIcon className="w-5 h-5" />, section: 'my-jobs' },
    { name: 'Proposals', icon: <DocumentTextIcon className="w-5 h-5" />, section: 'proposals' },
    { name: 'Messages', icon: <ChatIcon className="w-5 h-5" />, section: 'messages', badge: 5 },
    { name: 'My Profile', icon: <UserIcon className="w-5 h-5" />, section: 'profile' },
    { name: 'My Stats', icon: <ChartBarIcon className="w-5 h-5" />, section: 'stats' },
    { name: 'Payments', icon: <CreditCardIcon className="w-5 h-5" />, section: 'payments' },
    { name: 'Credits', icon: <LightningBoltIcon className="w-5 h-5" />, section: 'credits' },
    { name: 'Skills', icon: <AcademicCapIcon className="w-5 h-5" />, section: 'skills' },
    { name: 'Settings', icon: <CogIcon className="w-5 h-5" />, section: 'settings' },
  ];

  return (
    <RequireUserAuth>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            navItems={navItems} 
            activeSection={activeSection} 
            setActiveSection={handleSectionChange} 
            bgColor="bg-gradient-to-b from-green-600 to-green-700"
            bgColorDarker="bg-green-800"
            bgColorHover="bg-green-500"
            title="Vacancy Freelancer"
          />

          {/* Main content */}
          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            {/* Top bar */}
            <Header 
              searchPlaceholder={t('dashboard.searchPlaceholder')}
              onSearch={(term) => console.log('Searching for:', term)}
              onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              notificationCount={3}
              messageCount={5}
            />

            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              {children}
            </main>
          </div>
        </div>
      </div>
    </RequireUserAuth>
  );
}