import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { CalculatorIcon } from '@heroicons/react/outline';

export default function Accounting() {
  const { t } = useTranslation('common');

  const skills = [
    'Bookkeeping',
    'Financial Accounting',
    'Tax Preparation',
    'Payroll Management',
    'Financial Analysis',
    'Budgeting',
    'Audit Preparation',
    'Cost Accounting',
    'Financial Reporting',
    'QuickBooks',
  ];

  const services = [
    {
      title: 'Bookkeeping',
      description: 'Professional bookkeeping and financial record management.',
    },
    {
      title: 'Tax Services',
      description: 'Tax preparation and planning for businesses and individuals.',
    },
    {
      title: 'Financial Reports',
      description: 'Comprehensive financial statement preparation and analysis.',
    },
    {
      title: 'Payroll Services',
      description: 'Complete payroll processing and management solutions.',
    },
    {
      title: 'Audit Support',
      description: 'Professional assistance with audit preparation and support.',
    },
    {
      title: 'Financial Planning',
      description: 'Strategic financial planning and budgeting services.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <CalculatorIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Accounting
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Professional accounting services for your financial needs
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
              Why Choose Our Accounting Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Expert Knowledge
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with certified accountants with extensive experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Accuracy & Precision
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Meticulous attention to detail in all financial matters.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Compliance Focus
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Stay compliant with current financial regulations and standards.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Modern Tools
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Utilize the latest accounting software and technology solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post an Accounting Project
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