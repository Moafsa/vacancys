import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: {
          nav: {
            home: 'Início',
            categories: 'Categorias',
            howItWorks: 'Como funciona',
            pricing: 'Preços',
            login: 'Entrar',
            register: 'Registrar'
          },
          headline: 'Encontre os melhores serviços freelancers para o seu negócio',
          subheadline: 'Conecte-se com profissionais talentosos em todo o mundo',
          searchPlaceholder: 'Tente "desenvolvimento mobile"',
          popular: 'Popular',
          findJob: 'Encontre um trabalho dos sonhos'
        }
      },
      en: {
        translation: {
          nav: {
            home: 'Home',
            categories: 'Categories',
            howItWorks: 'How it works',
            pricing: 'Pricing',
            login: 'Login',
            register: 'Register'
          },
          headline: 'Find the perfect freelance services for your business',
          subheadline: 'Connect with talented professionals worldwide',
          searchPlaceholder: 'Try "mobile app development"',
          popular: 'Popular',
          findJob: 'Find a dream job'
        }
      }
    },
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: { escapeValue: false }
  });

export default i18n; 