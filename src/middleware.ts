import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Admin route'larını kontrol et
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Token yoksa veya role ADMIN değilse, login sayfasına yönlendir
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Admin route'larına yalnızca ADMIN token sahipleri erişebilir
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token && token.role === 'ADMIN';
        }
        // Diğer route'lar için token gerekmez
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
