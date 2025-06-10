import { useRouter } from 'next/router';
import Layout from '../layout/Layout';

// Este componente serve como um wrapper para o Layout existente
// Isso permite que código existente que importa MainLayout continue funcionando
export default function MainLayout({ children }) {
  const router = useRouter();

  return (
    <Layout>
      {children}
    </Layout>
  );
} 