import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  LocationMarkerIcon, 
  PencilAltIcon,
  LockClosedIcon,
  CameraIcon,
  SaveIcon,
  ClipboardCheckIcon,
  ShieldCheckIcon,
  KeyIcon,
  BellIcon,
  UserGroupIcon,
  IdentificationIcon,
  LogoutIcon
} from '@heroicons/react/outline';
import AdminLayout from '../../components/dashboard/AdminLayout';

export default function AdminProfile() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'ADMIN',
    securityLevel: '',
    bio: '',
    lastLogin: '',
    twoFactorEnabled: false
  });

  useEffect(() => {
    async function fetchAdminProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const res = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          router.push('/auth/login');
          return;
        }

        const userData = await res.json();
        
        // Verificar se o usuário é um administrador
        if (userData.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }

        setAdmin(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'ADMIN',
          securityLevel: userData.securityLevel || 'STANDARD',
          bio: userData.bio || '',
          twoFactorEnabled: userData.twoFactorEnabled || false
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        setLoading(false);
      }
    }

    fetchAdminProfile();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedAdmin = await res.json();
        setAdmin(updatedAdmin);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Dados fictícios para estatísticas de atividade do administrador
  const activityStats = [
    { id: 1, name: 'Usuários gerenciados', value: 85, icon: <UserGroupIcon className="h-5 w-5 text-indigo-500" /> },
    { id: 2, name: 'Disputas resolvidas', value: 24, icon: <ShieldCheckIcon className="h-5 w-5 text-green-500" /> },
    { id: 3, name: 'Relatórios gerados', value: 46, icon: <ClipboardCheckIcon className="h-5 w-5 text-blue-500" /> },
    { id: 4, name: 'Dias de atividade', value: 128, icon: <BellIcon className="h-5 w-5 text-purple-500" /> }
  ];

  return (
    <AdminLayout currentSection="profile">
      <div className="p-6">
        {/* Cabeçalho do Perfil */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between">
            <div>
              <h3 className="text-2xl font-bold leading-6 text-gray-900">Perfil do Administrador</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Detalhes pessoais e configurações de segurança
              </p>
            </div>
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  <PencilAltIcon className="h-4 w-4 mr-2" /> Editar Perfil
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                >
                  <SaveIcon className="h-4 w-4 mr-2" /> Salvar Alterações
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Coluna da foto e informações básicas */}
                <div className="md:col-span-3">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {admin?.avatar ? (
                          <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full">
                          <CameraIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{admin?.name}</h2>
                    <div className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full mb-3">
                      Administrador
                    </div>
                    
                    <div className="w-full mt-4 space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{admin?.email}</span>
                      </div>
                      {admin?.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{admin?.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span>Nível de Acesso: {admin?.securityLevel || 'Padrão'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BellIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span>Último login: {admin?.lastLogin || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="mt-6 w-full space-y-2">
                      <button
                        onClick={() => router.push('/dashboard/admin/security')}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        <LockClosedIcon className="h-4 w-4 mr-2" /> Security
                      </button>
                      <button
                        onClick={() => router.push('/admin/logs')}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        <ClipboardCheckIcon className="h-4 w-4 mr-2" /> Logs de Atividade
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                      >
                        <LogoutIcon className="h-4 w-4 mr-2" /> Sair
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coluna do formulário / detalhes do perfil */}
                <div className="md:col-span-9">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100"
                            value={formData.email}
                            readOnly
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="securityLevel" className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
                          <select
                            id="securityLevel"
                            name="securityLevel"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.securityLevel}
                            onChange={handleInputChange}
                          >
                            <option value="STANDARD">Padrão</option>
                            <option value="HIGH">Alto</option>
                            <option value="SUPER">Super Admin</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biografia</label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Informações adicionais sobre você"
                        />
                      </div>

                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="twoFactorEnabled"
                            name="twoFactorEnabled"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            checked={formData.twoFactorEnabled}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="twoFactorEnabled" className="font-medium text-gray-700">Ativar autenticação de dois fatores</label>
                          <p className="text-gray-500">Proteja sua conta com uma camada adicional de segurança</p>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      {/* Bio do administrador */}
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3">Biografia</h3>
                        <div className="text-sm text-gray-500 whitespace-pre-line">
                          {admin?.bio || 'Nenhuma biografia disponível.'}
                        </div>
                      </div>

                      {/* Estatísticas de atividade */}
                      <div className="mt-8">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3">Estatísticas de Atividade</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activityStats.map((stat) => (
                            <div key={stat.id} className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 flex items-center">
                              <div className="mr-4">
                                {stat.icon}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Configurações de segurança */}
                      <div className="mt-8">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3">Configurações de Segurança</h3>
                        <div className="bg-white shadow-sm border border-gray-200 rounded-lg divide-y divide-gray-200">
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <KeyIcon className="h-5 w-5 text-indigo-500 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Autenticação de dois fatores</p>
                                <p className="text-xs text-gray-500">Proteja sua conta com um código adicional</p>
                              </div>
                            </div>
                            <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              admin?.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {admin?.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                            </div>
                          </div>
                          
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <IdentificationIcon className="h-5 w-5 text-indigo-500 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Nível de Permissão</p>
                                <p className="text-xs text-gray-500">Seu nível de acesso no sistema</p>
                              </div>
                            </div>
                            <div className="bg-indigo-100 text-indigo-800 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                              {admin?.securityLevel || 'Padrão'}
                            </div>
                          </div>
                          
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <BellIcon className="h-5 w-5 text-indigo-500 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Alertas de Segurança</p>
                                <p className="text-xs text-gray-500">Notificações sobre atividades suspeitas</p>
                              </div>
                            </div>
                            <div className="bg-green-100 text-green-800 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                              Ativado
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 