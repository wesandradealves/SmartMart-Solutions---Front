"use client";

import React, { useEffect, useReducer } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Button, Menu } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Link from 'next/link';
import { DashboardOutlined, FileTextOutlined } from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { initialState, reducer } from './reducer';

const { Header: AntHeader } = Layout;

const Header = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated, logoutUser } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    dispatch({ type: 'SET_RENDERED' });
  }, []);

  const handleLogout = async () => {
    dispatch({ type: 'START_LOGOUT' });
    try {
      await logoutUser();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      dispatch({ type: 'FINISH_LOGOUT' });
    }
  };

  const getSelectedKey = () => {
    if (pathname === '/') return '1';
    if (pathname.startsWith('/dashboard/minha-conta')) return '2';
    if (pathname === '/docs') return '3';
    return '1';
  };

  return (
    <Sider style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <AntHeader className="w-full px-2 py-4 h-screen overflow-auto gap-4 flex flex-col bg-white">
        <Link href="/">
          <LazyLoadImage className="w-full" src="/logo.png" />
        </Link>
        <Menu
          style={{ border: 'none' }}
          theme="light"
          className='bg-transparent'
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: <Link href="/">Dashboard</Link>,
            },
            {
              key: '2',
              icon: <FileTextOutlined />,
              label: <Link href="/dashboard/minha-conta">Minha Conta</Link>,
            },
            {
              key: '3',
              icon: <FileTextOutlined />,
              label: <Link href="http://localhost:8000/docs">Documentação</Link>,
            },
          ]}
        />

        {state.rendered && isAuthenticated && !state.isLoggingOut && (
          <Button className="rounded-none uppercase font-bold text-xs mt-auto" type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        )}
      </AntHeader>
    </Sider>
  );
};

export default Header;
