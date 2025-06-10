import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import {
  UserGroupIcon,
  LightBulbIcon,
  GlobeAltIcon,
  SparklesIcon,
} from '@heroicons/react/outline';

const values = [
  {
    name: 'Innovation',
    description: 'We constantly push boundaries to bring new solutions and opportunities to our community.',
    icon: LightBulbIcon,
  },
  {
    name: 'Global Community',
    description: 'We connect talented professionals with opportunities worldwide, breaking geographical barriers.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Excellence',
    description: 'We maintain high standards in every aspect of our platform and services.',
    icon: SparklesIcon,
  },
  {
    name: 'People First',
    description: 'We prioritize the success and satisfaction of our users in everything we do.',
    icon: UserGroupIcon,
  },
];

export default function About() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary tracking-wide uppercase">
              About Us
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Empowering Global Talent
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              We're building the future of work by connecting talented professionals with opportunities worldwide.
            </p>
          </div>
        </div>

        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
                Our Mission
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Revolutionizing the Way We Work
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our mission is to create a seamless platform where talent meets opportunity, enabling professionals and businesses to thrive in the digital age.
              </p>
            </div>

            <div className="mt-16">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {values.map((value) => (
                  <div key={value.name} className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                      <value.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {value.name}
                    </p>
                    <p className="mt-2 ml-16 text-base text-gray-500">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Story
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Founded with a vision to transform the future of work, Vacancy.service has grown into a global platform connecting talented professionals with businesses worldwide. Our journey began with a simple idea: to create a space where skills and opportunities know no boundaries.
              </p>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Today, we serve thousands of users across the globe, facilitating successful collaborations and helping businesses find the perfect talent for their needs. Our commitment to innovation and excellence continues to drive us forward as we expand our services and community.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
              <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                <p className="text-center">
                  <span className="block text-4xl font-extrabold text-primary">50K+</span>
                  <span className="block mt-1 text-lg font-medium text-gray-500">Active Users</span>
                </p>
              </div>
              <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                <p className="text-center">
                  <span className="block text-4xl font-extrabold text-primary">100+</span>
                  <span className="block mt-1 text-lg font-medium text-gray-500">Countries</span>
                </p>
              </div>
              <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                <p className="text-center">
                  <span className="block text-4xl font-extrabold text-primary">95%</span>
                  <span className="block mt-1 text-lg font-medium text-gray-500">Satisfaction Rate</span>
                </p>
              </div>
              <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                <p className="text-center">
                  <span className="block text-4xl font-extrabold text-primary">24/7</span>
                  <span className="block mt-1 text-lg font-medium text-gray-500">Support</span>
                </p>
              </div>
            </div>
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