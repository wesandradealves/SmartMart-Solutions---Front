import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value;

  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!sessionToken && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',       
    '/home',    
    '/dashboard',   
    '/products/:path*',
    '/categories/:path*',
    '/sales/:path*',
    '/users/:path*',
    '/price-history/:path*',
  ],
};
