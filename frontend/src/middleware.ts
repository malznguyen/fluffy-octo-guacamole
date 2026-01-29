import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/cart', '/checkout', '/orders'];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Get token from cookies or headers
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;
  
  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If accessing auth route while authenticated, redirect to home
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cart',
    '/cart/:path*',
    '/checkout',
    '/checkout/:path*',
    '/orders',
    '/orders/:path*',
    '/login',
    '/register',
  ],
};
