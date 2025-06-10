import { BellIcon, MailIcon, SearchIcon, ViewGridIcon, LogoutIcon } from '@heroicons/react/outline';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import AccountVerification from '../profile/AccountVerification';

/**
 * Header component for dashboard pages
 * 
 * @param {Object} props
 * @param {string} props.searchPlaceholder - Placeholder text for search input
 * @param {Function} props.onSearch - Function to handle search
 * @param {React.ReactNode} props.userImage - User profile image
 * @param {Function} props.onMobileMenuToggle - Function to toggle mobile menu
 * @param {number} props.notificationCount - Number of notifications
 * @param {number} props.messageCount - Number of messages
 */
export default function Header({
  searchPlaceholder = '',
  onSearch,
  onMobileMenuToggle,
  notificationCount,
  messageCount
}) {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [hasFreelancerProfile, setHasFreelancerProfile] = useState(false);
  const [hasClientProfile, setHasClientProfile] = useState(false);
  const { t } = useTranslation('common');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  
  // Carregar informações do usuário
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedEmail = localStorage.getItem('email') || '';
    console.log('Header - storedRole:', storedRole, 'storedEmail:', storedEmail);
    setUserRole(storedRole);
    setUserEmail(storedEmail);
    
    // SEMPRE mostrar opções de navegação para todos os painéis
    // Isso permite que qualquer usuário veja os botões, mas o acesso real
    // será controlado pelos guardas nas páginas
    setHasFreelancerProfile(true);
    setHasClientProfile(true);
    
    console.log('Header - Habilitando navegação entre painéis');
  }, []);
  
  useEffect(() => {
    async function fetchStatus() {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const user = await res.json();
        setVerificationStatus(user.accountVerification?.status || null);
        if (user.avatarUrl) {
          setAvatarUrl(user.avatarUrl);
        }
      }
    }
    fetchStatus();
  }, []);
  
  const handleLogout = () => {
    // Limpar dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    
    // Redirecionar para a página de login
    router.push('/auth/login');
  };
  
  // Determinar quais painéis mostrar baseado na rota atual
  const currentPath = router.pathname;
  const isAdminDashboard = currentPath.includes('/dashboard/admin');
  const isFreelancerDashboard = currentPath.includes('/dashboard/freelancer');
  const isClientDashboard = currentPath.includes('/dashboard/client');
  
  const switchToDashboard = (dashboard) => {
    router.push(`/dashboard/${dashboard}`);
  };
  
  // Verificar se o usuário é admin
  const isAdmin = userRole === 'ADMIN' || userEmail.includes('admin');
  
  return (
    <>
      {/* Aviso de verificação de conta */}
      {(verificationStatus === 'PENDING' || verificationStatus === 'REJECTED') && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 flex items-center justify-between">
          <span>{t('accountVerification.notVerifiedWarning')}</span>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded ml-4" onClick={() => setShowVerification(true)}>
            {t('accountVerification.verifyButton')}
          </button>
        </div>
      )}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowVerification(false)}>&times;</button>
            <AccountVerification verificationStatus={verificationStatus} onSubmitted={() => { setShowVerification(false); setVerificationStatus('PENDING'); }} />
          </div>
        </div>
      )}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
        <div className="flex-1 flex items-center">
          <div className="md:hidden">
            <button 
              onClick={onMobileMenuToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <ViewGridIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="max-w-2xl w-full">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={t('dashboard.searchPlaceholder')}
                type="search"
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <div className="flex space-x-2">
            {isAdmin && !isAdminDashboard && (
              <button 
                onClick={() => switchToDashboard('admin/users')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                    {t('dashboard.adminLabel')}
              </button>
            )}
            {!isFreelancerDashboard && (
              <button 
                onClick={() => switchToDashboard('freelancer')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                    {t('dashboard.freelancerLabel')}
              </button>
            )}
            {!isClientDashboard && (
              <button 
                onClick={() => switchToDashboard('client')}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                    {t('dashboard.clientLabel')}
              </button>
            )}
          </div>

          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative">
            <MailIcon className="h-6 w-6" />
            {messageCount > 0 && (
              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                {messageCount > 9 ? '9+' : messageCount}
              </span>
            )}
          </button>
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative">
            <BellIcon className="h-6 w-6" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center focus:outline-none">
              <img
                className="h-8 w-8 rounded-full"
                src={avatarUrl}
                alt="User profile"
              />
              <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <Menu.Item>
                {({ active }) => {
                  // Determine perfil baseado na rota atual
                  let profileLink = '/profile';
                  if (isAdminDashboard) {
                    profileLink = '/dashboard/admin/profile';
                  } else if (isFreelancerDashboard) {
                    profileLink = '/dashboard/freelancer/profile';
                  } else if (isClientDashboard) {
                    profileLink = '/dashboard/client/profile';
                  }
                  
                  return (
                    <a
                      href={profileLink}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      Your Profile
                    </a>
                  )
                }}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => {
                  // Determine settings baseado na rota atual
                  let settingsLink = '/settings';
                  if (isAdminDashboard) {
                    settingsLink = '/dashboard/admin/settings';
                  } else if (isFreelancerDashboard) {
                    settingsLink = '/dashboard/freelancer/settings';
                  } else if (isClientDashboard) {
                    settingsLink = '/dashboard/client/settings';
                  }
                  
                  return (
                    <a
                      href={settingsLink}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      Settings
                    </a>
                  )
                }}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
      </header>
    </>
  );
} 