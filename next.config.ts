import type { NextConfig } from "next";

// ─── Content Security Policy ──────────────────────────────────────────────────
// Define qué recursos puede cargar la página para prevenir XSS y ataques de inyección.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://accounts.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https://*.vercel.app https://*.cloudinary.com https://*.unsplash.com https://images.unsplash.com;
  connect-src 'self' https://api.stripe.com https://accounts.google.com;
  frame-src https://js.stripe.com https://hooks.stripe.com https://accounts.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  // CSP - protege contra XSS
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  // Previene que el browser sniffee el MIME type
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Protección contra clickjacking
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Fuerza HTTPS por 1 año (solo producción)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Previene que la URL de referencia se filtre a otros dominios
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Desactiva acceso a APIs sensibles del browser
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Previene XSS en browsers antiguos
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // ─── Security Headers ───────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Aplicar a todas las rutas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // ─── Imágenes externas permitidas ───────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.vercel.app" },
    ],
  },
};

export default nextConfig;
