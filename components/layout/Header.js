import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  MenuIcon,
  XIcon,
  UserCircleIcon,
  BellIcon,
  GlobeAltIcon,
} from '@heroicons/react/outline';
import Cookies from 'js-cookie';
import { Menu } from '@headlessui/react';

const navigation = [
  { name: 'nav.home', href: '/' },
  { name: 'nav.categories', href: '/categories' },
  { name: 'nav.howItWorks', href: '/how-it-works' },
  { name: 'nav.pricing', href: '/pricing' },
];

const userNavigation = [
  { name: 'auth.profile', href: '#', isProfile: true },
  { name: 'auth.projects', href: '#', isProjects: true },
  { name: 'auth.settings', href: '#', isSettings: true },
  { name: 'auth.logout', href: '/logout' },
];

export default function Header() {
  if (typeof window !== 'undefined') {
    console.log('[DEBUG][HEADER] Header mounted. URL:', window.location.href);
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    // Checa token no cookie ou localStorage
    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    
    setIsAuthenticated(!!token);
    setUserRole(role);
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const getProfileLink = () => {
    const locale = router.locale || 'pt';
    const prefix = locale === 'en' ? '' : `/${locale}`;
    if (userRole === 'ADMIN') {
      return `${prefix}/dashboard/admin/profile`;
    } else if (userRole === 'FREELANCER') {
      return `${prefix}/dashboard/freelancer/profile`;
    } else if (userRole === 'CLIENT') {
      return `${prefix}/dashboard/client/profile`;
    }
    return `/profile`;
  };

  const getProjectsLink = () => {
    const locale = router.locale || 'pt';
    const prefix = locale === 'en' ? '' : `/${locale}`;
    if (userRole === 'ADMIN') {
      return `${prefix}/dashboard/admin/projects`;
    } else if (userRole === 'FREELANCER') {
      return `${prefix}/dashboard/freelancer/my-jobs`;
    } else if (userRole === 'CLIENT') {
      return `${prefix}/dashboard/client/my-projects`;
    }
    return `/projects`;
  };

  const getSettingsLink = () => {
    const locale = router.locale || 'pt';
    const prefix = locale === 'en' ? '' : `/${locale}`;
    if (userRole === 'ADMIN') {
      return `${prefix}/dashboard/admin/settings`;
    } else if (userRole === 'FREELANCER') {
      return `${prefix}/dashboard/freelancer/settings`;
    } else if (userRole === 'CLIENT') {
      return `${prefix}/dashboard/client/settings`;
    }
    return `/settings`;
  };

  const handleUserMenuOpen = () => {
    // Sempre ler o valor mais recente do localStorage
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    setUserRole(role);
    setUserMenuOpen((open) => !open);
  };

  const isValidRole = userRole === 'FREELANCER' || userRole === 'CLIENT' || userRole === 'ADMIN';

  if (!isHydrated) {
    return (
      <header className="bg-white shadow h-16 flex items-center justify-center">
        <span className="text-gray-400 animate-pulse">...</span>
      </header>
    );
  }

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <img
                  className="h-12 w-auto"
                  src="/img/4.svg"
                  alt="Vacancy.service"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    router.pathname === item.href
                      ? 'border-primary text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {t(item.name)}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="relative ml-3">
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center">
                  <GlobeAltIcon className="h-6 w-6" aria-hidden="true" />
                  <span className="ml-2 text-sm text-gray-700">{i18n.language === 'pt' ? 'Português' : 'English'}</span>
                </Menu.Button>
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            i18n.changeLanguage('pt');
                            localStorage.setItem('language', 'pt');
                            document.cookie = 'NEXT_LOCALE=pt; path=/';
                            const path = router.asPath.startsWith('/pt') || router.asPath.startsWith('/en')
                              ? router.asPath.replace(/^\/en/, '/pt')
                              : `/pt${router.asPath}`;
                            router.push(path, path, { locale: 'pt' });
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'pt' ? 'font-bold text-primary' : 'text-gray-700'} ${active ? 'bg-gray-100' : ''}`}
                        >
                          Português
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
              <button
                          onClick={() => {
                            i18n.changeLanguage('en');
                            localStorage.setItem('language', 'en');
                            document.cookie = 'NEXT_LOCALE=en; path=/';
                            const path = router.asPath.startsWith('/pt') || router.asPath.startsWith('/en')
                              ? router.asPath.replace(/^\/pt/, '/en')
                              : `/en${router.asPath}`;
                            router.push(path, path, { locale: 'en' });
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'font-bold text-primary' : 'text-gray-700'} ${active ? 'bg-gray-100' : ''}`}
                        >
                          English
              </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>

            {isAuthenticated && isHydrated && isValidRole ? (
              <>
                <div className="relative ml-3">
                  <button
                    type="button"
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <span className="sr-only">{t('nav.notifications')}</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="relative ml-3">
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={handleUserMenuOpen}
                  >
                    <span className="sr-only">{t('nav.userMenu')}</span>
                    <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  </button>
                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      {userNavigation.map((item) => {
                        if (item.name === 'auth.logout') {
                          return (
                          <button
                            key={item.name}
                            onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {t(item.name)}
                          </button>
                          );
                        } else if (item.isProfile) {
                          return (
                            <Link
                              key={item.name}
                              href={getProfileLink()}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              {t(item.name)}
                            </Link>
                          );
                        } else if (item.isProjects) {
                          return (
                            <Link
                              key={item.name}
                              href={getProjectsLink()}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              {t(item.name)}
                            </Link>
                          );
                        } else if (item.isSettings) {
                          return (
                            <Link
                              key={item.name}
                              href={getSettingsLink()}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              {t(item.name)}
                            </Link>
                          );
                        } else {
                          return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {t(item.name)}
                        </Link>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-8">
                <Link
                  href="/auth/login"
                  className="text-gray-500 hover:text-gray-900 font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{t('nav.openMenu')}</span>
              {mobileMenuOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative bg-white">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    router.pathname === item.href
                      ? 'bg-primary border-primary text-white'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.name)}
                </Link>
              ))}

              {!isAuthenticated && (
                <>
                  <Link
                    href="/auth/login"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>

            {isAuthenticated && (
              <>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{t('auth.user')}</div>
                      <div className="text-sm font-medium text-gray-500">{t('auth.email')}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => {
                      if (item.name === 'auth.logout') {
                        return (
                          <button
                            key={item.name}
                            onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                            className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                          >
                            {t(item.name)}
                          </button>
                        );
                      } else if (item.isProfile) {
                        return (
                          <Link
                            key={item.name}
                            href={getProfileLink()}
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t(item.name)}
                          </Link>
                        );
                      } else if (item.isProjects) {
                        return (
                          <Link
                            key={item.name}
                            href={getProjectsLink()}
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t(item.name)}
                          </Link>
                        );
                      } else if (item.isSettings) {
                        return (
                          <Link
                            key={item.name}
                            href={getSettingsLink()}
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t(item.name)}
                          </Link>
                        );
                      } else {
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t(item.name)}
                          </Link>
                        );
                      }
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 