import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { VideoCameraIcon } from '@heroicons/react/outline';

export default function Video() {
  const { t } = useTranslation('common');

  const skills = [
    'Video Editing',
    'Video Production',
    'Motion Graphics',
    'Animation',
    'Visual Effects',
    'Color Grading',
    'Video Marketing',
    'Cinematography',
    'Post-Production',
    'Storyboarding',
  ];

  const services = [
    {
      title: 'Video Editing',
      description: 'Professional video editing and post-production services.',
    },
    {
      title: 'Video Production',
      description: 'Full-service video production from concept to completion.',
    },
    {
      title: 'Motion Graphics',
      description: 'Creative motion graphics and animation design.',
    },
    {
      title: 'Visual Effects',
      description: 'High-quality VFX and special effects creation.',
    },
    {
      title: 'Marketing Videos',
      description: 'Engaging video content for marketing and promotion.',
    },
    {
      title: 'Animation',
      description: '2D and 3D animation services for various purposes.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <VideoCameraIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Video Production
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Create stunning video content with professional videographers
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
              Why Choose Our Video Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Creative Excellence
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with talented videographers who bring your vision to life.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Technical Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Access to professional equipment and advanced editing tools.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Quality Production
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  High-quality video production with attention to detail.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Timely Delivery
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Efficient project management and on-time delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Video Project
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