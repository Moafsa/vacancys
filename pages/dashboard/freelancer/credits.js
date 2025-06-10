import React, { useState } from 'react';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';
import { LightningBoltIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FreelancerCredits = () => {
  // MOCK: Substitua por integração real futuramente
  const [credits, setCredits] = useState(15); // saldo atual
  const [history] = useState([
    { id: 1, type: 'Daily Bonus', amount: 3, date: '2024-05-15' },
    { id: 2, type: 'Proposal Sent', amount: -1, date: '2024-05-15' },
    { id: 3, type: 'Purchase', amount: 10, date: '2024-05-10' },
    { id: 4, type: 'Proposal Sent', amount: -1, date: '2024-05-10' },
  ]);

  // Simulação de compra de créditos
  const buyCredits = (amount) => {
    setCredits(credits + amount);
    // Aqui você adicionaria lógica real de compra/integração com backend
  };

  return (
    <FreelancerLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <LightningBoltIcon className="h-7 w-7 mr-2 text-green-500" />
          <h2 className="text-2xl font-bold text-green-800">My Credits</h2>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-green-700">Current Balance:</span>
            <span className="text-3xl font-bold text-green-600">{credits}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => buyCredits(10)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
              type="button"
            >
              Buy 10 Credits
            </button>
            <button
              onClick={() => buyCredits(50)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
              type="button"
            >
              Buy 50 Credits
            </button>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Credit History</h3>
          <ul>
            {history.map(item => (
              <li key={item.id} className="flex justify-between border-b py-2 text-sm">
                <span>{item.type}</span>
                <span className={item.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                  {item.amount > 0 ? '+' : ''}{item.amount}
                </span>
                <span className="text-gray-400">{item.date}</span>
              </li>
            ))}
            {history.length === 0 && <li className="text-gray-500">No credit history found.</li>}
          </ul>
        </div>
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

export default FreelancerCredits; 