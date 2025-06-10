import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SecuritySettings from '../profile/security'; // Importando o componente de segurança
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function DashboardSecurity() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const role = localStorage.getItem('userRole');
    setUserRole(role);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirecionando para o dashboard específico caso o usuário acesse diretamente
  // esta rota e o papel do usuário já esteja conhecido
  if (userRole === 'ADMIN' || userRole === 'FREELANCER' || userRole === 'CLIENT') {
    return <SecuritySettings />;
  }

  // Fallback para o componente de segurança padrão
  return <SecuritySettings />;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 