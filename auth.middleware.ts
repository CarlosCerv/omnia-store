/**
 * Versión de NextAuth SOLO para el Middleware (Edge Runtime).
 * No incluye el PrismaAdapter porque Prisma NO es compatible con Edge Runtime.
 * Esta configuración solo valida el JWT/session token.
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth, handlers: edgeHandlers } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    pages: {
        signIn: '/login',
    },
});
