# Roadmap Maestro: Lanzamiento OMNIA E-Commerce
*Documento consolidado que unifica la infraestructura backend, la experiencia frontend y los requerimientos funcionales/legales para lograr un e-commerce 100% operativo bajo la arquitectura Zero-SaaS (Next.js + Medusa.js).*

---

## 🌐 FASE 1: Aprovisionamiento del Backend (VPS)
*Objetivo: Tener el motor de comercio y el panel de administración vivo 24/7.*

- [ ] **1.1. Servidor en la Nube (VPS)**
  - Contratar máquina en DigitalOcean (Droplet), AWS o Hetzner (Ubuntu 22.04 LTS, mín. 2GB RAM).
- [ ] **1.2. Dominio y Certificados (SSL)**
  - Configurar DNS (ej. `api.omnia.com` apuntando al VPS).
  - Ejecutar script de aprovisionamiento (`setup-server.sh`) para instalar Node, Nginx, PostgreSQL y PM2.
  - Asegurar con Certbot (HTTPS).
- [ ] **1.3. CI/CD Automatizado**
  - Configurar las variables `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` en GitHub Secrets para que al hacer *push* a la rama `main` del backend, se actualice el servidor automáticamente.
- [ ] **1.4. Panel Administrativo Operativo (OMS/PIM)**
  - Poblar la base de datos de producción usando el script de Seed (`seed-products.ts`).
  - Entrar a `https://api.omnia.com/app` y validar la creación manual de inventario, stock y perfiles de envío (Shipping Profiles).

---

## 🛒 FASE 2: Conexión Frontend ↔ Backend Total
*Objetivo: Que la tienda web sea un reflejo exacto de la base de datos de Medusa, sin fallbacks temporales.*

- [ ] **2.1. Deprecación de Prisma Local**
  - Modificar `ProductService.ts` en el Storefront para que elimine el flujo "Fallback" de lectura de Prisma. La única fuente de verdad será `medusaClient.ts`.
- [ ] **2.2. Apuntar Frontend a Producción**
  - Cambiar en Vercel la variable `MEDUSA_BACKEND_URL` de localhost al dominio del VPS (`https://api.omnia.com`).
- [ ] **2.3. Sincronización de Caché (Webhooks)**
  - Configurar ISR On-Demand: Cuando modifiques un precio o el stock en el panel de Medusa, este enviará una señal a Vercel para actualizar la página instantáneamente sin recompilar todo el sitio web.

---

## 👨‍💻 FASE 3: Experiencia de Usuario Web (Frontend)
*Objetivo: Añadir las funciones indispensables que espera el consumidor interactuando con una marca premium.*

- [ ] **3.1. Buscador Global Inteligente**
  - Habilitar la lupa del Header para buscar en todo el catálogo de productos consultando la API de Medusa (`/store/products?q=...`).
- [ ] **3.2. Galerías de Producto Ricas**
  - Convertir la imagen estática de la página de detalle (`/productos/[slug]`) en un carrusel dinámico o grilla fotográfica si un producto contiene más de una imagen de catálogo en Medusa.
- [ ] **3.3. Área de Clientes (Mi Cuenta)**
  - Página privada (`/dashboard` o `/account`) para que un usuario autenticado vea su historial de pedidos usando la API cliente de Medusa: `/store/customers/me/orders`.
- [ ] **3.4. Seguimiento Público de Órdenes**
  - Construir `/seguimiento`, un formulario donde un usuario invitado ingresa *Email + Número de Orden* para saber el estado de su envío sin necesidad de crear cuenta.

---

## 📦 FASE 4: Operaciones y Cumplimiento (Fulfillment)
*Objetivo: Administrar el ciclo de vida del dinero y los paquetes físicos (End-to-End).*

- [ ] **4.1. Suscriptores de Eventos en Medusa (Emails Triggers)**
  - Cuando tú marques una orden como *"Pagada"* en el Panel de Medusa, este automáticamente enviará un email con el *Recibo Oficial*.
  - Cuando agregues el Número de Guía (Tracking) y marques la orden como *"Enviada"*, Medusa le avisará por correo al usuario con su código FedEx/DHL.
- [ ] **4.2. Base de Datos de Suscriptores (Newsletter)**
  - Conectar el formulario visual del footer hacia Resend Audiences o la API de Klaviyo.
- [ ] **4.3. Implementación Stripe (Futuro/Opcional)**
  - Cambiar el actual flujo de 'Transferencia Bancaria' por tarjetas de crédito integrando claves reales en Vercel y el VPS cuando la tienda crezca.

---

## ⚖️ FASE 5: Lanzamiento Institucional y Legal (MarTech & Docs)
*Objetivo: Cumplir con lineamientos comerciales, de SEO y rastreo antes del Go-Live.*

- [ ] **5.1. Analíticas Activas (CRO/Ads)**
  - Inyectar el Meta Pixel (Facebook/Instagram Ads) a través de `next/script` disparando eventos `ViewContent`, `AddToCart` y `Purchase`.
  - Integrar Google Analytics 4 (GA4).
- [ ] **5.2. Páginas Legales Faltantes**
  - Redactar y publicar:
    - Términos y Condiciones (T&C).
    - Aviso de Privacidad.
    - Políticas de Devoluciones (Vincular a Footer: `/devoluciones`).
- [ ] **5.3. Dominio Definitivo y Correos**
  - Conectar el dominio web en Vercel (`omnia.com`).
  - Habilitar los correos corporativos en Google Workspace (ej. `studio@omnia.com`) de donde se enviarán todos los correos transaccionales vía Resend.
- [ ] **5.4. Pruebas End-to-End (UAT)**
  - Completar ciclo simulado en ambiente real: crear una cuenta en Vercel -> agregar producto al carrito -> comprar eligiendo envío a un CP real -> recibir email de checkout bancario -> confirmar pago cruzado como Admin en Medusa -> capturar la guía de paquetería -> cliente debe recibir email de envío.

---

## 🚀 FASE 6: Optimización de Plataforma y SEO (Go-Live)
*Objetivo: Maximizar el posicionamiento orgánico en motores de búsqueda (Google) y asegurar una calificación de velocidad óptima (Core Web Vitals).*

- [ ] **6.1. SEO Estructural (Next.js)**
  - Generación de `sitemap.xml` dinámico y archivo `robots.txt` orientando el rastreo de Googlebot hacia el catálogo.
  - Generación de Microdatos Estructurados (JSON-LD Schema.org) inyectados en la cabecera de las vistas del producto, esenciales para que Google muestre el precio, disponibilidad de stock e imágenes directamente en el buscador (Google Shopping orgánico).
- [ ] **6.2. Optimizaciones de Medios (Assets)**
  - Configurar conversiones a WebP o AVIF en la CDN de imágenes (Cloudinary) nativamente desde `next/image` de Next.js.
  - Asegurar pre-cargas asíncronas de las fuentes tipográficas locales y web (`next/font`).
- [ ] **6.3. Social Graph (Open Graph / Twitter Cards)**
  - Generar dinámicamente imágenes de previsualización de Open Graph (función de Next.js `ImageResponse` o metaetiquetas dedicadas) para que, al compartir el enlace de un artículo por WhatsApp o X, se despliegue una imagen fotorealista comercial de tu colección particular.
- [ ] **6.4. Core Web Vitals (Velocidad)**
  - Revisar y minimizar el CLS (Cumulative Layout Shift) en las transiciones de carga entre `/productos` y la vista singular.
  - Optimizar el LCP (Largest Contentful Paint) precargando las imágenes de las cabeceras/héroes principales (`priority={true}`).
