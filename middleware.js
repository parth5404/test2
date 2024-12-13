import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/explore',
  '/login',
  '/register',
  '/about'
];

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Allow access to public routes without authentication
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for creator profile routes
  if (pathname.match(/^\/[a-zA-Z0-9_-]+$/)) {
    return NextResponse.next();
  }

  // Check for API routes
  if (pathname.startsWith('/api/')) {
    // Allow authentication API routes
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }
    
    // For other API routes, verify token
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  // For protected routes, verify token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return NextResponse.next();
  } catch (error) {
    request.cookies.delete('token');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
