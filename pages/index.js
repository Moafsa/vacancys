import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Categories from '../components/home/Categories';

export default function Home() {
  const { t } = useTranslation('common');
  if (typeof window !== 'undefined') {
    console.log('[DEBUG][HOME] Home page mounted. URL:', window.location.href);
  }

  return (
    <Layout>
      <Hero />
      <Features />
      <Categories />
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