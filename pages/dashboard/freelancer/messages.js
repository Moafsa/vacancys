import React, { useState } from 'react';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';
import { ChatIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const mockConversations = [
  {
    id: 1,
    user: 'Acme Corp (Client)',
    lastMessage: 'Project delivered, please check!',
    date: '2024-05-15',
    unread: true,
    messages: [
      { from: 'freelancer', text: 'Project delivered, please check!', date: '2024-05-15' },
      { from: 'client', text: 'Hi John, any update?', date: '2024-05-14' },
    ],
  },
  {
    id: 2,
    user: 'Beta Ltd (Client)',
    lastMessage: 'Thank you!',
    date: '2024-05-10',
    unread: false,
    messages: [
      { from: 'client', text: 'Payment sent.', date: '2024-05-10' },
      { from: 'freelancer', text: 'Thank you!', date: '2024-05-10' },
    ],
  },
];

const FreelancerMessages = () => {
  const [selected, setSelected] = useState(mockConversations[0]);

  return (
    <FreelancerLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <ChatIcon className="h-7 w-7 mr-2 text-green-500" />
          <h2 className="text-2xl font-bold text-green-800">Messages</h2>
        </div>
        <div className="flex gap-6">
          {/* Lista de conversas */}
          <div className="w-1/3 bg-white shadow rounded-lg p-4 h-[400px] overflow-y-auto">
            <h3 className="font-semibold text-green-700 mb-2">Conversations</h3>
            <ul>
              {mockConversations.map(conv => (
                <li
                  key={conv.id}
                  className={`p-2 rounded cursor-pointer mb-2 ${selected.id === conv.id ? 'bg-green-100' : ''}`}
                  onClick={() => setSelected(conv)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{conv.user}</span>
                    {conv.unread && <span className="text-xs bg-green-500 text-white rounded-full px-2">new</span>}
                  </div>
                  <div className="text-xs text-gray-500">{conv.lastMessage}</div>
                  <div className="text-xs text-gray-400">{conv.date}</div>
                </li>
              ))}
            </ul>
          </div>
          {/* Mensagens */}
          <div className="flex-1 bg-white shadow rounded-lg p-4 h-[400px] flex flex-col">
            <h3 className="font-semibold text-green-700 mb-2">Conversation with {selected.user}</h3>
            <div className="flex-1 overflow-y-auto mb-4">
              {selected.messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 flex ${msg.from === 'freelancer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-lg ${msg.from === 'freelancer' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{msg.text}</div>
                  <span className="text-xs text-gray-400 ml-2 self-end">{msg.date}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                placeholder="Type a message... (mocked)"
                disabled
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded" disabled>Send</button>
            </div>
          </div>
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

export default FreelancerMessages; 