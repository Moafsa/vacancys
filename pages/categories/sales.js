import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { CurrencyDollarIcon } from '@heroicons/react/outline';

export default function Sales() {
  const { t } = useTranslation('common');

  const skills = [
    'Sales Strategy',
    'Lead Generation',
    'Sales Management',
    'Business Development',
    'Account Management',
    'Sales Analytics',
    'Negotiation',
    'CRM Management',
    'Sales Training',
    'Channel Sales',
  ];

  const services = [
    {
      title: 'Sales Strategy',
      description: 'Develop effective sales strategies and growth plans.',
    },
    {
      title: 'Lead Generation',
      description: 'Targeted lead generation and prospect qualification.',
    },
    {
      title: 'Sales Management',
      description: 'Professional sales team and pipeline management.',
    },
    {
      title: 'Business Development',
      description: 'Strategic business development and partnership building.',
    },
    {
      title: 'Sales Training',
      description: 'Comprehensive sales training and skill development.',
    },
    {
      title: 'Sales Analytics',
      description: 'Data-driven sales analysis and performance tracking.',
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
              Sales
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Drive revenue growth with expert sales professionals
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
              Why Choose Our Sales Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Proven Track Record
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with sales experts who have demonstrated success in driving results.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Industry Knowledge
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Benefit from professionals who understand your market and industry.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Results-Oriented
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Focus on achieving measurable sales targets and growth objectives.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Modern Techniques
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Utilize current sales methodologies and technology solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Sales Project
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