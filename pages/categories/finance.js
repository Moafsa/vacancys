import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { CurrencyDollarIcon } from '@heroicons/react/outline';

export default function Finance() {
  const { t } = useTranslation('common');

  const skills = [
    'Financial Analysis',
    'Accounting',
    'Bookkeeping',
    'Tax Planning',
    'Financial Planning',
    'Investment Analysis',
    'Business Valuation',
    'Risk Assessment',
    'Financial Modeling',
    'Budgeting',
  ];

  const services = [
    {
      title: 'Financial Analysis',
      description: 'Comprehensive financial analysis and reporting for business decisions.',
    },
    {
      title: 'Accounting Services',
      description: 'Professional accounting and bookkeeping services for businesses.',
    },
    {
      title: 'Tax Planning',
      description: 'Strategic tax planning and preparation services.',
    },
    {
      title: 'Financial Planning',
      description: 'Personalized financial planning and investment strategies.',
    },
    {
      title: 'Business Valuation',
      description: 'Expert business valuation and financial assessment services.',
    },
    {
      title: 'Risk Management',
      description: 'Identify and manage financial risks in your business operations.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <CurrencyDollarIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Finance
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connect with financial experts to manage and grow your business
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Popular Services
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Common Skills
            </h2>
            <div className="mt-8 flex flex-wrap gap-4">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-50 text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Why Choose Our Financial Experts?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Professional Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with certified financial professionals with years of industry experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Customized Solutions
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get tailored financial solutions that match your business needs and goals.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Confidentiality
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Your financial information is handled with the utmost security and confidentiality.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Comprehensive Service
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  From basic bookkeeping to complex financial strategy, get all your needs covered.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Finance Project
            </a>
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