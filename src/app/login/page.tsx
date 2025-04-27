'use client';

import React from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Alert } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Link from 'next/link';

export default function LoginPage() {
  const { loginUser, clearError, loading, error } = useAuthActions();
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const success = await loginUser(values.email, values.password);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
        <div className='flex flex-col gap-8'>
          <Link href="/">
            <LazyLoadImage src='//apollosolutionsdev.com/wp-content/uploads/elementor/thumbs/Versoes-do-Logo-500-x-300-px-1-qrl9ms494iss53p1w0xld7l0bcqtcphompxo6f7zhk.png' className='m-auto' />
          </Link>

          {error && (
            <Alert message={error} type="error" showIcon />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onFieldsChange={() => clearError()}
          >
            <Form.Item
              label="E-mail ou Nome de Usuário"
              name="email"
              rules={[{ required: true, message: 'Por favor, insira seu e-mail ou nome de usuário!' }]}
            >
              <Input className='rounded-none' placeholder="Digite seu e-mail ou nome de usuário" />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="password"
              rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
            >
              <Input.Password className='rounded-none' placeholder="Digite sua senha" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className='rounded-none uppercase font-bold text-xs w-full'
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
