import React, { useEffect, useState } from 'react';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';
import { BriefcaseIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        // MOCK: Substitua por chamada real futuramente
        // const res = await fetch('/api/freelancer/jobs');
        // if (!res.ok) throw new Error('Failed to fetch jobs');
        // const data = await res.json();
        // setJobs(data.jobs || []);
        setJobs([
          {
            _id: 'j1',
            title: 'Landing Page',
            category: 'Web',
            budget: 1000,
            deadline: '2024-06-01',
            status: 'in_progress',
          },
          {
            _id: 'j2',
            title: 'Mobile App',
            category: 'App',
            budget: 3000,
            deadline: '2024-07-01',
            status: 'completed',
          },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <FreelancerLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-800 flex items-center">
            <BriefcaseIcon className="h-7 w-7 mr-2 text-green-500" /> My Jobs
          </h2>
        </div>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-green-700 truncate">{job.title}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-semibold">{job.status}</span>
              </div>
              <div className="text-gray-500 text-sm mb-2">Category: <span className="font-medium">{job.category}</span></div>
              <div className="text-gray-500 text-sm mb-2">Budget: <span className="font-medium text-green-600">${job.budget}</span></div>
              <div className="text-gray-500 text-sm mb-2">Deadline: <span className="font-medium">{job.deadline?.slice(0,10)}</span></div>
            </div>
          ))}
        </div>
        {jobs.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-12">No jobs found.</div>
        )}
      </div>
    </FreelancerLayout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default MyJobs; 