import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  EyeIcon,
  UserGroupIcon,
  ServerIcon,
} from '@heroicons/react/outline';

const features = [
  {
    name: 'Data Encryption',
    description: 'All data is encrypted in transit and at rest using industry-standard encryption protocols.',
    icon: LockClosedIcon,
  },
  {
    name: 'Secure Authentication',
    description: 'Multi-factor authentication and secure password policies protect your account.',
    icon: KeyIcon,
  },
  {
    name: 'Privacy Protection',
    description: 'Your personal information is protected and never shared without your consent.',
    icon: EyeIcon,
  },
  {
    name: 'Regular Security Audits',
    description: 'We conduct regular security assessments and penetration testing.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Access Control',
    description: 'Strict access controls and user permissions ensure data security.',
    icon: UserGroupIcon,
  },
  {
    name: 'Infrastructure Security',
    description: 'Our infrastructure is hosted in secure, certified data centers.',
    icon: ServerIcon,
  },
];

export default function Security() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary tracking-wide uppercase">
              Security
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Your Security is Our Priority
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              We implement industry-leading security measures to protect your data and privacy.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div>
                    <span className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <p className="mt-5 text-lg leading-6 font-medium text-gray-900">
                      {feature.name}
                    </p>
                  </div>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 bg-primary bg-opacity-5 rounded-2xl">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Report a Security Issue
                  </h2>
                  <p className="mt-3 max-w-3xl text-lg text-gray-500">
                    If you believe you've found a security vulnerability, please report it to our security team.
                  </p>
                  <div className="mt-8">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                    >
                      Contact Security Team
                    </a>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                  <div className="col-span-1 flex justify-center py-8 px-8">
                    <p className="text-center">
                      <span className="block text-4xl font-extrabold text-primary">24/7</span>
                      <span className="block mt-1 text-lg font-medium text-gray-500">Monitoring</span>
                    </p>
                  </div>
                  <div className="col-span-1 flex justify-center py-8 px-8">
                    <p className="text-center">
                      <span className="block text-4xl font-extrabold text-primary">100%</span>
                      <span className="block mt-1 text-lg font-medium text-gray-500">Compliance</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
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