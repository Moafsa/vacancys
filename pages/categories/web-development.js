import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { CodeIcon } from '@heroicons/react/outline';

export default function WebDevelopment() {
  const { t } = useTranslation('common');

  const skills = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'E-commerce Development',
    'CMS Development',
    'API Development',
    'Database Design',
    'Web Security',
    'Performance Optimization',
    'Responsive Design',
  ];

  const services = [
    {
      title: 'Custom Website Development',
      description: 'Get a unique, professionally designed website tailored to your business needs.',
    },
    {
      title: 'E-commerce Solutions',
      description: 'Build an online store with secure payment processing and inventory management.',
    },
    {
      title: 'Web Application Development',
      description: 'Create powerful web applications with modern frameworks and technologies.',
    },
    {
      title: 'API Development & Integration',
      description: 'Develop robust APIs and integrate third-party services into your web applications.',
    },
    {
      title: 'CMS Development',
      description: 'Build content management systems that make website updates easy and efficient.',
    },
    {
      title: 'Website Maintenance',
      description: 'Keep your website up-to-date, secure, and performing optimally.',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <CodeIcon className="h-12 w-12 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Web Development
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Find expert web developers to build and maintain your digital presence
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
              Why Choose Our Web Developers?
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Verified Professionals
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  All our web developers go through a rigorous verification process to ensure they have the skills and experience they claim.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Secure Payments
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Your payment is held in escrow until you approve the work, ensuring you only pay for satisfactory results.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Quality Guaranteed
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Our web developers follow industry best practices and standards to deliver high-quality, maintainable code.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Ongoing Support
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Get continuous support and maintenance for your web projects, ensuring they stay up-to-date and secure.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a
              href="/register?type=client"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Post a Web Development Project
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