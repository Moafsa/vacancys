import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';

export default function Terms() {
  const { t } = useTranslation('common');

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Terms of Use
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Last updated: January 1, 2024
            </p>
          </div>

          <div className="mt-12 prose prose-lg prose-primary mx-auto">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing and using Vacancy.service, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our platform.
            </p>

            <h3>2. Definitions</h3>
            <ul>
              <li>"Platform" refers to Vacancy.service and all its services</li>
              <li>"User" refers to any individual or entity using our platform</li>
              <li>"Client" refers to users who post projects and hire freelancers</li>
              <li>"Freelancer" refers to users who provide services through our platform</li>
            </ul>

            <h3>3. Account Creation and Responsibilities</h3>
            <p>
              Users must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <h3>4. Services</h3>
            <p>
              Our platform facilitates connections between clients and freelancers. We do not guarantee the quality, safety, or legality of the services provided by freelancers, nor do we guarantee the ability of clients to pay for services.
            </p>

            <h3>5. Payment Processing</h3>
            <p>
              We process payments through secure third-party payment processors. Our platform charges service fees for facilitating transactions. These fees are clearly displayed before any transaction is completed.
            </p>

            <h3>6. Communication</h3>
            <p>
              Users must communicate through our platform's messaging system. Sharing contact information or attempting to conduct transactions outside the platform is prohibited.
            </p>

            <h3>7. Intellectual Property</h3>
            <p>
              Users retain their intellectual property rights. By posting content on our platform, you grant us a license to use, display, and distribute that content for the purpose of operating our platform.
            </p>

            <h3>8. User Conduct</h3>
            <p>
              Users must not:
            </p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Post false or misleading information</li>
              <li>Harass or abuse other users</li>
              <li>Attempt to circumvent our payment system</li>
              <li>Use automated systems to access our platform</li>
              <li>Share account credentials with others</li>
            </ul>

            <h3>9. Limitation of Liability</h3>
            <p>
              We are not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our platform.
            </p>

            <h3>10. Modifications to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. Users will be notified of significant changes. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>

            <h3>11. Account Termination</h3>
            <p>
              We may terminate or suspend accounts that violate these terms or engage in fraudulent activity. Users may terminate their accounts at any time by following the instructions in their account settings.
            </p>

            <h3>12. Governing Law</h3>
            <p>
              These terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of the United States.
            </p>

            <h3>13. Contact Information</h3>
            <p>
              For questions about these terms, please contact us at legal@vacancy.service
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