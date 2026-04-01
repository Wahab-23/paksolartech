import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_ROUTES = ['/login', '/register', '/api/auth', '/'];
const ADMIN_ROUTES = ['/admin'];
const VENDOR_ROUTES = ['/vendor'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('paksolar_token')?.value;

    // 1. Allow public routes
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // 2. Check for token
    if (!token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    const user = await verifyToken(token);
    if (!user) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('paksolar_token');
        return response;
    }

    // 3. RBAC checks
    if (ADMIN_ROUTES.some(route => pathname.startsWith(route)) && !['super_admin', 'admin'].includes(user.role)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (VENDOR_ROUTES.some(route => pathname.startsWith(route)) && user.role !== 'vendor') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
