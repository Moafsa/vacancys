import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { CodeIcon } from '@heroicons/react/outline';

export default function SoftwareDevelopment() {
  const { t } = useTranslation('common');

  const skills = [
    'Full Stack Development',
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Cloud Computing',
    'DevOps',
    'Database Design',
    'API Development',
    'Software Architecture',
    'Testing & QA',
  ];

  const services = [
    {
      title: 'Web Development',
      description: 'Custom web applications and websites built with modern technologies.',
    },
    {
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
    },
    {
      title: 'API Development',
      description: 'RESTful and GraphQL APIs for seamless system integration.',
    },
    {
      title: 'Cloud Solutions',
      description: 'Cloud-native applications and infrastructure solutions.',
    },
    {
      title: 'Software Testing',
      description: 'Comprehensive testing and quality assurance services.',
    },
    {
      title: 'DevOps Services',
      description: 'Continuous integration, deployment, and infrastructure automation.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <CodeIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Software Development
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Build your digital solutions with expert software developers
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
              Why Choose Our Software Developers?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Technical Excellence
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with skilled developers who follow best practices and modern development standards.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Scalable Solutions
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get solutions that grow with your business and adapt to changing requirements.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Agile Development
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Benefit from iterative development with regular updates and feedback integration.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Ongoing Support
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Receive continuous maintenance and support for your software solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Software Development Project
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