import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/homepage(.*)',
  '/companions(.*)',
  '/my-journey(.*)',
  '/my-dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect authenticated routes — redirects to sign-in if not logged in
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Match ALL request paths except:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - monitoring   (Sentry tunnel — must bypass Clerk)
     * - favicon.ico
     * - Public static assets
     */
    '/((?!_next/static|_next/image|monitoring|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
};