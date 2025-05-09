'use client';

import React from 'react';
import Header from '@/components/header/header';
import { Layout } from 'antd';
import Footer from '@/components/footer/footer';

const { Content } = Layout;

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <Layout className='min-h-screen'>
      <Header className="hidden md:block" />

      <Layout className='bg-gray-100 p-4'>
        <Content className='flex flex-col flex-wrap'>
          {children}
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
}
