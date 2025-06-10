import { useState, useCallback } from 'react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      console.log('DEBUG useAuth - data recebido do backend:', data);
      
      if ((data.success === true || data.success === 'true') && data.token) {
        console.log('DEBUG useAuth - login considerado SUCESSO:', data);
        
        // Armazenar token e informações do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', credentials.email);
        
        // Armazenar o papel do usuário se disponível
        if (data.user && data.user.role) {
          localStorage.setItem('userRole', data.user.role);
          console.log('DEBUG useAuth - userRole armazenado:', data.user.role);
        } else {
          // Se não houver papel, remova qualquer valor antigo
          localStorage.removeItem('userRole');
          console.log('DEBUG useAuth - userRole removido (sem papel no backend)');
        }
        
        return { success: true, ...data };
      } else {
        console.log('DEBUG useAuth - login considerado FALHA:', data);
        setError(data.error || 'Failed to login');
        return { success: false, error: data.error || 'Failed to login' };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login';
      console.error('DEBUG useAuth - erro no login:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await response.json();
      if (response.ok && resData.user) {
        return { success: true, ...resData };
      } else {
        setError(resData.error || 'Failed to register');
        return { success: false, error: resData.error || 'Failed to register' };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to register';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    register,
    isLoading,
    error,
    setError
  };
} 