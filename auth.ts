import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getPrisma } from "./src/lib/prisma"

// Instanciamos el adaptador SÓLO si hay BD Real y no estamos en un MOCK de build de Vercel (que falla al validarlo internamente el Adapter)
const isPrismaSafe = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('mock');
const adapterData = isPrismaSafe ? PrismaAdapter(getPrisma()) : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...(adapterData ? { adapter: adapterData } : {}),
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
