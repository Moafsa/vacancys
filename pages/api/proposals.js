import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  // Exemplo: obter usuário autenticado (ajuste conforme seu auth)
  // const session = await getSession({ req });
  // const userId = session?.user?.id || 'mock-freelancer';
  const userId = 'mock-freelancer'; // Troque para integração real

  if (req.method === 'GET') {
    // Aqui você chamaria o serviço/módulo de propostas, ex:
    // const proposals = await ProposalService.getProposalsByFreelancer(userId);
    // MOCK:
    return res.status(200).json([
      {
        _id: 'p1',
        projectId: '1',
        bidAmount: 900,
        status: 'pending',
        coverLetter: 'I can do this job!',
      },
      {
        _id: 'p2',
        projectId: '2',
        bidAmount: 2800,
        status: 'accepted',
        coverLetter: 'Experienced in mobile apps.',
      },
    ]);
  }

  if (req.method === 'POST') {
    // Aqui você chamaria o serviço/módulo de propostas, ex:
    // const proposal = await ProposalService.submitProposal({ ...req.body, freelancerId: userId });
    // MOCK:
    return res.status(201).json({ ...req.body, _id: 'mock-proposal', status: 'pending' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 