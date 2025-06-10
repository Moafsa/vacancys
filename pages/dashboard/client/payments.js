import React, { useState } from 'react';
import ClientLayout from '../../../components/dashboard/ClientLayout';
import { CreditCardIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ClientPayments = () => {
  // MOCK: Substitua por integração real futuramente
  const [balance, setBalance] = useState(-1200.00); // saldo pendente (negativo = a pagar)
  const [history] = useState([
    { id: 1, type: 'Project Payment', amount: -1200, date: '2024-05-10', method: 'Stripe', project: 'Landing Page' },
    { id: 2, type: 'Deposit', amount: 2000, date: '2024-05-01', method: 'PIX', project: null },
    { id: 3, type: 'Project Payment', amount: -800, date: '2024-04-20', method: 'Crypto', project: 'Mobile App' },
  ]);

  // Simulação de pagamento
  const pay = (amount) => {
    if (amount > 0 && Math.abs(balance) >= amount) {
      setBalance(balance + amount);
      // Aqui você adicionaria lógica real de pagamento/integração com backend
      alert(`Payment of $${amount} completed!`);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <CreditCardIcon className="h-7 w-7 mr-2 text-blue-500" />
          <h2 className="text-2xl font-bold text-blue-800">Payments</h2>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-blue-700">Outstanding Balance:</span>
            <span className={balance < 0 ? 'text-red-600' : 'text-green-600'}>
              ${balance.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => pay(500)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
              type="button"
            >
              Pay $500
            </button>
            <button
              onClick={() => pay(1000)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
              type="button"
            >
              Pay $1000
            </button>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Payment History</h3>
          <ul>
            {history.map(item => (
              <li key={item.id} className="flex justify-between border-b py-2 text-sm">
                <span>{item.type}{item.project ? ` (${item.project})` : ''}</span>
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
    </ClientLayout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ClientPayments; 