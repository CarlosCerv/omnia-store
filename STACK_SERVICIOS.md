# OMNIA: Stack de Servicios e Infraestructura

Este documento detalla los servicios de terceros y las tecnologías de backend elegidas para la operación técnica de OMNIA, con un enfoque en la arquitectura Zero-SaaS auto-hospedada y herramientas de infraestructura confiables.

## Infraestructura Core

- **Despliegue Frontend**: Vercel. Aprovechando su Edge Network global para el despliegue del Storefront Next.js y el almacenamiento en caché de rutas dinámicas (ISR).
- **Despliegue Backend**: Servidor Privado Virtual (VPS) mediante DigitalOcean, AWS o Hetzner, ejecutando Ubuntu 22.04 LTS y PM2.
- **Base de Datos**: Supabase (PostgreSQL). Empleado para la persistencia transaccional central de inventarios, pedidos y clientes, con un sistema preconfigurado de Connection Pooling (PgBouncer).
- **E-commerce Engine**: Medusa.js. Framework Node.js auto-hospedado utilizado como núcleo de operaciones e-commerce (Gestión de Stock, OMS, PIM).

## Herramientas de Abstracción de Datos

- **ORM Activo**: Prisma. Utilizado por el Storefront para interacciones de lectura directa en modo fallback y escrituras como creación de Pedidos iniciales.
- **Validación Estricta**: Zod. Empleado en el perímetro de las Server Actions para saneamiento de entradas del cliente.

## Seguridad y Acceso

- **Autenticación Frontend**: NextAuth.js. Adaptador para proveedores OAuth garantizando el acceso seguro al Panel Administrativo del sistema.
- **Gestión CSR/SSR**: Autenticación manejada parcialmente en el Edge pre-render con validación de cookies seguras (`HttpOnly`, `SameSite`).

## Pagos y Procesamiento Financiero

- **Método de Pago Actual**: Transferencia Bancaria Directa (SPEI). El motor captura la orden en estado pendiente hasta confirmación oficial del pago referenciado.
- **Procesador de Pagos (Futuro)**: Stripe. Pasarela principal soportada nativamente por el SDK del backend Medusa para procesamiento automatizado de tarjetas de crédito internacionales y billeteras de Apple/Google.

## Logística y Correspondencia

- **Comunicaciones Transaccionales**: Resend (API). Motor de envío de correos. Gestiona el despacho confirmatorio (receipts) de las órdenes que detallan las cuentas CLABE e instrucciones de liquidación para el usuario.
- **Almacenamiento de Componentes Gráficos (CDN)**: Cloudinary. Gestión de imágenes masivas en alta definición aplicadas mediante el tag `<Image>` optimizado nativamente a través del proxy de Next.js.

## Observabilidad y Analíticas

- **Métricas Comportamentales**: Google Analytics 4 y la implementación de Meta Pixel.
- **Atributos de Búsqueda (SEO)**: Metadatos calculados de manera dinámica integrando JSON-LD (Schema.org) directamente en los encabezados del DOM de cada vista de producto.

---
Propiedad de: Carlos Cervantes  
© 2026 OMNIA Platform. Todos los derechos reservados.
