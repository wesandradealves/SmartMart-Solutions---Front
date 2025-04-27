'use client';

import React, { useState } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { loginUser, loading, error } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginUser(email, password);
    if (success) {
      router.push('/');
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              E-mail ou Nome de Usuário
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-white font-semibold rounded-md ${
              loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
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
