const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../../../lib/prisma');

async function register(data) {
  try {
    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Salvar no banco de dados
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || data.email.split('@')[0], // Nome temporário se não fornecido
        userType: data.userType
      }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        userType: user.userType 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1d' }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType
      }
    };
  } catch (error) {
    console.error('Erro no registro:', error);
    return {
      success: false,
      error: error.code === 'P2002' ? 'Email already exists' : 'Error registering user'
    };
  }
}

module.exports = { register }; 