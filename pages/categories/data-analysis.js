import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { ChartBarIcon } from '@heroicons/react/outline';
import Link from 'next/link';

const skills = [
  'Data Analysis',
  'Business Intelligence',
  'Data Visualization',
  'Statistical Analysis',
  'SQL',
  'Python',
  'R Programming',
  'Machine Learning',
  'Data Mining',
  'Power BI',
];

const services = [
  {
    title: 'Business Analytics',
    description: 'Data-driven insights and business performance analysis',
  },
  {
    title: 'Data Visualization',
    description: 'Creating interactive dashboards and visual reports',
  },
  {
    title: 'Statistical Analysis',
    description: 'Advanced statistical analysis and modeling',
  },
  {
    title: 'Market Research',
    description: 'Data-driven market research and competitor analysis',
  },
  {
    title: 'Predictive Analytics',
    description: 'Forecasting and predictive modeling services',
  },
  {
    title: 'Data Mining',
    description: 'Extracting insights from large datasets',
  },
];

export default function DataAnalysis() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ChartBarIcon className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Data Analysis Services
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Transform your data into actionable insights with our expert data analysts.
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
              Why Choose Our Data Analysis Professionals?
            </h2>
            <div className="mt-6">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Expert Analysis
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Skilled analysts with extensive experience in data analysis.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Advanced Tools
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Using the latest data analysis and visualization tools.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Actionable Insights
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Converting complex data into clear, actionable recommendations.
                  </dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    Custom Solutions
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    Tailored analysis solutions for your specific needs.
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
              Post a Data Analysis Project
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