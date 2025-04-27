'use client';

import { useMetadata } from "@/hooks/useMetadata";

export default function Home() {
  useMetadata({
    title: `SmartMart - Dashboard`,
    ogTitle: `SmartMart - Dashboard`
  });
  
  return (
    <>Bem-vindo ao painel de controle!</>
  );
}
