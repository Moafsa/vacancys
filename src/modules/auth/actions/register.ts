import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  userType: 'freelancer' | 'client';
}

export async function register(data: RegisterData) {
  try {
    // Hash da senha antes de salvar
    const hashedPassword = await hash(data.password, 10);

    // TODO: Implementar salvamento no banco de dados
    // Por enquanto vamos apenas simular um registro bem-sucedido
    
    // Gerar token JWT
    const token = sign(
      { 
        email: data.email,
        userType: data.userType 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1d' }
    );

    return {
      success: true,
      token,
      user: {
        email: data.email,
        name: data.name,
        userType: data.userType
      }
    };
  } catch (error) {
    console.error('Erro no registro:', error);
    return {
      success: false,
      error: 'Erro ao registrar usuário'
    };
  }
} 