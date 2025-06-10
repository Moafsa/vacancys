import SecuritySettings from '../../profile/security';
import AdminLayout from '../../../components/dashboard/AdminLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function AdminSecurityDashboard() {
  return (
    <AdminLayout currentSection="profile" searchPlaceholder="Search...">
      <div className="p-6">
        <SecuritySettings />
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