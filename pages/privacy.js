import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';

export default function Privacy() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Privacy Policy
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Last updated: January 1, 2024
            </p>
          </div>

          <div className="mt-12 prose prose-lg prose-primary mx-auto">
            <h3>1. Introduction</h3>
            <p>
              This Privacy Policy describes how Vacancy.service collects, uses, and protects your personal information when you use our platform. We are committed to protecting your privacy and ensuring the security of your data.
            </p>

            <h3>2. Information We Collect</h3>
            <h4>2.1 Information You Provide</h4>
            <ul>
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Profile information and portfolio</li>
              <li>Payment information</li>
              <li>Communication preferences</li>
            </ul>

            <h4>2.2 Information Automatically Collected</h4>
            <ul>
              <li>Usage data and analytics</li>
              <li>Device information</li>
              <li>IP address and location data</li>
              <li>Cookies and tracking technologies</li>
              <li>Log data and error reports</li>
            </ul>

            <h3>3. How We Use Your Information</h3>
            <p>
              We use the collected information to:
            </p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Process payments and transactions</li>
              <li>Communicate with you about our services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
              <li>Analyze and improve platform performance</li>
            </ul>

            <h3>4. Information Sharing</h3>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>Service providers and business partners</li>
              <li>Other users (as needed for transactions)</li>
              <li>Legal authorities when required by law</li>
              <li>Third parties with your explicit consent</li>
            </ul>

            <h3>5. Data Security</h3>
            <p>
              We implement appropriate security measures to protect your information, including:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Secure data storage and transmission</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>

            <h3>6. Your Rights</h3>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data</li>
              <li>Object to data processing</li>
            </ul>

            <h3>7. Cookies and Tracking</h3>
            <p>
              We use cookies and similar tracking technologies to enhance your experience and collect usage data. You can control cookie preferences through your browser settings.
            </p>

            <h3>8. Data Retention</h3>
            <p>
              We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time.
            </p>

            <h3>9. Children's Privacy</h3>
            <p>
              Our services are not intended for users under 18 years of age. We do not knowingly collect information from children.
            </p>

            <h3>10. Policy Updates</h3>
            <p>
              We may update this policy from time to time. We will notify you of any significant changes through our platform or via email.
            </p>

            <h3>11. Contact Us</h3>
            <p>
              For privacy-related inquiries, please contact us at privacy@vacancy.service
            </p>

            <h3>12. GDPR Compliance</h3>
            <p>
              We comply with the General Data Protection Regulation (GDPR) and other applicable data protection laws. For more information about your rights under GDPR, please visit our dedicated GDPR page.
            </p>
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