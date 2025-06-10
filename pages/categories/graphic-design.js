import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { PencilAltIcon } from '@heroicons/react/outline';

export default function GraphicDesign() {
  const { t } = useTranslation('common');

  const skills = [
    'Logo Design',
    'Brand Identity',
    'Print Design',
    'Social Media Design',
    'Packaging Design',
    'Illustration',
    'Typography',
    'Motion Graphics',
    'UI/UX Design',
    'Digital Art',
  ];

  const services = [
    {
      title: 'Logo & Brand Identity',
      description: 'Create a unique visual identity that represents your brand and resonates with your audience.',
    },
    {
      title: 'Marketing Materials',
      description: 'Design eye-catching marketing materials including brochures, flyers, banners, and social media graphics.',
    },
    {
      title: 'Packaging Design',
      description: 'Develop attractive and functional packaging designs that stand out on the shelf.',
    },
    {
      title: 'Digital Design',
      description: 'Create engaging digital assets for websites, apps, and social media platforms.',
    },
    {
      title: 'Print Design',
      description: 'Design professional print materials from business cards to large format displays.',
    },
    {
      title: 'Illustration & Art',
      description: 'Custom illustrations and artwork for various applications and mediums.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <PencilAltIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Graphic Design
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connect with talented graphic designers to bring your visual ideas to life
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
              Why Choose Our Graphic Designers?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Creative Excellence
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Our graphic designers bring creativity and innovation to every project, ensuring unique and impactful designs.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Professional Quality
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get high-quality, print-ready designs that meet industry standards and exceed expectations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Brand Consistency
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Maintain consistent brand identity across all your marketing materials and platforms.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Timely Delivery
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Meet your deadlines with efficient project management and timely delivery of design assets.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Graphic Design Project
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