import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { ShieldCheckIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const skills = [
  'Cybersecurity',
  'Network Security',
  'Security Auditing',
  'Penetration Testing',
  'Risk Assessment',
  'Security Compliance',
  'Data Protection',
  'Incident Response',
  'Security Architecture',
  'Cloud Security',
];

const services = [
  {
    title: 'Cybersecurity Consulting',
    description: 'Expert security consulting and risk assessment services',
  },
  {
    title: 'Security Audits',
    description: 'Comprehensive security audits and vulnerability assessments',
  },
  {
    title: 'Network Security',
    description: 'Network security implementation and monitoring',
  },
  {
    title: 'Data Protection',
    description: 'Data security and privacy protection services',
  },
  {
    title: 'Incident Response',
    description: 'Emergency response and security incident handling',
  },
  {
    title: 'Security Training',
    description: 'Security awareness training and best practices education',
  },
];

export default function Security() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Security Services
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Protect your digital assets with our expert security professionals and comprehensive security services.
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
              Why Choose Our Security Professionals?
            </h2>
            <div className="mt-6">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Certified Experts
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Security professionals with industry-recognized certifications.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Proactive Protection
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Preventive security measures and continuous monitoring.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Compliance Focus
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Up-to-date with security regulations and compliance requirements.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Emergency Response
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Quick response to security incidents and threats.
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
              Post a Security Project
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