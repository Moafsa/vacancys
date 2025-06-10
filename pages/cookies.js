import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';

export default function Cookies() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Cookies Policy
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Last updated: January 1, 2024
            </p>
          </div>

          <div className="mt-12 prose prose-lg prose-primary mx-auto">
            <h3>1. What are Cookies?</h3>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
            </p>

            <h3>2. Types of Cookies We Use</h3>
            <h4>2.1 Essential Cookies</h4>
            <p>
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
            </p>

            <h4>2.2 Performance Cookies</h4>
            <p>
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve our website's performance and user experience.
            </p>

            <h4>2.3 Functionality Cookies</h4>
            <p>
              These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use on our pages.
            </p>

            <h4>2.4 Marketing Cookies</h4>
            <p>
              These cookies track visitors across websites to enable us to display relevant and engaging advertisements.
            </p>

            <h3>3. How to Manage Cookies</h3>
            <p>
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site.
            </p>

            <h3>4. Third-Party Cookies</h3>
            <p>
              We use services from third parties that may also set cookies on your device. These include:
            </p>
            <ul>
              <li>Analytics services (Google Analytics)</li>
              <li>Payment processors</li>
              <li>Social media platforms</li>
              <li>Advertising networks</li>
            </ul>

            <h3>5. Updates to This Policy</h3>
            <p>
              We may update this policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes through our website or via email.
            </p>

            <h3>6. Contact Us</h3>
            <p>
              If you have any questions about our use of cookies, please contact us at privacy@vacancy.service
            </p>

            <h3>7. Cookie Settings</h3>
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900">Manage Your Cookie Preferences</h4>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Essential Cookies</label>
                    <p className="text-sm text-gray-500">Required for the website to function</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked
                      disabled
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Performance Cookies</label>
                    <p className="text-sm text-gray-500">Help us improve our website</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Functionality Cookies</label>
                    <p className="text-sm text-gray-500">Remember your preferences</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Marketing Cookies</label>
                    <p className="text-sm text-gray-500">Show relevant advertisements</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Save Preferences
                </button>
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