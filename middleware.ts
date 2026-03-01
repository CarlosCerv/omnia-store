import { auth } from "@/../auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    // Rutas que solo pueden ser visitadas por administradores o usuarios logueados
    const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard');

    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL('/api/auth/signin', nextUrl.origin);
        // loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(loginUrl);
    }

    return;
})

export const config = {
    // Asegurarse de que el limitador de requests y protección solo aplique a app paths y no a estáticos.
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
