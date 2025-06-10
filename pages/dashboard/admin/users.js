import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  UserIcon,
  UserAddIcon,
  SearchIcon,
  FilterIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import AdminLayout from '../../../components/dashboard/AdminLayout';

export default function UsersManagement() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
    const token = localStorage.getItem('token');
    if (!token) {
          console.error('No authentication token found');
          setError('You must be logged in to view this page');
          setLoading(false);
      return;
    }
        
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: pageSize.toString(),
        });

        if (searchTerm) params.append('search', searchTerm);
        if (filterRole !== 'all') params.append('role', filterRole);
        if (filterStatus !== 'all') params.append('status', filterStatus);
        
        const response = await fetch(`/api/v1/users?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        
        const data = await response.json();
        setUsers(data.users || []);
        setTotalUsers(data.total || 0);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [currentPage, pageSize, searchTerm, filterRole, filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Refresh the users list
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      const usersResponse = await fetch(`/api/v1/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await usersResponse.json();
      setUsers(data.users);
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
    const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh the users list
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      const usersResponse = await fetch(`/api/v1/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await usersResponse.json();
      setUsers(data.users);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Modal handlers
  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedUser({ name: '', email: '', role: 'USER', status: 'ACTIVE', password: '' });
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  const handleSaveUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const isEdit = !!selectedUser.id;
      const method = isEdit ? 'PUT' : 'POST';
      const url = '/api/v1/users';
      const body = isEdit
        ? { id: selectedUser.id, data: { name: selectedUser.name, email: selectedUser.email, role: selectedUser.role, status: selectedUser.status, password: selectedUser.password || undefined } }
        : { name: selectedUser.name, email: selectedUser.email, role: selectedUser.role, status: selectedUser.status, password: selectedUser.password };
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Failed to save user');
      }
      // Refresh users
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      const usersResponse = await fetch(`/api/v1/users?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await usersResponse.json();
      setUsers(data.users);
      closeModal();
    } catch (err) {
      setError('Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout currentSection="users" searchPlaceholder="Buscar usuários...">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Gerenciamento de Usuários</h1>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <UserAddIcon className="h-5 w-5 mr-2" />
              Novo Usuário
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-medium leading-6 text-gray-900">Filtros</h2>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="filter-role" className="block text-sm font-medium text-gray-700">
                  Papel
                </label>
                <select
                  id="filter-role"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Todos</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="filter-status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">Todos</option>
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                  <option value="PENDING">Pendente</option>
                  <option value="BLOCKED">Bloqueado</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Buscar
                </label>
                <form onSubmit={handleSearch} className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Nome ou email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="animate-pulse">
                <div className="space-y-4 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
            <ul className="divide-y divide-gray-200">
                {users.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">
                  Nenhum usuário encontrado com os filtros atuais.
                </li>
              ) : (
                  users.map((user) => (
                  <li key={user.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                            alt=""
                          />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.role}
                        </span>
                        <button
                            onClick={() => openEditModal(user)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => handleDelete(user.id)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 focus:outline-none"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            )}
          </div>
          
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-md">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * pageSize >= totalUsers}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                  <span className="font-medium">{Math.min(currentPage * pageSize, totalUsers)}</span> de{' '}
                  <span className="font-medium">{totalUsers}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * pageSize >= totalUsers}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Próximo</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {selectedUser?.id ? 'Editar Usuário' : 'Novo Usuário'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={selectedUser?.name || ''}
                      onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={selectedUser?.email || ''}
                      onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Papel</label>
                    <select
                      value={selectedUser?.role || 'USER'}
                      onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="USER">User</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedUser?.status || 'ACTIVE'}
                      onChange={e => setSelectedUser({ ...selectedUser, status: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="ACTIVE">Ativo</option>
                      <option value="INACTIVE">Inativo</option>
                      <option value="PENDING">Pendente</option>
                      <option value="BLOCKED">Bloqueado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Senha {selectedUser?.id ? '(deixe em branco para não alterar)' : ''}</label>
                    <input
                      type="password"
                      value={selectedUser?.password || ''}
                      onChange={e => setSelectedUser({ ...selectedUser, password: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveUser}
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm"
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
                {selectedUser && (
                  <>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded mt-4" onClick={() => setShowVerificationModal(true)}>
                      Verificação de Conta
                    </button>
                    {showVerificationModal && (
                      <AccountVerificationModal user={selectedUser} onClose={() => setShowVerificationModal(false)} />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function AccountVerificationModal({ user, onClose }) {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectReasons, setRejectReasons] = useState({ document: '', proofOfAddress: '', selfie: '' });
  useEffect(() => {
    async function fetchVerification() {
      if (!user?.id) return;
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/admin/account-verifications/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setVerification(data || null);
      } else {
        setVerification(null);
      }
    }
    fetchVerification();
  }, [user]);

  async function handleApprove(fileType) {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/v1/admin/account-verifications/${user.id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve', fileType })
    });
    if (res.ok) {
      const data = await res.json();
      setVerification(data);
      setRejectReasons(r => ({ ...r, [fileType]: '' }));
    }
    setLoading(false);
  }
  async function handleReject(fileType) {
    if (!rejectReasons[fileType]) { alert('Informe o motivo da rejeição.'); return; }
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/v1/admin/account-verifications/${user.id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', fileType, reason: rejectReasons[fileType] })
    });
    if (res.ok) {
      const data = await res.json();
      setVerification(data);
    }
    setLoading(false);
  }
  async function handleDelete(fileType) {
    if (!window.confirm('Tem certeza que deseja excluir este arquivo?')) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/v1/admin/account-verifications/${user.id}/file`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileType })
    });
    if (res.ok) {
      // Atualiza o registro após exclusão
      const vRes = await fetch(`/api/v1/admin/account-verifications/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (vRes.ok) {
        const data = await vRes.json();
        setVerification(data);
      }
    }
    setLoading(false);
  }
  if (!user) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Verificação de Conta</h2>
        {verification ? (
          <div className="mb-4">
            <div className="font-semibold mb-2">Status geral: <span className={
              verification.status === 'APPROVED' ? 'text-green-600' : verification.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
            }>{verification.status}</span></div>
            <div className="flex flex-col gap-4">
              {/* Documento */}
              <div className="border-b pb-2 mb-2">
                <div className="font-semibold">Documento:</div>
                {verification.documentUrl ? (
                  <>
                    <a href={verification.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver</a>
                    <div>Status: <span className={
                      verification.documentStatus === 'APPROVED' ? 'text-green-600' : verification.documentStatus === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                    }>{verification.documentStatus}</span></div>
                    {verification.documentRejectionReason && (
                      <div className="text-red-600">Motivo: {verification.documentRejectionReason}</div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleApprove('document')} disabled={loading || verification.documentStatus === 'APPROVED'}>Aprovar</button>
                      <input type="text" placeholder="Motivo da rejeição" className="border px-2 py-1 rounded" value={rejectReasons.document} onChange={e => setRejectReasons(r => ({ ...r, document: e.target.value }))} disabled={loading} />
                      <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleReject('document')} disabled={loading || verification.documentStatus === 'REJECTED'}>Rejeitar</button>
                      <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={() => handleDelete('document')} disabled={loading || !verification.documentUrl}>Excluir</button>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500">Não enviado</span>
                )}
              </div>
              {/* Comprovante de Endereço */}
              <div className="border-b pb-2 mb-2">
                <div className="font-semibold">Comprovante de Endereço:</div>
                {verification.proofOfAddressUrl ? (
                  <>
                    <a href={verification.proofOfAddressUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver</a>
                    <div>Status: <span className={
                      verification.proofOfAddressStatus === 'APPROVED' ? 'text-green-600' : verification.proofOfAddressStatus === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                    }>{verification.proofOfAddressStatus}</span></div>
                    {verification.proofOfAddressRejectionReason && (
                      <div className="text-red-600">Motivo: {verification.proofOfAddressRejectionReason}</div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleApprove('proofOfAddress')} disabled={loading || verification.proofOfAddressStatus === 'APPROVED'}>Aprovar</button>
                      <input type="text" placeholder="Motivo da rejeição" className="border px-2 py-1 rounded" value={rejectReasons.proofOfAddress} onChange={e => setRejectReasons(r => ({ ...r, proofOfAddress: e.target.value }))} disabled={loading} />
                      <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleReject('proofOfAddress')} disabled={loading || verification.proofOfAddressStatus === 'REJECTED'}>Rejeitar</button>
                      <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={() => handleDelete('proofOfAddress')} disabled={loading || !verification.proofOfAddressUrl}>Excluir</button>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500">Não enviado</span>
                )}
              </div>
              {/* Selfie */}
              <div>
                <div className="font-semibold">Selfie:</div>
                {verification.selfieUrl ? (
                  <>
                    <a href={verification.selfieUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver</a>
                    <div>Status: <span className={
                      verification.selfieStatus === 'APPROVED' ? 'text-green-600' : verification.selfieStatus === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                    }>{verification.selfieStatus}</span></div>
                    {verification.selfieRejectionReason && (
                      <div className="text-red-600">Motivo: {verification.selfieRejectionReason}</div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleApprove('selfie')} disabled={loading || verification.selfieStatus === 'APPROVED'}>Aprovar</button>
                      <input type="text" placeholder="Motivo da rejeição" className="border px-2 py-1 rounded" value={rejectReasons.selfie} onChange={e => setRejectReasons(r => ({ ...r, selfie: e.target.value }))} disabled={loading} />
                      <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleReject('selfie')} disabled={loading || verification.selfieStatus === 'REJECTED'}>Rejeitar</button>
                      <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={() => handleDelete('selfie')} disabled={loading || !verification.selfieUrl}>Excluir</button>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500">Não enviado</span>
                )}
              </div>
            </div>
          </div>
        ) : <div>Nenhuma verificação enviada.</div>}
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 