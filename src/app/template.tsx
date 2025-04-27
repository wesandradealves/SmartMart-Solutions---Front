'use client';

// import { Page, PageService } from '../services/pageService';
// import { usePathname } from 'next/navigation';
// import { useMetadata } from "@/hooks/useMetadata";
// import { useEffect, useState, useCallback, useMemo } from 'react';
// import { useSettings } from '@/context/settings';
// import { ContentService } from '@/services/ContentService';
// import { useMedia } from '@/context/media'; 


export default function Template({ children }: { children: React.ReactNode }) {
  // const { settings } = useSettings();
  // const { setMediaData } = useMedia(); 
  // const [page, setPage] = useState<Page | null>(null);
  // const pathname = usePathname();

  // const loadPage = useCallback(async (pathname: string) => {
  //   try {
  //     const data = await PageService(pathname);
  //     if (data) setPage(data as Page); 
  //   } catch (error) {
  //     console.error('Error loading navigation:', error);
  //   }
  // }, []);

  // const loadPost = useCallback(async (id: string) => {
  //   try {
  //     const data = await ContentService('midia', id);
  //     if (data) {
  //       setPage(data as unknown as Page);
  
  //       const normalized = Array.isArray(data) ? data : [data]; 
  //       setMediaData(normalized);
  //     }
  //   } catch (error) {
  //     console.error('Error loading navigation:', error);
  //   }
  // }, [setMediaData]);
  

  // useEffect(() => {
  //   const id = pathname.split("/").pop();
  //   if (pathname.split("/").includes('media') && id) {
  //     loadPost(id);
  //   } else {
  //     loadPage(pathname);
  //   }
  // }, [pathname, loadPage, loadPost]);

  // const title = useMemo(() => (page?.title?.rendered ? ` - ${page.title.rendered}` : ''), [page]);

  // useMetadata({
  //   title: `${settings?.blog_info.name ?? 'BDM Digital'}${title}`,
  //   ogTitle: `${settings?.blog_info.name ?? 'BDM Digital'}${title}`,
  //   favicon: settings?.favicon,
  // });

  return (
    <main className='flex-1'>
      {children}
    </main>
  );
}
