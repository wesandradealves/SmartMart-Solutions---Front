'use client';

import { useAuth } from '@/context/auth';
import { useMetadata } from '@/hooks/useMetadata';
import { useForm, Controller } from 'react-hook-form'; 
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateMyAccount } from '@/services/myAccountService';
import { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useRouter } from 'next/navigation';

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres!').optional(),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function MyAccount() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  useMetadata({
    title: `SmartMart - Minha Conta`,
    ogTitle: `SmartMart - Minha Conta`,
  });

  useEffect(() => {
    if (user) {
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!user) return;

    const sanitizedData = {
      ...data,
      password: data.password || "", 
    };

    try {
      await updateMyAccount(user.user_id, sanitizedData);
    
      if ((sanitizedData.email && sanitizedData.email !== user.email) || sanitizedData.password) {
        await logout(); 
        router.push('/login?logout=1');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
    
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)} 
    >
      <Form.Item
        label="E-mail"
        name="email"
        initialValue={user?.email}
        rules={[{ type: 'email', message: 'Por favor, insira um e-mail válido!' }]}
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email ? errors.email.message : ''}
      >
        <Input {...control.register('email')} placeholder="Digite seu e-mail" />
      </Form.Item>

      <Form.Item
        label="Senha"
        name="password"
        validateStatus={errors.password ? 'error' : ''}
        help={errors.password ? errors.password.message : ''}
      >
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Input.Password
              {...field} 
              placeholder="Digite sua senha"
            />
          )}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Atualizar</Button>
      </Form.Item>
    </Form>
  );
}
