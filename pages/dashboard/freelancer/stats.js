import React from 'react';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';
import { ChartBarIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FreelancerStats = () => {
  // MOCK: Substitua por integração real futuramente
  const stats = [
    { label: 'Jobs Completed', value: 12 },
    { label: 'Proposals Sent', value: 34 },
    { label: 'Active Jobs', value: 2 },
    { label: 'Total Earnings', value: '$7,500' },
  ];

  return (
    <FreelancerLayout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <ChartBarIcon className="h-7 w-7 mr-2 text-green-500" />
          <h2 className="text-2xl font-bold text-green-800">My Stats</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              <span className="text-3xl font-bold text-green-700 mb-2">{stat.value}</span>
              <span className="text-gray-600 text-lg">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </FreelancerLayout>
  );
};

export default FreelancerStats;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 