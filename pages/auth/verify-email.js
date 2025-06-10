import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import { MailIcon } from '@heroicons/react/outline';

export default function VerifyEmail() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { email, token } = router.query;
  const [status, setStatus] = useState('Verifying...');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus(data.message || 'Email verified successfully!');
        } else {
          setError(data.error || 'Verification failed.');
          }
      } catch (err) {
        setError('Verification failed.');
      }
    };
    verify();
  }, [token]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary">
            <MailIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {email ? (
              <>
                We sent a verification link to <strong>{email}</strong>
              </>
            ) : (
              'Please check your email to verify your account'
            )}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <p className="text-sm text-gray-500">
                Click the link in the email to verify your account. If you don't see the email, check your spam folder.
              </p>
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Return to login
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white p-8 rounded shadow-md max-w-md w-full mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Email Verification</h2>
            {error ? (
              <div className="text-red-600 text-center">{error}</div>
            ) : (
              <div className="text-green-600 text-center">{status}</div>
            )}
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