import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { TranslateIcon } from '@heroicons/react/outline';

export default function Translation() {
  const { t } = useTranslation('common');

  const skills = [
    'Document Translation',
    'Website Localization',
    'Technical Translation',
    'Legal Translation',
    'Medical Translation',
    'Literary Translation',
    'Subtitling',
    'Transcription',
    'Proofreading',
    'Editing',
  ];

  const services = [
    {
      title: 'Document Translation',
      description: 'Professional translation of documents, contracts, and official papers.',
    },
    {
      title: 'Website Localization',
      description: 'Adapt your website content for different languages and cultures.',
    },
    {
      title: 'Technical Translation',
      description: 'Specialized translation of technical documents and manuals.',
    },
    {
      title: 'Legal Translation',
      description: 'Accurate translation of legal documents and contracts.',
    },
    {
      title: 'Content Translation',
      description: 'Translation of marketing materials, articles, and creative content.',
    },
    {
      title: 'Subtitle Creation',
      description: 'Professional subtitling services for videos and multimedia content.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <TranslateIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Translation
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connect with professional translators to reach global audiences
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
              Why Choose Our Translators?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Native Speakers
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with native speakers who understand cultural nuances and context.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Subject Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get specialized translations from experts in your industry or field.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Quality Assurance
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  All translations undergo thorough quality checks and proofreading.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Fast Turnaround
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Meet your deadlines with efficient translation services and project management.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Translation Project
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