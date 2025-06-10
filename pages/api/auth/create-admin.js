import { hashPassword } from '../../../lib/auth';

// Usando o mesmo Map do registro
const users = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Criar usuário admin
  const adminUser = {
    email: 'admin@vacancy.service',
    password: hashPassword('admin123'), // Senha: admin123
    userType: 'admin',
    verified: true,
    createdAt: new Date(),
  };

  // Salvar no Map
  users.set(adminUser.email, adminUser);

  return res.status(200).json({
    success: true,
    message: 'Admin user created successfully',
    credentials: {
      email: adminUser.email,
      password: 'admin123'
    }
  });
} 