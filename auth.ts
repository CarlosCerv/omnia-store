import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./src/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
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
