'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, logoutUser } from '@/services/userService';

interface User {
  user_id: number
  username: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Função para obter o valor do cookie session_token
function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|; )' + 'session_token' + '=([^;]+)'));
  return match ? match[2] : null;
}

// Cria o AuthProvider que irá envolver a aplicação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    console.log('login called in AuthContext');
    try {
      const data = await loginUser(email, password);

      const userData = parseJwt(data.token);
      if (userData) {
        setUser({
          user_id: userData.user_id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
        });
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setIsAuthenticated(true);
    } catch (error: unknown) {
      console.error('Login Error:', error);
      setIsAuthenticated(false);
      throw error;  
    }
  };

  const logout = (showLogoutMessage = false) => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  
    if (showLogoutMessage) {
      localStorage.setItem('logout_reason', 'Você foi deslogado.');
    }
  };
  

  // Watch para verificar se o usuário já está autenticado ao carregar a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      return;
    }
    const token = getSessionToken();
    if (token) {
      const userData = parseJwt(token);
      if (userData) {
        setUser({
          user_id: userData.user_id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
        });
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Função para decodificar o JWT e retornar os dados do usuário
function parseJwt(token: string): User | null {
  try {
    const base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
      base64 += '='.repeat(4 - pad);
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT', error);
    return null;
  }
}
