# OMNIA: Stack de Servicios & Infraestructura

Este documento detalla los servicios de terceros y las tecnologías de backend elegidas para la operación de **OMNIA**.

## ☁️ Infraestructura Core
*   **Hosting**: [Vercel](https://vercel.com) - Despliegue de frontend y Serverless Functions.
*   **Base de Datos**: [Supabase](https://supabase.com) (PostgreSQL) - Persistencia de productos, clientes y órdenes.
*   **ORM**: [Prisma](https://prisma.io) - Gestión de esquemas y consultas seguras.

## 🔐 Identidad & Sesiones
*   **Autenticación**: [Clerk](https://clerk.com) - Manejo de cuentas de clientes, perfiles y seguridad de sesiones.

## 💳 Fintech & Transacciones
*   **Procesador de Pagos**: [Stripe](https://stripe.com) / [Mercado Pago](https://mercadopago.com.mx) - Pasarela principal para tarjetas y pagos regionales.
*   **Webhooks**: Automatización de estados de pedidos mediante notificaciones asíncronas.

## 📦 Logística & Comunicación
*   **Emails Transaccionales**: [Resend](https://resend.com) - Confirmaciones de compra, recuperación de carrito y guías de envío.
*   **Almacenamiento de Medios (CDN)**: [Cloudinary](https://cloudinary.com) - Gestión y optimización de imágenes de productos en alta resolución.

## 📊 Analytics & Marketing
*   **Métricas**: Google Analytics 4 + Facebook Pixel.
*   **SEO**: Metadata Dinámica de Next.js + JSON-LD (Schema.org).

---
**Propiedad de: Carlos Cervantes**  
**© 2026 OMNIA Platform. Todos los derechos reservados.**
