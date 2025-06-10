import { useEffect, useState } from 'react';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';
import { BriefcaseIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function FindWork() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch('/api/projects/discover');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <FreelancerLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-800 flex items-center">
            <BriefcaseIcon className="h-7 w-7 mr-2 text-green-500" /> Find Work
          </h2>
        </div>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <div key={project._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-green-700 truncate">{project.title}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-semibold">{project.category}</span>
              </div>
              <div className="text-gray-500 text-sm mb-2">Budget: <span className="font-medium text-green-600">${project.budget}</span></div>
              <div className="text-gray-500 text-sm mb-2">Deadline: <span className="font-medium">{project.deadline?.slice(0,10)}</span></div>
              <div className="flex items-center justify-between mt-4">
                <a href={`/dashboard/freelancer/projects/${project._id}/propose`} className="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-600 bg-white rounded hover:bg-green-50 text-sm font-medium transition-all">
                  Send Proposal
                </a>
              </div>
            </div>
          ))}
        </div>
        {projects.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-12">No projects found.</div>
        )}
      </div>
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