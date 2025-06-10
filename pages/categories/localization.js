import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { GlobeAltIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const skills = [
  'Translation',
  'Localization',
  'Cultural Adaptation',
  'Content Translation',
  'Software Localization',
  'Website Localization',
  'Transcreation',
  'Multilingual SEO',
  'Subtitling',
  'Language QA',
];

const services = [
  {
    title: 'Website Localization',
    description: 'Professional website translation and cultural adaptation services',
  },
  {
    title: 'Software Localization',
    description: 'Software and app localization for global markets',
  },
  {
    title: 'Content Translation',
    description: 'High-quality translation of marketing and business content',
  },
  {
    title: 'Cultural Consulting',
    description: 'Expert guidance on cultural adaptation and market entry',
  },
  {
    title: 'Multilingual SEO',
    description: 'SEO optimization for multiple languages and markets',
  },
  {
    title: 'Transcreation Services',
    description: 'Creative adaptation of marketing content for different cultures',
  },
];

export default function Localization() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GlobeAltIcon className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Localization Services
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Connect with expert translators and localization specialists to help your business reach global markets effectively.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">Popular Services</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {service.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">Common Skills</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="col-span-1 flex justify-center py-3 px-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Why Choose Our Localization Professionals?
            </h2>
            <div className="mt-6">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Native Expertise
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Our translators are native speakers with deep cultural understanding.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Quality Assurance
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Rigorous quality control and review processes for accuracy.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Cultural Adaptation
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Expert cultural consulting for successful market entry.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Technical Expertise
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Specialized knowledge in software and technical localization.
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/post-project"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Localization Project
            </Link>
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