import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProfileView from '../../components/profile/ProfileView';
import Layout from '../../components/layout/Layout';

export default function PublicProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    async function fetchUserProfile() {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/users/${id}/profile`);
        
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Profile not found' : 'Error loading profile');
        }
        
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [id]);
  
  // Determine user type based on profile data
  const getUserType = () => {
    if (!user) return 'user';
    if (user.freelancerProfile) return 'freelancer';
    if (user.clientProfile) return 'client';
    return 'user';
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">User information and details</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : user ? (
          <ProfileView user={user} userType={getUserType()} />
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
            No profile data available.
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ locale, params }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 