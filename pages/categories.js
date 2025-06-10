import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import {
  CodeIcon,
  PencilAltIcon,
  PhotographIcon,
  VideoCameraIcon,
  ChartBarIcon,
  SpeakerphoneIcon,
  TranslateIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BeakerIcon,
  GlobeAltIcon,
  CogIcon,
  ShieldCheckIcon,
  ChartPieIcon,
} from '@heroicons/react/outline';

export default function Categories() {
  const { t } = useTranslation('common');

  const categories = [
    {
      name: 'Web Development',
      description: 'Website, web application and system development',
      icon: CodeIcon,
      href: '/categories/web-development',
      count: '2.5k+ Freelancers',
    },
    {
      name: 'Graphic Design',
      description: 'Logo creation, visual identity and graphic materials',
      icon: PencilAltIcon,
      href: '/categories/graphic-design',
      count: '1.8k+ Freelancers',
    },
    {
      name: 'Photography',
      description: 'Professional photography services and image editing',
      icon: PhotographIcon,
      href: '/categories/photography',
      count: '950+ Freelancers',
    },
    {
      name: 'Video and Animation',
      description: 'Video production, animations and motion graphics',
      icon: VideoCameraIcon,
      href: '/categories/video-animation',
      count: '1.2k+ Freelancers',
    },
    {
      name: 'Digital Marketing',
      description: 'Marketing strategies, SEO and social media management',
      icon: ChartBarIcon,
      href: '/categories/digital-marketing',
      count: '2.1k+ Freelancers',
    },
    {
      name: 'Advertising',
      description: 'Advertising campaign creation and media management',
      icon: SpeakerphoneIcon,
      href: '/categories/advertising',
      count: '850+ Freelancers',
    },
    {
      name: 'Translation',
      description: 'Translation and content localization services',
      icon: TranslateIcon,
      href: '/categories/translation',
      count: '1.5k+ Freelancers',
    },
    {
      name: 'Writing',
      description: 'Content creation, copywriting and ghostwriting',
      icon: DocumentTextIcon,
      href: '/categories/writing',
      count: '2.3k+ Freelancers',
    },
    {
      name: 'Finance',
      description: 'Financial consulting, accounting and planning',
      icon: CurrencyDollarIcon,
      href: '/categories/finance',
      count: '1.1k+ Freelancers',
    },
    {
      name: 'Education',
      description: 'Tutoring, online teaching and educational content creation',
      icon: AcademicCapIcon,
      href: '/categories/education',
      count: '1.4k+ Freelancers',
    },
    {
      name: 'Science and Engineering',
      description: 'Technical services, research and development',
      icon: BeakerIcon,
      href: '/categories/science-engineering',
      count: '950+ Freelancers',
    },
    {
      name: 'Localization',
      description: 'Localization and cultural adaptation services',
      icon: GlobeAltIcon,
      href: '/categories/localization',
      count: '750+ Freelancers',
    },
    {
      name: 'IT Support',
      description: 'Technical support, maintenance and IT consulting',
      icon: CogIcon,
      href: '/categories/it-support',
      count: '1.6k+ Freelancers',
    },
    {
      name: 'Security',
      description: 'Digital security and data protection services',
      icon: ShieldCheckIcon,
      href: '/categories/security',
      count: '800+ Freelancers',
    },
    {
      name: 'Data Analysis',
      description: 'Data analysis, business intelligence and reporting',
      icon: ChartPieIcon,
      href: '/categories/data-analysis',
      count: '1.3k+ Freelancers',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Categories
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Find the service you need
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Explore our wide range of service categories and find the best professionals for your project.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <category.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">{category.count}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-base text-gray-500">
              Can't find what you're looking for?{' '}
              <Link 
                href="/contact" 
                className="font-medium text-primary hover:text-primary-dark"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 