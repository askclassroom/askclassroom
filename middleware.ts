import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next (Next.js internals)
     * - monitoring (Sentry tunnel route - must NOT go through Clerk)
     * - static files
     */
    '/((?!_next|monitoring|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};