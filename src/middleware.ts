import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware para proteger rotas e redirecionar usuários não autenticados
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Se estiver tentando acessar /login, deixa passar
  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // ✅ Se estiver na raíz '/', redireciona pra /home
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const sessionToken = request.cookies.get('session_token')?.value;

  // ✅ Se não tiver token em qualquer outra rota protegida, manda para login
  if (!sessionToken) {
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
    '/login', 
  ],
};
