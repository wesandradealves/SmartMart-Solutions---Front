"use client";

import React, { useState, useEffect } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';
import { Layout, Button } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Link from 'next/link';
import { NavList, Nav, NavItem } from './styles';

const { Header: AntHeader } = Layout;

const Header = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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
    <AntHeader className="flex items-center justify-between bg-gray-100 py-2 h-auto">
      <Link href="/">
        <LazyLoadImage className='w-[140px]' src='//apollosolutionsdev.com/wp-content/uploads/elementor/thumbs/Versoes-do-Logo-500-x-300-px-1-qrl9ms494iss53p1w0xld7l0bcqtcphompxo6f7zhk.png' />
      </Link>

      <NavList>
        <Nav className='list-none flex items-center justify-end gap-4'>
          <NavItem>
            <Link target='_blank' href="http://localhost:8000/docs">Documentaçâo</Link>
          </NavItem>

          {mounted && isAuthenticated && (
            <NavItem>
              <Button className='rounded-none uppercase font-bold text-xs' type="primary" danger onClick={handleLogout}>
                Logout
              </Button>
            </NavItem>
          )}
        </Nav>
      </NavList>
    </AntHeader>
  );
};

export default Header;
