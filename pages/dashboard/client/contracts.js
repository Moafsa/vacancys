import React, { useEffect, useState } from 'react';
import ClientLayout from '../../../components/dashboard/ClientLayout';
import { ClipboardCheckIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ClientContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchContracts() {
      setLoading(true);
      try {
        // MOCK: Substitua por chamada real futuramente
        setContracts([
          {
            _id: 'c1',
            project: 'Landing Page',
            freelancer: 'John Doe',
            status: 'active',
            startedAt: '2024-05-01',
            endsAt: '2024-06-01',
          },
          {
            _id: 'c2',
            project: 'Mobile App',
            freelancer: 'Jane Smith',
            status: 'completed',
            startedAt: '2024-03-01',
            endsAt: '2024-04-15',
          },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContracts();
  }, []);

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-800 flex items-center">
            <ClipboardCheckIcon className="h-7 w-7 mr-2 text-blue-500" /> Contracts
          </h2>
        </div>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map(contract => (
            <div key={contract._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-blue-700 truncate">{contract.project}</span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-semibold">{contract.status}</span>
              </div>
              <div className="text-gray-600 mb-2">Freelancer: {contract.freelancer}</div>
              <div className="text-gray-500 text-sm mb-2">Start: <span className="font-medium">{contract.startedAt}</span></div>
              <div className="text-gray-500 text-sm mb-2">End: <span className="font-medium">{contract.endsAt}</span></div>
            </div>
          ))}
        </div>
        {contracts.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-12">No contracts found.</div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientContracts;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 