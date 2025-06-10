import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { SpeakerphoneIcon } from '@heroicons/react/outline';

export default function Advertising() {
  const { t } = useTranslation('common');

  const skills = [
    'Media Planning',
    'Campaign Strategy',
    'Ad Copywriting',
    'Display Advertising',
    'Social Media Ads',
    'Google Ads',
    'Facebook Ads',
    'LinkedIn Ads',
    'Ad Design',
    'Performance Marketing',
  ];

  const services = [
    {
      title: 'Campaign Strategy',
      description: 'Develop comprehensive advertising strategies aligned with your business goals.',
    },
    {
      title: 'Social Media Advertising',
      description: 'Create and manage targeted social media ad campaigns across platforms.',
    },
    {
      title: 'Search Engine Marketing',
      description: 'Drive qualified traffic through Google Ads and other search platforms.',
    },
    {
      title: 'Display Advertising',
      description: 'Design and manage eye-catching display ad campaigns for brand awareness.',
    },
    {
      title: 'Video Advertising',
      description: 'Create compelling video ad campaigns for various platforms.',
    },
    {
      title: 'Performance Marketing',
      description: 'Results-driven campaigns focused on measurable outcomes and ROI.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <SpeakerphoneIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Advertising
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connect with advertising experts to reach your target audience effectively
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
              Why Choose Our Advertising Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Strategic Approach
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Our professionals develop data-driven strategies to maximize your advertising ROI.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Platform Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with experts certified in major advertising platforms and networks.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Creative Excellence
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get compelling ad creatives that capture attention and drive action.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Performance Tracking
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Receive detailed analytics and reporting to track campaign performance.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post an Advertising Project
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