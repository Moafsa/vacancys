const { AuthService } = require('../../../../modules/core');

const authService = new AuthService();

async function login(data) {
  try {
    const { email, password } = data;
    console.log('Módulo Auth - Tentando login com:', email);
    const result = await authService.login(email, password);
    return {
      success: true,
      ...result
    };
  } catch (error) {
    console.error('Módulo Auth - Login error:', error.message);
    throw new Error(error.message || 'Invalid credentials');
  }
}

module.exports = { login }; 