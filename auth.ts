import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"

// ⚠️ PrismaAdapter se carga dinámicamente para evitar que Vercel falle en build-time
// cuando intenta pre-analizar este módulo sin acceso real a la BD.
// Auth.js usará JWT sessions hasta que conectemos correctamente el adapter en runtime.
export const { handlers, auth, signIn, signOut } = NextAuth({
    // adapter: Se conecta en runtime via API route, no en module evaluation
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Resend({
            from: process.env.STORE_EMAIL || "onboarding@resend.dev",
        })
    ],
    pages: {
        signIn: '/login', // Redirigiremos la UI personalizada aquí
    },
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                // Se puede inyectar el ROL de admin aqui si es necesario en el futuro
            }
            return session;
        },
    },
})
