import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { DesktopComputerIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const skills = [
  'Technical Support',
  'Network Administration',
  'System Maintenance',
  'IT Consulting',
  'Help Desk Support',
  'Cloud Services',
  'Hardware Support',
  'Software Support',
  'System Administration',
  'IT Infrastructure',
];

const services = [
  {
    title: 'Technical Support',
    description: 'Remote and on-site technical support for hardware and software issues',
  },
  {
    title: 'IT Consulting',
    description: 'Strategic IT consulting and technology implementation services',
  },
  {
    title: 'Network Management',
    description: 'Network setup, maintenance, and security management',
  },
  {
    title: 'System Administration',
    description: 'Server management, maintenance, and system optimization',
  },
  {
    title: 'Cloud Services',
    description: 'Cloud migration, setup, and management services',
  },
  {
    title: 'Help Desk Support',
    description: '24/7 help desk support for businesses and organizations',
  },
];

export default function ITSupport() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <DesktopComputerIcon className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              IT Support Services
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Professional IT support and technical services to keep your business running smoothly.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">Popular Services</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {service.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">Common Skills</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="col-span-1 flex justify-center py-3 px-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Why Choose Our IT Support Professionals?
            </h2>
            <div className="mt-6">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    24/7 Support
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Round-the-clock technical support for your business needs.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Expert Knowledge
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Certified professionals with extensive technical expertise.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Quick Response
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Fast response times and efficient problem resolution.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Comprehensive Solutions
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    End-to-end IT support and maintenance services.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/post-project"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post an IT Support Project
            </Link>
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