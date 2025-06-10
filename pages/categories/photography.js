import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { PhotographIcon } from '@heroicons/react/outline';

export default function Photography() {
  const { t } = useTranslation('common');

  const skills = [
    'Portrait Photography',
    'Commercial Photography',
    'Event Photography',
    'Product Photography',
    'Photo Editing',
    'Retouching',
    'Fashion Photography',
    'Real Estate Photography',
    'Food Photography',
    'Lifestyle Photography',
  ];

  const services = [
    {
      title: 'Portrait Photography',
      description: 'Professional portrait and headshot photography services.',
    },
    {
      title: 'Commercial Photography',
      description: 'High-quality commercial and advertising photography.',
    },
    {
      title: 'Event Coverage',
      description: 'Comprehensive event photography and documentation.',
    },
    {
      title: 'Product Photography',
      description: 'Professional product photography for e-commerce and marketing.',
    },
    {
      title: 'Photo Editing',
      description: 'Expert photo editing and retouching services.',
    },
    {
      title: 'Real Estate Photography',
      description: 'Professional real estate and architectural photography.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <PhotographIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Photography
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Capture stunning moments with professional photographers
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
              Why Choose Our Photographers?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Professional Quality
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with experienced photographers who deliver stunning results.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Creative Vision
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Unique perspectives and artistic approaches to photography.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Advanced Equipment
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Access to professional photography gear and editing tools.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Fast Delivery
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Quick turnaround times and efficient project management.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Photography Project
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