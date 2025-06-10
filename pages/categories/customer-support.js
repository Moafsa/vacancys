import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { ChatAltIcon } from '@heroicons/react/outline';

export default function CustomerSupport() {
  const { t } = useTranslation('common');

  const skills = [
    'Customer Service',
    'Technical Support',
    'Help Desk',
    'Live Chat Support',
    'Email Support',
    'Phone Support',
    'CRM Systems',
    'Problem Resolution',
    'Customer Experience',
    'Support Documentation',
  ];

  const services = [
    {
      title: 'Customer Service',
      description: 'Professional customer service and support management.',
    },
    {
      title: 'Technical Support',
      description: 'Expert technical support for products and services.',
    },
    {
      title: 'Help Desk',
      description: 'Comprehensive help desk and ticket management.',
    },
    {
      title: 'Live Chat Support',
      description: 'Real-time chat support for immediate assistance.',
    },
    {
      title: 'Email Management',
      description: 'Professional email support and response handling.',
    },
    {
      title: 'Support Systems',
      description: 'Setup and management of customer support systems.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <ChatAltIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Customer Support
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Deliver exceptional customer service with professional support
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
              Why Choose Our Support Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Customer Focus
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Dedicated professionals committed to customer satisfaction.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Quick Response
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Fast and efficient response times to customer inquiries.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Problem Solving
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Effective resolution of customer issues and concerns.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Multi-Channel Support
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Support across various communication channels and platforms.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Customer Support Project
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