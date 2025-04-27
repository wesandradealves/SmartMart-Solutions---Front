'use client';

import { useMetadata } from '@/hooks/useMetadata';

export default function MyAccount() {
  useMetadata({
    title: 'SmartMart - Minha Conta',
    description: 'Gerencie as informações da sua conta no SmartMart.',
    keywords: 'SmartMart, Minha Conta, Gerenciamento de Conta',
    ogTitle: 'SmartMart - Minha Conta',
    ogImage: '/logo.png',
    favicon: '/favicon.ico',
  });

  return (
    <>Minha Conta</>
  );
}
