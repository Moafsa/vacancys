import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProfileEditor from '../../../components/profile/ProfileEditor';
import { UserIcon } from '@heroicons/react/outline';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';

export default function FreelancerProfilePage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const res = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            router.push('/auth/login');
          }
          return;
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // O conteúdo específico da página de perfil
  const profileContent = (
    <div className="py-6 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="pb-5 border-b border-gray-200 mb-5">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
          <span className="bg-green-100 p-2 rounded-full mr-3">
            <UserIcon className="h-6 w-6 text-green-600" />
          </span>
          My Profile
        </h1>
      </div>
      
      {/* Profile Editor */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : user ? (
        <ProfileEditor 
          user={user} 
          userType="freelancer" 
          onProfileUpdate={handleProfileUpdate}
        />
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Failed to load profile data.
        </div>
      )}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );

  return (
    <FreelancerLayout>
      {profileContent}
    </FreelancerLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 