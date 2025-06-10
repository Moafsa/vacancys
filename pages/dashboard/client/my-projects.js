import React, { useEffect, useState } from 'react';
import ClientLayout from '../../../components/dashboard/ClientLayout';
import { BriefcaseIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        // MOCK: Substitua por chamada real futuramente
        setProjects([
          {
            _id: 'p1',
            title: 'Landing Page',
            category: 'Web',
            budget: 1000,
            deadline: '2024-06-01',
            status: 'open',
          },
          {
            _id: 'p2',
            title: 'Mobile App',
            category: 'App',
            budget: 3000,
            deadline: '2024-07-01',
            status: 'in_progress',
          },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-800 flex items-center">
            <BriefcaseIcon className="h-7 w-7 mr-2 text-blue-500" /> My Projects
          </h2>
        </div>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <div key={project._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-blue-700 truncate">{project.title}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-semibold">{project.status}</span>
              </div>
              <div className="text-gray-600 mb-2">{project.category}</div>
              <div className="text-gray-500 text-sm mb-2">Budget: <span className="font-medium text-blue-600">${project.budget}</span></div>
              <div className="text-gray-500 text-sm mb-2">Deadline: <span className="font-medium">{project.deadline?.slice(0,10)}</span></div>
            </div>
          ))}
        </div>
        {projects.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-12">No projects found.</div>
        )}
      </div>
    </ClientLayout>
  );
};

export default MyProjects;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 