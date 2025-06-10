import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { ChartBarIcon } from '@heroicons/react/outline';

export default function DigitalMarketing() {
  const { t } = useTranslation('common');

  const skills = [
    'Social Media Marketing',
    'SEO',
    'Content Marketing',
    'Email Marketing',
    'PPC Advertising',
    'Analytics',
    'Marketing Strategy',
    'Brand Development',
    'Marketing Automation',
    'Growth Hacking',
  ];

  const services = [
    {
      title: 'Social Media Management',
      description: 'Strategic social media presence and community engagement.',
    },
    {
      title: 'SEO Optimization',
      description: 'Improve your search engine rankings and online visibility.',
    },
    {
      title: 'Content Strategy',
      description: 'Engaging content creation and distribution strategies.',
    },
    {
      title: 'Digital Advertising',
      description: 'Targeted advertising campaigns across multiple platforms.',
    },
    {
      title: 'Email Marketing',
      description: 'Effective email campaigns and automation solutions.',
    },
    {
      title: 'Analytics & Reporting',
      description: 'Data-driven insights and performance tracking.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <ChartBarIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Digital Marketing
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Boost your online presence with expert digital marketing strategies
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
              Why Choose Our Digital Marketers?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Data-Driven Approach
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Make informed decisions based on analytics and performance metrics.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Industry Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with marketers who understand your industry and target audience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  ROI Focus
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Strategies designed to maximize your return on investment.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Integrated Solutions
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Comprehensive marketing solutions across multiple channels.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Digital Marketing Project
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