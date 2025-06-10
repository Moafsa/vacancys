import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { ColorSwatchIcon } from '@heroicons/react/outline';

export default function Design() {
  const { t } = useTranslation('common');

  const skills = [
    'UI/UX Design',
    'Graphic Design',
    'Brand Identity',
    'Web Design',
    'Logo Design',
    'Illustration',
    'Motion Graphics',
    'Print Design',
    'Product Design',
    'Design Systems',
  ];

  const services = [
    {
      title: 'UI/UX Design',
      description: 'User-centered interface design and experience optimization.',
    },
    {
      title: 'Brand Design',
      description: 'Comprehensive brand identity and visual design systems.',
    },
    {
      title: 'Web Design',
      description: 'Beautiful and functional website designs that convert.',
    },
    {
      title: 'Graphic Design',
      description: 'Creative visual solutions for digital and print media.',
    },
    {
      title: 'Logo Design',
      description: 'Memorable and versatile logo design for your brand.',
    },
    {
      title: 'Motion Design',
      description: 'Engaging animations and motion graphics for digital content.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <ColorSwatchIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Design
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Transform your ideas into stunning visual experiences
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
              Why Choose Our Designers?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Creative Excellence
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with talented designers who bring fresh perspectives and innovative ideas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  User-Centered Design
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Designs that prioritize user experience and achieve business objectives.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Brand Consistency
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Maintain visual consistency across all your brand touchpoints.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Modern Aesthetics
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Contemporary design solutions that keep up with latest trends.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Design Project
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