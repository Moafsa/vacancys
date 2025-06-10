import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import {
  QuestionMarkCircleIcon,
  ChatIcon,
  DocumentTextIcon,
  AcademicCapIcon,
} from '@heroicons/react/outline';

const categories = [
  {
    name: 'Getting Started',
    description: 'Learn how to use our platform and start your freelancing journey.',
    icon: AcademicCapIcon,
    articles: [
      'How to create an account',
      'Setting up your profile',
      'Finding your first project',
      'Submitting proposals',
    ],
  },
  {
    name: 'Account & Settings',
    description: 'Manage your account settings, security, and preferences.',
    icon: DocumentTextIcon,
    articles: [
      'Account security',
      'Payment methods',
      'Notification settings',
      'Profile visibility',
    ],
  },
  {
    name: 'Payments & Billing',
    description: 'Everything about payments, invoices, and financial matters.',
    icon: QuestionMarkCircleIcon,
    articles: [
      'Payment methods',
      'Invoicing',
      'Service fees',
      'Withdrawal options',
    ],
  },
  {
    name: 'Support',
    description: 'Get help from our support team and community.',
    icon: ChatIcon,
    articles: [
      'Contact support',
      'Report an issue',
      'Community guidelines',
      'FAQ',
    ],
  },
];

export default function Help() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary tracking-wide uppercase">
              Help Center
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              How can we help you?
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Find answers to your questions and learn how to make the most of our platform.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="pt-6"
                >
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                          <category.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {category.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {category.description}
                      </p>
                      <div className="mt-5">
                        <ul className="space-y-3">
                          {category.articles.map((article) => (
                            <li key={article} className="text-sm">
                              <a href="#" className="text-primary hover:text-primary-dark">
                                {article}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 bg-primary bg-opacity-5 rounded-2xl">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Still need help?
                  </h2>
                  <p className="mt-3 max-w-3xl text-lg text-gray-500">
                    Our support team is available 24/7 to assist you with any questions or issues you may have.
                  </p>
                  <div className="mt-8 space-x-4">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                    >
                      Contact Support
                    </a>
                    <a
                      href="/faq"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
                    >
                      View FAQ
                    </a>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                  <div className="col-span-1 flex justify-center py-8 px-8">
                    <p className="text-center">
                      <span className="block text-4xl font-extrabold text-primary">24/7</span>
                      <span className="block mt-1 text-lg font-medium text-gray-500">Support</span>
                    </p>
                  </div>
                  <div className="col-span-1 flex justify-center py-8 px-8">
                    <p className="text-center">
                      <span className="block text-4xl font-extrabold text-primary">1hr</span>
                      <span className="block mt-1 text-lg font-medium text-gray-500">Avg. Response</span>
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