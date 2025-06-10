import React, { useState } from 'react';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';
import { CreditCardIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FreelancerPayments = () => {
  // MOCK: Substitua por integração real futuramente
  const [balance, setBalance] = useState(2500.00); // saldo disponível
  const [history] = useState([
    { id: 1, type: 'Payment Received', amount: 1200, date: '2024-05-10', method: 'Stripe' },
    { id: 2, type: 'Withdrawal', amount: -500, date: '2024-05-12', method: 'PIX' },
    { id: 3, type: 'Payment Received', amount: 800, date: '2024-05-15', method: 'Crypto' },
  ]);

  // Simulação de saque
  const withdraw = (amount) => {
    if (amount > 0 && amount <= balance) {
      setBalance(balance - amount);
      // Aqui você adicionaria lógica real de saque/integração com backend
      alert(`Withdrawal of $${amount} requested!`);
    }
  };

  return (
    <FreelancerLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <CreditCardIcon className="h-7 w-7 mr-2 text-green-500" />
          <h2 className="text-2xl font-bold text-green-800">Payments</h2>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-green-700">Available Balance:</span>
            <span className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => withdraw(100)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
              type="button"
            >
              Withdraw $100
            </button>
            <button
              onClick={() => withdraw(500)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
              type="button"
            >
              Withdraw $500
            </button>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Payment History</h3>
          <ul>
            {history.map(item => (
              <li key={item.id} className="flex justify-between border-b py-2 text-sm">
                <span>{item.type}</span>
                <span className={item.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                  {item.amount > 0 ? '+' : ''}${Math.abs(item.amount)}
                </span>
                <span className="text-gray-400">{item.date}</span>
                <span className="text-gray-500">{item.method}</span>
              </li>
            ))}
            {history.length === 0 && <li className="text-gray-500">No payment history found.</li>}
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

export default FreelancerPayments; 