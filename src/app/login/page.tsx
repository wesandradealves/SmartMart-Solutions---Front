'use client';

import React, { useState, useEffect } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { loginUser, clearError, loading, error } = useAuthActions();
  useEffect(() => {
    if (error) {
      console.error('Login error:', error);
    }
  }, [error]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await loginUser(email, password);
    if (success) {
      router.push('/');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setPassword(e.target.value);
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail ou Nome de Usuário
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={handleEmailChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Não tem uma conta?{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => router.push('/signup')}
            >
              Crie uma aqui
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
