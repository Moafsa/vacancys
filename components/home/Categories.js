import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import {
  CodeIcon,
  PencilAltIcon,
  PhotographIcon,
  ChartBarIcon,
  SpeakerphoneIcon,
  GlobeAltIcon,
  DesktopComputerIcon,
  DeviceMobileIcon,
  FilmIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BeakerIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  SupportIcon,
  ChartPieIcon,
} from '@heroicons/react/outline';

const categories = [
  {
    name: 'Web Development',
    description: 'Custom websites, web applications, and e-commerce solutions',
    icon: CodeIcon,
    href: '/categories/web-development',
  },
  {
    name: 'Mobile Development',
    description: 'iOS and Android apps, cross-platform solutions',
    icon: DeviceMobileIcon,
    href: '/categories/mobile-development',
  },
  {
    name: 'Design',
    description: 'User interface and experience design for digital products',
    icon: DesktopComputerIcon,
    href: '/categories/design',
  },
  {
    name: 'Writing',
    description: 'Blog posts, articles, and copywriting services',
    icon: DocumentTextIcon,
    href: '/categories/writing',
  },
  {
    name: 'Digital Marketing',
    description: 'SEO, social media, and online advertising',
    icon: SpeakerphoneIcon,
    href: '/categories/digital-marketing',
  },
  {
    name: 'Finance',
    description: 'Financial consulting, accounting and planning',
    icon: CurrencyDollarIcon,
    href: '/categories/finance',
  },
  {
    name: 'Photography',
    description: 'Professional photography and image editing',
    icon: PhotographIcon,
    href: '/categories/photography',
  },
  {
    name: 'Video & Animation',
    description: 'Video production, animation and motion graphics',
    icon: FilmIcon,
    href: '/categories/video',
  },
  {
    name: 'Localization',
    description: 'Translation and cultural adaptation services',
    icon: GlobeAltIcon,
    href: '/categories/localization',
  },
  {
    name: 'IT Support',
    description: 'Technical support, maintenance and IT consulting',
    icon: SupportIcon,
    href: '/categories/it-support',
  },
  {
    name: 'Security',
    description: 'Digital security and data protection services',
    icon: ShieldCheckIcon,
    href: '/categories/security',
  },
  {
    name: 'Data Analysis',
    description: 'Data analysis, business intelligence and reporting',
    icon: ChartPieIcon,
    href: '/categories/data-analysis',
  },
];

export default function Categories() {
  const { t } = useTranslation('common');

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
            {t('categories.title')}
          </h2>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                href={category.href}
                className="group"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white group-hover:bg-primary-dark">
                  <category.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link 
            href="/categories"
            className="text-primary hover:text-primary-dark font-medium"
          >
            {t('categories.viewAll')} →
          </Link>
        </div>
      </div>
    </div>
  );
} 