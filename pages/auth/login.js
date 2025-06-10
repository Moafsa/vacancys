import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { LockClosedIcon } from '@heroicons/react/outline';
import Cookies from 'js-cookie';

export default function Login() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    if (token && userRole) {
      if (userRole === 'ADMIN') router.replace('/dashboard/admin');
      else router.replace('/dashboard/client');
    }
  }, [router, isHydrated]);

  if (!isHydrated) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#888'}}>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Armazenar o email imediatamente para fallback
    localStorage.setItem('email', formData.email);

    // Lista de endpoints possíveis em ordem de prioridade
    const endpoints = [
      '/api/auth/login',           // Implementação Next.js diretamente em pages/api
      '/api/v1/auth/login',        // API versão 1
      '/api/core/auth/login',      // API do módulo core
    ];

    let loginSuccess = false;
    let lastError = '';

    for (const endpoint of endpoints) {
      if (loginSuccess) break;

      try {
        console.log(`Tentando login em: ${endpoint}`);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          timeout: 5000 // 5 segundos de timeout
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || `Login failed with status ${res.status}`);
          lastError = data.error || `Login failed with status ${res.status}`;
          setResent('');
          continue; // Tenta o próximo endpoint
        }

        const data = await res.json();

        if (data.success && data.token) {
          console.log('[DEBUG][LOGIN][RESPONSE DATA]:', data);
          loginSuccess = true;
          
          // Salvar o token e o email
          localStorage.setItem('token', data.token);
          Cookies.set('token', data.token, { expires: 7, path: '/' });
          
          // Salvar papel simplificado
          if (data.user && data.user.role === 'admin') {
            localStorage.setItem('userRole', 'ADMIN');
            router.push('/dashboard/admin');
          } else {
            localStorage.setItem('userRole', 'CLIENT');
            router.push('/dashboard/client');
          }
          break;
        } else {
          // Se o endpoint respondeu mas login falhou
          console.log(`Falha de login em ${endpoint}: ${data.error || 'Erro desconhecido'}`);
          setError(data.error || 'Login failed');
        }
      } catch (err) {
        console.error(`Erro ao tentar ${endpoint}:`, err);
        // Continua para tentar o próximo endpoint
      }
    }

    // Se nenhum endpoint funcionou, mostramos o último erro real
    if (!loginSuccess) {
      setError(lastError || 'Login failed. Please check your credentials.');
      setResent('');
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResend = async () => {
    setResent('');
    setError('');
    const email = formData.email;
    if (!email) {
      setError('No email to resend verification.');
      return;
    }
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResent('Verification email resent successfully!');
      } else {
        setError(data.error || 'Failed to resend verification email.');
      }
    } catch (err) {
      setError('Failed to resend verification email.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-primary hover:text-primary-dark">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                    {(error.includes('Account not active') || error.includes('Email not verified')) && (
                      <button
                        type="button"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={handleResend}
                      >
                        Resend verification email
                      </button>
                    )}
                    {resent && (
                      <div className="text-green-700 text-sm">{resent}</div>
                    )}
                  </div>
                </div>
              )}

              {router.query.verified && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Email verified successfully! You can now log in.
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 