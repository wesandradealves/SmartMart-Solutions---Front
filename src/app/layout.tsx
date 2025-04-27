'use client';
import Script from 'next/script';
import {
  _colors,
  _breakpoints,
} from '@/assets/scss/variables';
const theme = {
  _colors,
  _breakpoints,
};
import { App, GlobalStyle } from '@/app/style';
import '@/assets/scss/globals.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import { ThemeProvider } from 'styled-components';
import StyledJsxRegistry from './registry';
import { Suspense, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
// import Header from '@/components/header/header';
// import Footer from '@/components/footer/footer';
// import { MediaProvider } from '@/context/media';
// import { AuthProvider } from '@/context/auth';
import { LoaderProvider, useLoader } from '@/context/spinner';
// import { SettingsProvider } from '@/context/settings';
import { setupInterceptors } from '@/services/api';
import Spinner from '@/components/spinner/spinner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const scrollRef = useRef<HTMLHtmlElement | null>(null);
  const { scrollY } = useScroll({
    container: scrollRef,
  });

  const [scrollPosition, setScrollPosition] = useState<number>(0);

  scrollY.onChange((n) => {
    setScrollPosition(n);
  });

  return (
    <html lang="pt-br" ref={scrollRef}>
      <body
        suppressHydrationWarning={true}
        className={classNames(
          `antialiased 
          overflow-x-hidden
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-track]:ms-7
          [&::-webkit-scrollbar-track]:me-7
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-yellow-500
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:cursor-move
          `
        )}
      >
        <Script
          src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js"
          strategy="afterInteractive"
        />
        <ThemeProvider theme={theme}>
          <LoaderProvider>
            <LoaderSetup />
            {/* <AuthProvider> */}
              {/* <MediaProvider> */}
                {/* <SettingsProvider> */}
                  <Suspense fallback={<div>Loading...</div>}>
                    <StyledJsxRegistry>
                      <AnimatePresence
                        mode="wait"
                        initial={true}
                        onExitComplete={() => window.scrollTo(0, 0)}
                      >
                        <App id="primary">
                          <motion.div
                            className="min-h-screen flex flex-start flex-col"
                            initial={{ x: 0, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 0, opacity: 0 }}
                          >
                            {/* <Header scrollPosition={scrollPosition} /> */}
                            {children}
                            {/* <Footer /> */}
                          </motion.div>
                          <Spinner />
                        </App>
                      </AnimatePresence>
                    </StyledJsxRegistry>
                  </Suspense>
                {/* </SettingsProvider> */}
              {/* </MediaProvider> */}
            {/* </AuthProvider> */}
          </LoaderProvider>
          <GlobalStyle />
        </ThemeProvider>
      </body>
    </html>
  );
}

function LoaderSetup() {
  const { setLoading } = useLoader();

  useEffect(() => {
    setupInterceptors(setLoading);
  }, [setLoading]);

  return null;
}