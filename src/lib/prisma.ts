import { PrismaClient } from "@prisma/client";

// Exportamos Prisma mediante una función getter para evitar ejecución estática al ser importado.
export const getPrisma = () => {
    if (!process.env.DATABASE_URL) {
        console.warn("No DATABASE_URL found. Prisma Mock used.");
        return {} as PrismaClient;
    }

    if (process.env.NODE_ENV === "production") {
        return new PrismaClient();
    }

    // Evitar sobrecargar conexiones en Dev (Hot Reloading)
    if (!(globalThis as any).prisma) {
        (globalThis as any).prisma = new PrismaClient();
    }
    return (globalThis as any).prisma;
};
