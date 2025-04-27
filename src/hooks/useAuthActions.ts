'use client';

import { useAuth } from '@/context/auth';
import { useState } from 'react';
import axios from 'axios';

/**
 * Custom hook para gerenciar auth.
 * @returns {Object} - Contains loginUser, logoutUser, loading, error, isAuthenticated, user, and clearError.
 */
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
      console.error("error", err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK') {
          setError('Falha de rede. Verifique sua conexão.');
        } else if (err.response) {
          const data = err.response.data as any;
          const msg = data.detail || data.message;
          setError(msg ?? 'Falha no login');
        } else {
          setError('Erro desconhecido. Tente novamente.');
        }
      } else {
        setError('Erro desconhecido. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
    return success;
  };

  const logoutUser = () => {
    logout();
  };

  const clearError = () => {
    setError(null);
  };

  return { loginUser, logoutUser, loading, error, isAuthenticated, user, clearError };
}
