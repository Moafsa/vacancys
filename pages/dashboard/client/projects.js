import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ClientLayout from '../../../components/dashboard/ClientLayout';
import { BriefcaseIcon, DocumentTextIcon } from '@heroicons/react/outline';

export default function ClientProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data);
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
          <button
            onClick={() => router.push('/dashboard/client/post-job')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            + Create New Project
          </button>
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
              <div className="flex items-center justify-between mt-4">
                <Link href={`/dashboard/client/projects/${project._id}/proposals`} className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 bg-white rounded hover:bg-blue-50 text-sm font-medium transition-all">
                  <DocumentTextIcon className="h-5 w-5 mr-1" /> View Proposals
                </Link>
              </div>
            </div>
          ))}
        </div>
        {projects.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-12">No projects found. <br /> <Link href="/dashboard/client/post-job" className="text-blue-600 underline">Create your first project</Link></div>
        )}
      </div>
    </ClientLayout>
  );
} 