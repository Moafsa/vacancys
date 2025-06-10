import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CheckAccess() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // Verificar credenciais armazenadas ao carregar
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedEmail) setEmail(storedEmail);
    if (storedRole) setRole(storedRole);
    
    if (storedToken) {
      setMessage(`Usuário logado: ${storedEmail}, Papel: ${storedRole}`);
      setStatus('logged-in');
    } else {
      setMessage('Usuário não está logado');
      setStatus('logged-out');
    }
  }, []);

  // Função para fazer login
  const handleLogin = async () => {
    setMessage('Tentando login...');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      console.log('Resposta do login:', data);
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        
        if (data.user && data.user.role) {
          localStorage.setItem('userRole', data.user.role);
          setRole(data.user.role);
        }
        
        setMessage(`Login bem-sucedido! Papel: ${data.user?.role || 'Não definido'}`);
        setStatus('logged-in');
      } else {
        setMessage(`Falha no login: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMessage(`Erro ao fazer login: ${error.message}`);
    }
  };

  // Função para limpar localStorage e fazer logout
  const handleClearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    setStatus('logged-out');
    setMessage('Credenciais removidas');
  };

  // Função para testar navegação para dashboard específico
  const navigateToDashboard = (type) => {
    router.push(`/dashboard/${type}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Verificador de Acesso</h1>
        
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Status Atual</h2>
          <p className={`mb-2 ${status === 'logged-in' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
          <div className="flex space-x-2">
            {status === 'logged-in' ? (
              <button 
                onClick={handleClearStorage} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Login Manual</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-3 py-2 border rounded"
                placeholder="exemplo@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-3 py-2 border rounded"
                placeholder="Sua senha"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuários de Demonstração
              </label>
              <div className="text-sm space-y-1 mb-2">
                <p>Admin: admin@vacancy.service / admin123</p>
                <p>Freelancer: freelancer@example.com / freelancer123</p>
                <p>Cliente: client@example.com / client123</p>
              </div>
            </div>
            <button 
              onClick={handleLogin} 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Fazer Login
            </button>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Testar Dashboards</h2>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => navigateToDashboard('admin')}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Admin
            </button>
            <button 
              onClick={() => navigateToDashboard('freelancer')}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Freelancer
            </button>
            <button 
              onClick={() => navigateToDashboard('client')}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 