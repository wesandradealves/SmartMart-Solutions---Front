'use client';

import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Alert } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Link from 'next/link';
import { useMetadata } from '@/hooks/useMetadata';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { loginUser, clearError, loading, error } = useAuthActions();
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoggedOut = searchParams.get('logout') === '1';

  const handleSubmit = async (values: { email: string; password: string }) => {
    const success = await loginUser(values.email, values.password);
    if (success) {
      router.push('/');
    }
  };

  useMetadata({
    title: 'SmartMart - Login',
    ogTitle: 'SmartMart - Login'
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
        <div className='flex flex-col gap-8'>
          <Link href="/">
            <LazyLoadImage src='/logo.png' className='m-auto' />
          </Link>

          {(error || isLoggedOut) && (
            <Alert
              message={error || "Você foi deslogado."}
              type={error ? "error" : "warning"}
              showIcon
            />
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
