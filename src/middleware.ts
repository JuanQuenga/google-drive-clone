import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

const unauthenticatedPaths = ["/", "/login", "/callback"];

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths,
  },
});

// Match against all application routes while ignoring static assets and Next.js internals
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
