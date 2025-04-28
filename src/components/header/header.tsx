'use client';

import React, { useEffect, useReducer } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Button, Menu } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Link from 'next/link';
import { DashboardOutlined, FileTextOutlined, AppstoreOutlined } from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { initialState, reducer } from './reducer';

const { Header: AntHeader } = Layout;

const Header = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated, logoutUser, userRole } = useAuthActions();
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
    const routeToKeyMap: Record<string, string> = {
      '/': '1',
      '/dashboard/minha-conta': '2',
      '/dashboard/categorias': '3',
      '/dashboard/produtos': '4',
      '/dashboard/usuarios': '5',
    };
    return routeToKeyMap[pathname] || '1';
  };

  const showAdminMenu = state.rendered && userRole === 'admin';

  const menuItems = [
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
      icon: <AppstoreOutlined />,
      label: <Link href="/dashboard/categorias">Categorias</Link>,
    },
    {
      key: '4',
      icon: <AppstoreOutlined />,
      label: <Link href="/dashboard/produtos">Produtos</Link>,
    },
    showAdminMenu
      ? {
          key: '5',
          icon: <AppstoreOutlined />,
          label: (
            <Link href="/dashboard/usuarios">
              <span>Usuários ⭐</span>
            </Link>
          ),
        }
      : null,
    {
      key: '6',
      icon: <FileTextOutlined />,
      label: <Link href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">Documentação</Link>,
    },
  ].filter((item) => item !== null);

  return (
    <Sider style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <AntHeader className="w-full px-2 py-4 h-screen overflow-auto gap-4 flex flex-col bg-white">
        <Link href="/">
          <LazyLoadImage className="w-full" src="/logo.png" alt="Logo" />
        </Link>

        <Menu
          style={{ border: 'none' }}
          theme="light"
          className="bg-transparent"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
        />

        {state.rendered && isAuthenticated && !state.isLoggingOut && (
          <Button
            block
            className="rounded-none uppercase font-bold text-xs mt-auto"
            type="primary"
            danger
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </AntHeader>
    </Sider>
  );
};

export default Header;
