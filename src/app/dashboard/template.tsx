'use client';

import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Header  />
        <main className='flex-1'>
        {children}
        </main>
        <Footer />
    </>
  );
}
