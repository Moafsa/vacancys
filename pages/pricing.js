import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import { CheckIcon } from '@heroicons/react/outline';

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const { t } = useTranslation('common');

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for getting started',
      price: annual ? 0 : 0,
      features: [
        'Up to 5 active proposals',
        'Basic profile badge',
        'Access to public projects',
        'Standard support',
      ],
      cta: 'Get Started',
      href: '/register',
      featured: false,
    },
    {
      name: 'Professional',
      description: 'For growing freelancers',
      price: annual ? 190 : 19,
      features: [
        'Up to 15 active proposals',
        'Verified profile badge',
        'Priority project access',
        'Featured profile listing',
        'Priority support',
        'Custom portfolio page',
      ],
      cta: 'Start Free Trial',
      href: '/register?plan=pro',
      featured: true,
    },
    {
      name: 'Enterprise',
      description: 'For established professionals',
      price: annual ? 490 : 49,
      features: [
        'Unlimited proposals',
        'Expert profile badge',
        'Early access to projects',
        'Premium profile placement',
        '24/7 priority support',
        'Custom portfolio page',
        'Client analytics dashboard',
        'Team collaboration tools',
      ],
      cta: 'Contact Sales',
      href: '/contact',
      featured: false,
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Pricing
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Choose the right plan for your freelance career
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to grow your freelance business
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="relative self-center bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
              <button
                onClick={() => setAnnual(false)}
                className={`${
                  !annual
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                } relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`${
                  annual
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                } relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8`}
              >
                Annual billing
              </button>
            </div>
          </div>

          <div className="mt-24 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 bg-white border ${
                  plan.featured
                    ? 'border-primary ring-2 ring-primary'
                    : 'border-gray-200'
                } rounded-2xl shadow-sm flex flex-col`}
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  {plan.featured && (
                    <p className="absolute top-0 -translate-y-1/2 transform rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white">
                      Most popular
                    </p>
                  )}
                  <p className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold">
                      /{annual ? 'year' : 'month'}
                    </span>
                  </p>
                  <p className="mt-6 text-gray-500">{plan.description}</p>

                  <ul className="mt-6 space-y-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex">
                        <CheckIcon
                          className="flex-shrink-0 w-6 h-6 text-primary"
                          aria-hidden="true"
                        />
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={plan.href}
                  className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                    plan.featured
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-primary-50 text-primary hover:bg-primary-100'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              Are you a client looking to post a project?
            </h3>
            <p className="mt-3 text-base text-gray-500 max-w-2xl mx-auto">
              Posting projects is completely free! Just sign up as a client and start connecting with talented freelancers.
            </p>
            <a
              href="/register?type=client"
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Project for Free
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