import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  // Exemplo: obter usuário autenticado (ajuste conforme seu auth)
  // const session = await getSession({ req });
  // const userId = session?.user?.id || 'mock-user';

  if (req.method === 'GET') {
    // Aqui você chamaria o serviço/módulo de projetos disponíveis para freelancers
    // MOCK:
    return res.status(200).json({
      projects: [
        {
          _id: '1',
          title: 'Landing Page',
          category: 'Web',
          budget: 1000,
          deadline: '2024-06-01',
        },
        {
          _id: '2',
          title: 'Mobile App',
          category: 'App',
          budget: 3000,
          deadline: '2024-07-01',
        },
      ],
    });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 