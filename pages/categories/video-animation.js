import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { VideoCameraIcon } from '@heroicons/react/outline';

export default function VideoAnimation() {
  const { t } = useTranslation('common');

  const skills = [
    'Video Editing',
    'Motion Graphics',
    '2D Animation',
    '3D Animation',
    'Visual Effects',
    'Sound Design',
    'Color Grading',
    'Character Animation',
    'Storyboarding',
    'Video Production',
  ];

  const services = [
    {
      title: 'Video Production',
      description: 'Professional video production services for commercials, corporate videos, and promotional content.',
    },
    {
      title: 'Motion Graphics',
      description: 'Eye-catching motion graphics and animated elements for videos and presentations.',
    },
    {
      title: 'Animation',
      description: 'Custom 2D and 3D animations for various purposes, from explainer videos to entertainment.',
    },
    {
      title: 'Video Editing',
      description: 'Professional video editing services to transform raw footage into polished final products.',
    },
    {
      title: 'Visual Effects',
      description: 'Add stunning visual effects to enhance your videos and create immersive experiences.',
    },
    {
      title: 'Animated Logos',
      description: 'Bring your brand to life with animated logos and motion brand elements.',
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
              Video & Animation
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connect with expert video producers and animators to bring your ideas to motion
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
              Why Choose Our Video & Animation Professionals?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Creative Vision
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Our professionals bring creative solutions and unique perspectives to every project.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Technical Expertise
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with experts who master the latest video and animation software and techniques.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Custom Solutions
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get tailored video and animation solutions that match your specific needs and goals.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  End-to-End Service
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  From concept to final delivery, receive comprehensive support throughout your project.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Video & Animation Project
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