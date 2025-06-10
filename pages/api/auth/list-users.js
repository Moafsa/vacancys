// Removido: import { users, listAllUsers } from './shared-store';

export default async function handler(req, res) {
  // Este endpoint é apenas para depuração
  console.log('Listing all users');
  
  // Permitir apenas no ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Stub: lista vazia
  const allUsers = [];
  // const allUsers = listAllUsers();
  console.log('All users:', allUsers);
  
  return res.status(200).json({ 
    users: allUsers,
    count: allUsers.length
  });
} 