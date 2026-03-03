import { loadEnv, defineConfig } from "@medusajs/framework/utils";

// Carga variables de entorno desde .env
loadEnv(process.env.NODE_ENV || "development", process.cwd());

export default defineConfig({
    projectConfig: {
        // ─── Base de Datos ──────────────────────────────────────────────────────
        databaseUrl: process.env.DATABASE_URL,
        databaseLogging: process.env.NODE_ENV === "development",

        // ─── HTTP ───────────────────────────────────────────────────────────────
        http: {
            // Storefront (Next.js) y Admin pueden conectarse
            storeCors: process.env.STORE_CORS || "http://localhost:3000",
            adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
            authCors: process.env.STORE_CORS || "http://localhost:3000",

            // Tokens de seguridad
            jwtSecret: process.env.JWT_SECRET || "supersecret-dev-only",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret-dev-only",
        },
    },

    // ─── Módulos ────────────────────────────────────────────────────────────────
    modules: [
        // Almacenamiento local de archivos/imágenes (reemplazar por S3/Cloudinary en prod)
        {
            resolve: "@medusajs/file-local",
            options: {
                upload_dir: "uploads",
                backend_url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9000",
            },
        },

        // Stripe como proveedor de pagos
        ...(process.env.STRIPE_API_KEY ? [{
            resolve: "@medusajs/payment-stripe",
            options: {
                api_key: process.env.STRIPE_API_KEY,
                webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
                capture: true,
            },
        }] : []),
    ],
});
