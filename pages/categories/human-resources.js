import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { UserGroupIcon } from '@heroicons/react/outline';

export default function HumanResources() {
  const { t } = useTranslation('common');

  const skills = [
    'Recruitment',
    'Talent Management',
    'HR Consulting',
    'Employee Relations',
    'Performance Management',
    'Training & Development',
    'Compensation & Benefits',
    'HR Policy',
    'Workforce Planning',
    'HR Analytics',
  ];

  const services = [
    {
      title: 'Recruitment Services',
      description: 'End-to-end recruitment and talent acquisition solutions.',
    },
    {
      title: 'HR Consulting',
      description: 'Strategic HR consulting and advisory services.',
    },
    {
      title: 'Training Programs',
      description: 'Custom training and development program design.',
    },
    {
      title: 'Policy Development',
      description: 'HR policy creation and implementation guidance.',
    },
    {
      title: 'Performance Systems',
      description: 'Performance management and evaluation frameworks.',
    },
    {
      title: 'HR Analytics',
      description: 'Data-driven HR insights and workforce analytics.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <UserGroupIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Human Resources
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Expert HR solutions to optimize your workforce management
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
              Why Choose Our HR Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Industry Experience
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with HR experts who understand your industry's unique challenges.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Strategic Approach
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get strategic HR solutions aligned with your business objectives.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Best Practices
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Benefit from current HR best practices and compliance standards.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Data-Driven Solutions
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Make informed decisions with data-backed HR insights and analytics.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post an HR Project
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