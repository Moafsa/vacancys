import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { DeviceMobileIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const skills = [
  'iOS Development',
  'Android Development',
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',
  'Mobile UI/UX',
  'App Testing',
  'App Publishing',
  'Cross-platform Development',
];

const services = [
  {
    title: 'iOS App Development',
    description: 'Native iOS applications for iPhone and iPad devices',
  },
  {
    title: 'Android App Development',
    description: 'Native Android applications for smartphones and tablets',
  },
  {
    title: 'Cross-platform Apps',
    description: 'Apps that work on both iOS and Android using React Native or Flutter',
  },
  {
    title: 'App UI/UX Design',
    description: 'Beautiful and intuitive mobile app interfaces',
  },
  {
    title: 'App Maintenance',
    description: 'Updates, bug fixes, and ongoing support for mobile apps',
  },
  {
    title: 'App Store Optimization',
    description: 'Improve app visibility and downloads in app stores',
  },
];

export default function MobileDevelopment() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <DeviceMobileIcon className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Mobile Development Services
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Create powerful mobile applications with our expert developers for iOS and Android platforms.
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
              Why Choose Our Mobile Developers?
            </h2>
            <div className="mt-6">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Expert Development
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Skilled developers with extensive mobile app development experience.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Cross-platform Expertise
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Build once, deploy everywhere with modern frameworks.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    User-Focused Design
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Beautiful and intuitive interfaces that users love.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Full App Lifecycle
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    From concept to app store launch and maintenance.
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
              Post a Mobile Development Project
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