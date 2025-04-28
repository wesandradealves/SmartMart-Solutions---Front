import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware para proteger rotas e redirecionar usuários não autenticados ou sem permissão
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const sessionToken = request.cookies.get('session_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const protectedRoutes: Record<string, string> = {
    '/dashboard/usuarios': 'admin',
  };

  const requiredRole = protectedRoutes[pathname];

  if (requiredRole && userRole == requiredRole) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/dashboard/:path*',
    '/login', 
  ],
};
