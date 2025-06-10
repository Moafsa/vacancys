import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { DocumentTextIcon } from '@heroicons/react/outline';

export default function Writing() {
  const { t } = useTranslation('common');

  const skills = [
    'Content Writing',
    'Copywriting',
    'Blog Writing',
    'Technical Writing',
    'Creative Writing',
    'SEO Writing',
    'Ghostwriting',
    'Editing',
    'Proofreading',
    'Research Writing',
  ];

  const services = [
    {
      title: 'Content Writing',
      description: 'High-quality content creation for websites, blogs, and digital platforms.',
    },
    {
      title: 'Copywriting',
      description: 'Persuasive copy that converts readers into customers.',
    },
    {
      title: 'Technical Writing',
      description: 'Clear and concise documentation, manuals, and technical guides.',
    },
    {
      title: 'SEO Content',
      description: 'Search engine optimized content that ranks and engages.',
    },
    {
      title: 'Creative Writing',
      description: 'Engaging stories, articles, and creative content.',
    },
    {
      title: 'Editing Services',
      description: 'Professional editing and proofreading to polish your content.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <DocumentTextIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Writing
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Connect with professional writers to create compelling content
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
              Why Choose Our Writers?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Expert Writers
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Work with experienced writers who understand your industry and audience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  SEO Optimized
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get content that ranks well in search engines and drives organic traffic.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Original Content
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Receive unique, plagiarism-free content tailored to your needs.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Quality Guaranteed
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  All content undergoes thorough editing and quality checks before delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Writing Project
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