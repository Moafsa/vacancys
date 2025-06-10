import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { ClipboardListIcon } from '@heroicons/react/outline';

export default function Administrative() {
  const { t } = useTranslation('common');

  const skills = [
    'Virtual Assistance',
    'Data Entry',
    'Email Management',
    'Calendar Management',
    'Document Processing',
    'Customer Service',
    'Bookkeeping',
    'Research',
    'Office Administration',
    'Task Management',
  ];

  const services = [
    {
      title: 'Virtual Assistance',
      description: 'Comprehensive virtual assistant services for busy professionals.',
    },
    {
      title: 'Data Management',
      description: 'Accurate data entry and database management services.',
    },
    {
      title: 'Email & Calendar',
      description: 'Professional email and schedule management.',
    },
    {
      title: 'Document Processing',
      description: 'Efficient document preparation and organization.',
    },
    {
      title: 'Customer Support',
      description: 'Responsive customer service and support assistance.',
    },
    {
      title: 'Office Management',
      description: 'Complete administrative and office management solutions.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <ClipboardListIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Administrative Support
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Professional administrative assistance to streamline your operations
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
              Why Choose Our Administrative Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Experienced Support
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with skilled professionals who understand administrative processes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Reliable Service
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Count on consistent, dependable support for your administrative needs.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Time-Saving
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Free up your time to focus on core business activities.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Attention to Detail
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Meticulous attention to accuracy and organization in all tasks.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post an Administrative Project
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