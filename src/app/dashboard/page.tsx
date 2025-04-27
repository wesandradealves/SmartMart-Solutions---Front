'use client';

import Header from '@/components/header/header';
import { Layout } from 'antd';
import Footer from '@/components/footer/footer';

const { Content } = Layout;

export default function Dashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />

      <Layout className='bg-gray-100 p-4'>
        <Content className='flex flex-col flex-wrap justify-between'>
          Bem-vindo ao painel de controle!
          <Footer />
        </Content>
      </Layout>
    </Layout>
  );
}
