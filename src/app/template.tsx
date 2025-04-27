'use client';

import { useMetadata } from "@/hooks/useMetadata";

export default function Template({ children }: { children: React.ReactNode }) {
  useMetadata({
    title: `SmartMart`,
    ogTitle: `SmartMart`
  });

  return (
    <main className='flex-1'>
      {children}
    </main>
  );
}
