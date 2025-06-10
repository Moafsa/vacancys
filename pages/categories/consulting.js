import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { LightBulbIcon } from '@heroicons/react/outline';

export default function Consulting() {
  const { t } = useTranslation('common');

  const skills = [
    'Business Strategy',
    'Management Consulting',
    'Financial Analysis',
    'Market Research',
    'Process Optimization',
    'Risk Management',
    'Change Management',
    'Project Management',
    'Strategic Planning',
    'Business Analysis',
  ];

  const services = [
    {
      title: 'Business Strategy',
      description: 'Strategic planning and business growth consulting.',
    },
    {
      title: 'Management Consulting',
      description: 'Expert advice on organizational management and operations.',
    },
    {
      title: 'Financial Consulting',
      description: 'Financial analysis and strategic financial planning.',
    },
    {
      title: 'Market Analysis',
      description: 'In-depth market research and competitive analysis.',
    },
    {
      title: 'Process Optimization',
      description: 'Business process improvement and efficiency solutions.',
    },
    {
      title: 'Project Management',
      description: 'Professional project planning and execution guidance.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <LightBulbIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Consulting
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Expert guidance to help your business grow and succeed
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
              Why Choose Our Consultants?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Industry Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Access consultants with deep knowledge in your specific industry.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Strategic Thinking
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get innovative solutions and strategic insights for your business challenges.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Results-Driven
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Focus on achieving measurable outcomes and tangible results.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Customized Solutions
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Receive tailored advice that fits your specific business needs.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Consulting Project
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