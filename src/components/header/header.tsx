"use client";

import React, { useEffect, useState } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';
import { Layout, Button, Menu } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Link from 'next/link';
import { DashboardOutlined, FileTextOutlined } from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';

const { Header: AntHeader } = Layout;

const Header = () => {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true); 
  }, []);

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link href="/">Dashboard</Link>,
    },
    {
      key: '2',
      icon: <FileTextOutlined />,
      label: <Link href="http://localhost:8000/docs">Documentação</Link>,
    }
  ];

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
    <Sider collapsible style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <AntHeader className="w-full px-2 py-4 h-auto gap-4 flex flex-col">
        <Link href="/">
          <LazyLoadImage className='w-full' src='//apollosolutionsdev.com/wp-content/uploads/elementor/thumbs/Versoes-do-Logo-500-x-300-px-1-qrl9ms494iss53p1w0xld7l0bcqtcphompxo6f7zhk.png' />
        </Link>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
        
        {rendered && isAuthenticated && (
          <Button className='rounded-none uppercase font-bold text-xs mt-auto' type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        )}
      </AntHeader>
    </Sider>
  );
};

export default Header;
