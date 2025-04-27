'use client';

import { useAuth } from '@/context/auth';
import { useState } from 'react';
import axios from 'axios';

export function useAuthActions() {
  const { login, logout, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    let success = false;
    try {
      await login(email, password);
      success = true;
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response) {
        const msg = (err.response.data as any).detail || (err.response.data as any).message;
        setError(msg ?? 'Falha no login');
      } else {
        setError('Usuário ou senha inválidos');
      }
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
