import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import {
  UserAddIcon,
  DocumentSearchIcon,
  ChatAlt2Icon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  SearchIcon,
  ChatIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/outline';

export default function HowItWorks() {
  const { t } = useTranslation('common');

  const freelancerSteps = [
    {
      id: 1,
      name: 'Create your profile',
      description: 'Sign up and create a professional profile showcasing your skills, experience, and portfolio.',
      icon: UserAddIcon,
    },
    {
      id: 2,
      name: 'Browse projects',
      description: 'Search through available projects that match your skills and interests.',
      icon: DocumentSearchIcon,
    },
    {
      id: 3,
      name: 'Submit proposals',
      description: "Send detailed proposals to clients explaining why you're the best fit for their project.",
      icon: ChatAlt2Icon,
    },
    {
      id: 4,
      name: 'Get hired',
      description: 'Once selected, start working on the project and communicate with your client through our platform.',
      icon: CheckCircleIcon,
    },
  ];

  const clientSteps = [
    {
      id: 1,
      name: 'Post your project',
      description: 'Create a detailed project description and specify your requirements.',
      icon: DocumentTextIcon,
    },
    {
      id: 2,
      name: 'Review proposals',
      description: 'Receive and review proposals from qualified freelancers.',
      icon: UserGroupIcon,
    },
    {
      id: 3,
      name: 'Choose a freelancer',
      description: 'Select the best freelancer for your project based on their experience and proposal.',
      icon: SearchIcon,
    },
    {
      id: 4,
      name: 'Start working',
      description: 'Begin your project and communicate with your freelancer through our platform.',
      icon: ChatIcon,
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              How It Works
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple and efficient process
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Whether you're a freelancer looking for projects or a client seeking talent, our platform makes it easy to connect and work together.
            </p>
          </div>

          <div className="mt-12">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                  For Freelancers
                </h3>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Follow these simple steps to start finding and working on projects:
                </p>
                <div className="mt-8 space-y-8">
                  {freelancerSteps.map((step) => (
                    <div key={step.id} className="relative">
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <step.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="ml-16">
                        <h4 className="text-lg font-medium text-gray-900">{step.name}</h4>
                        <p className="mt-2 text-base text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 -mx-4 relative lg:mt-0">
                <div className="relative space-y-6 lg:space-y-8 lg:px-4">
                  {clientSteps.map((step) => (
                    <div key={step.id} className="relative">
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <step.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="ml-16">
                        <h4 className="text-lg font-medium text-gray-900">{step.name}</h4>
                        <p className="mt-2 text-base text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">And</span>
              </div>
            </div>

            <div className="mt-6 relative">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Then</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <CurrencyDollarIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900">Get paid</h4>
                    <p className="mt-2 text-base text-gray-500">
                      Receive secure payments through our platform once the work is completed and approved.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900">Build your reputation</h4>
                    <p className="mt-2 text-base text-gray-500">
                      Earn reviews and ratings to build your professional reputation on the platform.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <ChatIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-16">
                    <h4 className="text-lg font-medium text-gray-900">Grow your network</h4>
                    <p className="mt-2 text-base text-gray-500">
                      Connect with more clients and freelancers to expand your professional network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
            >
              Get started today
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