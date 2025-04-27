"use client";

import React from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { isAuthenticated, logoutUser } = useAuthActions();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100">
      <div>Header</div>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
