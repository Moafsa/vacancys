const { i18n } = require('./next-i18next.config');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack(config) {
    // Permitir imports externos do core
    config.resolve.alias['core'] = path.resolve(__dirname, 'modules/core/src');

    // Configuração para SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // rewrites removidos pois o core está plugado localmente
  
  generateEtags: false,
  
  // Adicionar redirecionamentos para as páginas de perfil
  async redirects() {
    return [
      // Redirecionar /profile para o dashboard apropriado
      {
        source: '/:locale/profile',
        has: [
          {
            type: 'cookie',
            key: 'NEXT_LOCALE',
          }
        ],
        destination: '/:locale/dashboard/freelancer/profile',
        permanent: false,
      },
      {
        source: '/:locale/profile',
        destination: '/:locale/auth/login',
        permanent: false,
      },
      // Redirecionamentos sem a localidade
      {
        source: '/profile',
        destination: '/dashboard/freelancer/profile',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      // Adicionar outras rotas de API aqui conforme necessário
    ];
  },
}

module.exports = nextConfig