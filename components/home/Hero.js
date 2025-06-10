import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { SearchIcon } from '@heroicons/react/outline';

export default function Hero() {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  const popularSearches = [
    { name: 'Web Development', href: '/categories/web-development' },
    { name: 'Logo Design', href: '/categories/graphic-design' },
    { name: 'Content Writing', href: '/categories/writing' },
    { name: 'App Development', href: '/categories/mobile-development' },
  ];
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Implementation for search functionality
  };
  
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Find the perfect</span>
                <span className="block text-primary">freelance services</span>
                <span className="block">for your business</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Connect with talented professionals worldwide
              </p>

              <div className="mt-8 sm:mx-auto sm:max-w-lg lg:mx-0">
                <div className="relative">
                  <input
                    type="text"
                    className="input pl-12"
                    placeholder="Try 'mobile app development'"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-gray-500">
                    Popular: {' '}
                    {popularSearches.map((item, index) => (
                      <span key={item.name}>
                        <a
                          href={item.href}
                          className="text-primary hover:text-primary-dark"
                        >
                          {item.name}
                        </a>
                        {index < popularSearches.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/img/hero.jpg"
          alt="Profissionais trabalhando"
        />
      </div>
    </div>
  );
} 