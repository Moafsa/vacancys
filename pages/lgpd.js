import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import {
  ShieldCheckIcon,
  DocumentSearchIcon,
  UserGroupIcon,
  KeyIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ChatAlt2Icon,
  LockClosedIcon,
} from '@heroicons/react/outline';

export default function LGPD() {
  const { t } = useTranslation('common');

  const rights = [
    {
      name: 'Confirmation of Treatment Existence',
      description: 'You have the right to confirm whether we process your personal data.',
      icon: ShieldCheckIcon,
    },
    {
      name: 'Access to Data',
      description: 'You can access your personal data and request a copy of the data we process.',
      icon: DocumentSearchIcon,
    },
    {
      name: 'Data Correction',
      description: 'You can request correction of incomplete, outdated, or incorrect data.',
      icon: UserGroupIcon,
    },
    {
      name: 'Anonymization, Blocking, or Deletion',
      description: 'You can request anonymization, blocking, or deletion of unnecessary or excessive data.',
      icon: KeyIcon,
    },
    {
      name: 'Data Portability',
      description: 'You can request the transfer of your data to another service provider.',
      icon: DocumentDuplicateIcon,
    },
    {
      name: 'Revocation of Consent',
      description: 'You can revoke your consent for data processing at any time.',
      icon: TrashIcon,
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Data Protection Rights
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Your Rights Under Data Protection Laws
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We are committed to protecting your personal data and ensuring your privacy rights are respected.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rights.map((right) => (
                <div key={right.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <right.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900">{right.name}</h4>
                    <p className="mt-2 text-base text-gray-500">{right.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">How to Exercise Your Rights</h3>
              <p className="mt-2 text-base text-gray-500">
                To exercise your data protection rights, you can:
              </p>
              <ul className="mt-4 space-y-2 text-base text-gray-500">
                <li>• Contact our Data Protection Officer</li>
                <li>• Submit a request through our platform</li>
                <li>• Send an email to privacy@vacancy.service</li>
                <li>• Use our automated tools in your account settings</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Our Commitment to Data Protection</h3>
              <p className="mt-2 text-base text-gray-500">
                We implement various measures to protect your personal data:
              </p>
              <ul className="mt-4 space-y-2 text-base text-gray-500">
                <li>• Regular security assessments and updates</li>
                <li>• Employee training on data protection</li>
                <li>• Encryption of sensitive data</li>
                <li>• Access controls and authentication</li>
                <li>• Secure data storage and transmission</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <p className="mt-2 text-base text-gray-500">
                For any questions about your data protection rights or to submit a request, please contact us:
              </p>
              <div className="mt-4">
                <p className="text-base text-gray-500">
                  Email: privacy@vacancy.service
                </p>
                <p className="mt-2 text-base text-gray-500">
                  Address: 123 Data Protection Street, Privacy City, PC 12345
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
            >
              Contact Our Data Protection Team
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