'use client';

import { useMetadata } from "@/hooks/useMetadata";
import { useAuth } from "@/context/auth"; 
export default function Home() {
  const { user } = useAuth();

  useMetadata({
    title: `SmartMart - Bem vindo, ${user?.email} - Dashboard`,
    ogTitle: `SmartMart - Bem vindo, ${user?.email} - Dashboard`
  });
  
  return (
    <>Bem-vindo ao painel de controle!</>
  );
}
