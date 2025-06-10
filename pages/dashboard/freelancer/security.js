import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import SecuritySettings from '../../profile/security';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function FreelancerSecurity() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'FREELANCER') {
      router.push('/dashboard');
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <SecuritySettings />;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 