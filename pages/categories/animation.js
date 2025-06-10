import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { FilmIcon } from '@heroicons/react/outline';

export default function Animation() {
  const { t } = useTranslation('common');

  const skills = [
    '2D Animation',
    '3D Animation',
    'Motion Graphics',
    'Character Animation',
    'Visual Effects',
    'Storyboarding',
    'Rigging',
    'Animation Design',
    'After Effects',
    'Maya/3D Max',
  ];

  const services = [
    {
      title: '2D Animation',
      description: 'Professional 2D animation for various applications.',
    },
    {
      title: '3D Animation',
      description: 'High-quality 3D animation and modeling services.',
    },
    {
      title: 'Motion Graphics',
      description: 'Creative motion graphics for digital content.',
    },
    {
      title: 'Character Animation',
      description: 'Custom character design and animation.',
    },
    {
      title: 'Explainer Videos',
      description: 'Engaging animated explainer videos for businesses.',
    },
    {
      title: 'Visual Effects',
      description: 'Professional VFX and special effects animation.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <FilmIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Animation
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Bring your ideas to life with professional animators
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
              Why Choose Our Animators?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Creative Excellence
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with talented animators who bring creativity to every project.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Technical Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Professional knowledge of industry-standard animation tools.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Custom Solutions
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Tailored animation services to match your specific needs.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Quality Delivery
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  High-quality animations delivered within your timeline.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post an Animation Project
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