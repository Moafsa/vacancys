import { useEffect, useState } from 'react';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';
import { DocumentTextIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function FreelancerProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProposals() {
      setLoading(true);
      try {
        const res = await fetch('/api/proposals');
        if (!res.ok) throw new Error('Failed to fetch proposals');
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, []);

  return (
    <FreelancerLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-800 flex items-center">
            <DocumentTextIcon className="h-7 w-7 mr-2 text-green-500" /> My Proposals
          </h2>
        </div>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map(proposal => (
            <div key={proposal._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-green-700 truncate">Project: {proposal.projectId}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-semibold">{proposal.status}</span>
              </div>
              <div className="text-gray-500 text-sm mb-2">Bid: <span className="font-medium text-green-600">${proposal.bidAmount}</span></div>
              <div className="text-gray-500 text-sm mb-2">Message: <span className="font-medium">{proposal.coverLetter}</span></div>
            </div>
          ))}
        </div>
        {proposals.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-12">No proposals found.</div>
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