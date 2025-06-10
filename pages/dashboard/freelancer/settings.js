import React from 'react';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';
import { CogIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FreelancerSettings = () => {
  // MOCK: Substitua por integração real futuramente
  const user = {
    name: 'Elon Freelancer',
    email: 'elonfreelancer@gmail.com',
    notifications: true,
    language: 'English',
  };

  return (
    <FreelancerLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <CogIcon className="h-7 w-7 mr-2 text-green-500" />
          <h2 className="text-2xl font-bold text-green-800">Settings</h2>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input type="text" value={user.name} disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input type="email" value={user.email} disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Notifications</label>
            <input type="checkbox" checked={user.notifications} disabled className="mr-2" /> Receive email notifications
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Language</label>
            <input type="text" value={user.language} disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
          </div>
        </div>
      </div>
    </FreelancerLayout>
  );
};

export default FreelancerSettings;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 