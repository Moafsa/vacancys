import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/dashboard/AdminLayout';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  CashIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CogIcon, 
  ExclamationCircleIcon,
  ShieldCheckIcon,
  UserAddIcon,
  UserGroupIcon,
  MailIcon,
  AnnotationIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';

export default function AdminDashboardIndex() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 123,
    projects: 45,
    revenue: 12345,
    newUsersToday: 8,
    pendingReports: 3,
    activeUsers: 78
  });

  useEffect(() => {
    async function checkAdmin() {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      try {
        const res = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data?.role !== 'ADMIN') {
          router.push('/dashboard');
        } else {
          setLoading(false);
          
          // Em um ambiente real, aqui faríamos uma chamada para buscar as estatísticas reais
          // fetchStats();
        }
      } catch (e) {
        router.push('/auth/login');
      }
    }
    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Dados fictícios para o gráfico de crescimento de usuários
  const userGrowthData = [12, 19, 15, 22, 29, 35, 42];
  
  // Dados fictícios para a tabela de transações recentes
  const recentTransactions = [
    { id: 1, user: 'João Silva', type: 'Pagamento', amount: 450, status: 'Concluído', date: '12/05/2023' },
    { id: 2, user: 'Maria Oliveira', type: 'Saque', amount: 320, status: 'Pendente', date: '11/05/2023' },
    { id: 3, user: 'Carlos Eduardo', type: 'Pagamento', amount: 780, status: 'Concluído', date: '10/05/2023' },
    { id: 4, user: 'Ana Beatriz', type: 'Reembolso', amount: 150, status: 'Concluído', date: '09/05/2023' },
  ];

  return (
    <AdminLayout currentSection="dashboard">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Painel de Administração</h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => router.push('/dashboard/admin/users')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <UserAddIcon className="h-4 w-4 mr-2" /> Gerenciar Usuários
            </button>
            <button 
              onClick={() => router.push('/dashboard/admin/settings')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <CogIcon className="h-4 w-4 mr-2" /> Configurações
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Usuários</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">{stats.users}</div>
                      <div className="flex items-center text-sm text-green-600">
                        <UserAddIcon className="h-4 w-4 mr-1" /> +{stats.newUsersToday} hoje
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Ver todos
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <BriefcaseIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Projetos Ativos</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">{stats.projects}</div>
                      <div className="flex items-center text-sm text-blue-600">
                        <ClockIcon className="h-4 w-4 mr-1" /> 12 novos esta semana
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Ver detalhes
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <CashIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Receita Total</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">${stats.revenue.toLocaleString()}</div>
                      <div className="flex items-center text-sm text-green-600">
                        <ChartBarIcon className="h-4 w-4 mr-1" /> +8.2% este mês
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Relatório financeiro
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Coluna de Atividades Recentes */}
          <div className="col-span-1 xl:col-span-2">
            <div className="bg-white shadow rounded-lg mb-5">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Transações Recentes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Últimas transações realizadas na plataforma
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'Concluído'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button type="button" className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                  Ver todas as transações
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Gráfico de crescimento (mockup) */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Crescimento de Usuários</h3>
                <div className="h-48 flex items-end space-x-2">
                  {userGrowthData.map((value, index) => (
                    <div key={index} className="relative flex-1">
                      <div 
                        className="bg-indigo-600 rounded-t"
                        style={{ height: `${(value / Math.max(...userGrowthData)) * 100}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 text-center mt-1">{index + 1}</div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2 text-sm text-gray-500">Últimos 7 dias</div>
              </div>

              {/* Estatísticas de uso */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas de Uso</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-indigo-500 mr-2" />
                      <span className="text-sm text-gray-700">Usuários Ativos</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stats.activeUsers}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-600 rounded-full" style={{ width: `${(stats.activeUsers / stats.users) * 100}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm text-gray-700">Disputas Abertas</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">5</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-red-500 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">Projetos Concluídos</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">87</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna de Alertas e Ações Rápidas */}
          <div className="col-span-1">
            {/* Alertas e Notificações */}
            <div className="bg-white shadow rounded-lg mb-5">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Alertas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Itens que precisam de atenção
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Relatórios pendentes</p>
                        <p className="text-sm text-gray-500">
                          {stats.pendingReports} relatórios aguardando revisão
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <ShieldCheckIcon className="h-6 w-6 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Verificações de segurança</p>
                        <p className="text-sm text-gray-500">
                          2 contas sinalizadas pelo sistema de segurança
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <MailIcon className="h-6 w-6 text-indigo-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Mensagens de suporte</p>
                        <p className="text-sm text-gray-500">
                          7 mensagens de suporte não respondidas
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Ações Rápidas */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Ações Rápidas</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-3">
                  <button 
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={() => router.push('/dashboard/admin/users')}
                  >
                    <UserAddIcon className="h-5 w-5 mr-2" />
                    Adicionar Usuário
                  </button>
                  <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                    <AnnotationIcon className="h-5 w-5 mr-2" />
                    Responder Suporte
                  </button>
                  <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Gerar Relatório
                  </button>
                  <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    <CogIcon className="h-5 w-5 mr-2" />
                    Configurações do Sistema
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 