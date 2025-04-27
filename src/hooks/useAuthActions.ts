'use client';

import { useAuth } from '@/context/auth';
import { useState } from 'react';

export function useAuthActions() {
  const { login, logout, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retorna true se login bem-sucedido, false caso contrário
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    let success = false;
    try {
      await login(email, password);
      success = true;
    } catch (err) {
      console.error(err);
      setError('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
    return success;
  };

  const logoutUser = () => {
    logout();
  };

  return { loginUser, logoutUser, loading, error, isAuthenticated, user };
}
