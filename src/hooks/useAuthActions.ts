'use client';

import { useAuth } from '@/context/auth';
import { useState, useMemo } from 'react';
import axios from 'axios';

/**
 * Interface para a resposta de erro da API
 */
interface ErrorResponse {
  detail?: string;
  message?: string;
}

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
          const data = err.response.data as ErrorResponse;
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

  const userRole = useMemo(() => {
    return user?.role || null;
  }, [user]);

  return { loginUser, logoutUser, loading, error, isAuthenticated, user, userRole, clearError };
}
