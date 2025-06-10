import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  // Exemplo: obter usuário autenticado (ajuste conforme seu auth)
  // const session = await getSession({ req });
  // const userId = session?.user?.id || 'mock-user';
  const userId = 'mock-user'; // Troque para integração real

  if (req.method === 'GET') {
    // Aqui você chamaria o serviço/módulo de projetos, ex:
    // const projects = await ProjectService.getProjectsByClient(userId);
    // MOCK:
    return res.status(200).json([
      {
        _id: '1',
        title: 'Landing Page',
        category: 'Web',
        budget: 1000,
        deadline: '2024-06-01',
        status: 'open',
      },
      {
        _id: '2',
        title: 'Mobile App',
        category: 'App',
        budget: 3000,
        deadline: '2024-07-01',
        status: 'in_progress',
      },
    ]);
  }

  if (req.method === 'POST') {
    // Aqui você chamaria o serviço/módulo de projetos, ex:
    // const project = await ProjectService.createProject({ ...req.body, clientId: userId });
    // MOCK:
    return res.status(201).json({ ...req.body, _id: 'mock-id', status: 'open' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 