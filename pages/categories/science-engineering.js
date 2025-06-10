import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { BeakerIcon } from '@heroicons/react/outline';

export default function ScienceEngineering() {
  const { t } = useTranslation('common');

  const skills = [
    'Mechanical Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Data Science',
    'Research & Development',
    'CAD Design',
    'Prototyping',
    'Scientific Analysis',
    'Technical Documentation',
  ];

  const services = [
    {
      title: 'Engineering Design',
      description: 'Professional engineering design services for various industries and applications.',
    },
    {
      title: 'Technical Research',
      description: 'Comprehensive research and analysis for scientific and engineering projects.',
    },
    {
      title: 'Product Development',
      description: 'End-to-end product development from concept to prototype.',
    },
    {
      title: 'Scientific Analysis',
      description: 'Data analysis and scientific research for informed decision-making.',
    },
    {
      title: 'Technical Documentation',
      description: 'Detailed technical documentation and engineering specifications.',
    },
    {
      title: 'Consulting Services',
      description: 'Expert consulting in various scientific and engineering fields.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <BeakerIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Science & Engineering
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connect with experts in science and engineering for your technical projects
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
              Why Choose Our Science & Engineering Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Technical Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with highly qualified professionals with advanced degrees and industry experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Innovation Focus
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Access cutting-edge solutions and innovative approaches to technical challenges.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Quality Standards
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  All work follows industry standards and best practices for quality assurance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Project Management
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Efficient project management and clear communication throughout the process.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Science & Engineering Project
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