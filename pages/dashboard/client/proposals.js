import React, { useEffect, useState } from 'react';
import ClientLayout from '../../../components/dashboard/ClientLayout';
import { DocumentTextIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ClientProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProposals() {
      setLoading(true);
      try {
        // MOCK: Substitua por chamada real futuramente
        setProposals([
          {
            _id: 'p1',
            projectTitle: 'Landing Page',
            freelancer: 'John Doe',
            bidAmount: 900,
            status: 'pending',
            coverLetter: 'I can do this job!'
          },
          {
            _id: 'p2',
            projectTitle: 'Mobile App',
            freelancer: 'Jane Smith',
            bidAmount: 2800,
            status: 'accepted',
            coverLetter: 'Experienced in mobile apps.'
          },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, []);

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-800 flex items-center">
            <DocumentTextIcon className="h-7 w-7 mr-2 text-blue-500" /> Proposals
          </h2>
        </div>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map(proposal => (
            <div key={proposal._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-blue-700 truncate">{proposal.projectTitle}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-semibold">{proposal.status}</span>
              </div>
              <div className="text-gray-600 mb-2">Freelancer: {proposal.freelancer}</div>
              <div className="text-gray-500 text-sm mb-2">Bid: <span className="font-medium text-blue-600">${proposal.bidAmount}</span></div>
              <div className="text-gray-500 text-sm mb-2">Message: <span className="font-medium">{proposal.coverLetter}</span></div>
            </div>
          ))}
        </div>
        {proposals.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-12">No proposals found.</div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientProposals;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 