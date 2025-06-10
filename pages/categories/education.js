import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { AcademicCapIcon } from '@heroicons/react/outline';

export default function Education() {
  const { t } = useTranslation('common');

  const skills = [
    'Online Teaching',
    'Course Creation',
    'Tutoring',
    'Curriculum Development',
    'Educational Content',
    'Language Teaching',
    'Test Preparation',
    'Academic Writing',
    'E-learning Development',
    'Educational Technology',
  ];

  const services = [
    {
      title: 'Online Tutoring',
      description: 'One-on-one or group tutoring sessions in various subjects and levels.',
    },
    {
      title: 'Course Development',
      description: 'Create comprehensive online courses with engaging content and assessments.',
    },
    {
      title: 'Educational Content',
      description: 'Develop educational materials, lesson plans, and learning resources.',
    },
    {
      title: 'Test Preparation',
      description: 'Expert guidance for standardized tests and academic examinations.',
    },
    {
      title: 'Language Learning',
      description: 'Language instruction and conversation practice with native speakers.',
    },
    {
      title: 'E-learning Solutions',
      description: 'Design and develop interactive e-learning modules and platforms.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <AcademicCapIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Education
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connect with education professionals to enhance learning experiences
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
              Why Choose Our Education Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Qualified Educators
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with experienced teachers and education professionals with proven track records.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Personalized Approach
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get customized learning solutions that match individual needs and learning styles.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Modern Methods
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Benefit from innovative teaching methods and the latest educational technology.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Flexible Learning
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Access education services at your convenience with flexible scheduling options.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post an Education Project
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