import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/layout/Layout';
import ProfileEditor from '../../components/profile/ProfileEditor';
import ProfileView from '../../components/profile/ProfileView';

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Fetch current user profile
        const res = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
          setLoading(false);
          return;
        }

        const userData = await res.json();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Redirect to the appropriate dashboard based on user role
        if (userData.role === 'ADMIN') {
          router.push('/dashboard/admin/profile', undefined, { locale: router.locale });
        } else if (userData.role === 'FREELANCER') {
          router.push('/dashboard/freelancer/profile', undefined, { locale: router.locale });
        } else if (userData.role === 'CLIENT') {
          router.push('/dashboard/client/profile', undefined, { locale: router.locale });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [router]);

  // Determine user type based on profile data
  const getUserType = () => {
    if (!user) return 'user';
    if (user.freelancerProfile) return 'freelancer';
    if (user.clientProfile) return 'client';
    return 'user';
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Your personal and professional information</p>
        </div>
        
        {!isAuthenticated ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p>You need to be logged in to manage your profile.</p>
            <button 
              onClick={() => router.push('/auth/login')}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-sm"
            >
              Log In
            </button>
          </div>
        ) : user ? (
          <ProfileEditor 
            user={user} 
            userType={getUserType()} 
            onProfileUpdate={handleProfileUpdate} 
          />
        ) : (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Failed to load profile data.
          </div>
        )}
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