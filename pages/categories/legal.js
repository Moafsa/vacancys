import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { ScaleIcon } from '@heroicons/react/outline';

export default function Legal() {
  const { t } = useTranslation('common');

  const skills = [
    'Contract Law',
    'Business Law',
    'Intellectual Property',
    'Legal Research',
    'Legal Writing',
    'Corporate Law',
    'Compliance',
    'Legal Consulting',
    'Document Review',
    'Regulatory Affairs',
  ];

  const services = [
    {
      title: 'Contract Review',
      description: 'Professional review and drafting of legal contracts and agreements.',
    },
    {
      title: 'Legal Research',
      description: 'Thorough legal research and analysis for various matters.',
    },
    {
      title: 'IP Protection',
      description: 'Intellectual property protection and trademark services.',
    },
    {
      title: 'Legal Documentation',
      description: 'Preparation and review of legal documents and forms.',
    },
    {
      title: 'Compliance Services',
      description: 'Regulatory compliance and legal risk management.',
    },
    {
      title: 'Legal Consulting',
      description: 'Expert legal advice and consulting services.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <ScaleIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Legal Services
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Professional legal assistance for your business needs
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
              Why Choose Our Legal Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Expert Knowledge
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Access professionals with extensive legal expertise and qualifications.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Confidentiality
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Your sensitive legal matters are handled with complete confidentiality.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Timely Service
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Receive prompt and efficient legal assistance when you need it.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Comprehensive Support
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Full-range legal services to address various business needs.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Legal Project
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