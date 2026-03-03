import { PrismaClient } from "@prisma/client";

// ─── pgbouncer en producción ──────────────────────────────────────────────────
// Inyectamos pgbouncer=true en DATABASE_URL antes de instanciar Prisma.
// Esto evita transacciones interactivas incompatibles con connection poolers.
function injectPgBouncer() {
    const url = process.env.DATABASE_URL;
    if (!url) return;
    if (process.env.NODE_ENV === "production" && !url.includes("pgbouncer=true")) {
        const sep = url.includes("?") ? "&" : "?";
        process.env.DATABASE_URL = `${url}${sep}pgbouncer=true`;
    }
}

// ─── Getter que evita ejecución estática en build time ───────────────────────
export const getPrisma = (): PrismaClient => {
    const url = process.env.DATABASE_URL;

    if (!url) {
        console.warn("[Prisma] No DATABASE_URL — devolviendo mock");
        return {} as PrismaClient;
    }

    injectPgBouncer();

    if (process.env.NODE_ENV === "production") {
        return new PrismaClient();
    }

    // Singleton en desarrollo para evitar saturar conexiones en Hot Reload
    if (!(globalThis as any)._prisma) {
        (globalThis as any)._prisma = new PrismaClient();
    }
    return (globalThis as any)._prisma as PrismaClient;
};
