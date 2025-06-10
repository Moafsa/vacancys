import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { MusicNoteIcon } from '@heroicons/react/outline';

export default function Music() {
  const { t } = useTranslation('common');

  const skills = [
    'Music Production',
    'Sound Engineering',
    'Music Composition',
    'Songwriting',
    'Audio Mixing',
    'Voice Over',
    'Sound Design',
    'Music Editing',
    'Music Arrangement',
    'Audio Mastering',
  ];

  const services = [
    {
      title: 'Music Production',
      description: 'Professional music production and recording services.',
    },
    {
      title: 'Sound Engineering',
      description: 'Expert sound engineering and audio processing.',
    },
    {
      title: 'Music Composition',
      description: 'Custom music composition for various purposes.',
    },
    {
      title: 'Audio Mixing',
      description: 'Professional mixing and audio post-production.',
    },
    {
      title: 'Voice Recording',
      description: 'High-quality voice over and vocal recording.',
    },
    {
      title: 'Sound Design',
      description: 'Creative sound design for media and entertainment.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <MusicNoteIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Music & Audio
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Create amazing music and audio content with professional artists
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
              Why Choose Our Music Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Professional Quality
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with experienced musicians and audio professionals.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Modern Equipment
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Access to professional-grade equipment and software.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Creative Vision
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Innovative approaches to bring your musical ideas to life.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Industry Experience
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Deep understanding of music industry standards and trends.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Music Project
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