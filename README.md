# OMNIA Platform v2.0

OMNIA es una plataforma e-commerce de alta gama desarrollada bajo la narrativa estética Nordic Gallery. Este proyecto opera como una infraestructura startup completa, orientada a la comercialización de moda de lujo minimalista y a la excelencia operativa.

Propiedad de: Carlos Cervantes © 2026. Todos los derechos reservados.

---

## Visión del Proyecto

OMNIA conceptualiza la experiencia de compra en línea como una galería digital donde cada producto se presenta como una pieza de exhibición. La plataforma se fundamenta en los siguientes pilares:

1. **Estética Industrial-Minimalista**: Utilización estructurada del espacio en blanco (whitespace), tipografía sans-serif (Outfit e Inter) y una paleta de colores neutros estricta.
2. **Localización Múltiple**: Experiencia nativa optimizada para el mercado hispanohablante.
3. **Escalabilidad**: Arquitectura modular desacoplada, preparada para despliegue en infraestructuras propias (Zero-SaaS) e integraciones de terceros (Medusa.js, PostgreSQL, Resend).

## Características Técnicas

- **Framework Frontend**: Next.js (App Router)
- **Framework Backend**: Medusa.js (Node.js)
- **Base de Datos**: PostgreSQL
- **Estilos y UI**: Vanilla CSS complementado con Tailwind CSS
- **Interacciones**: Framer Motion
- **Iconografía**: Lucide React
- **Autenticación**: NextAuth.js (Google OAuth)
- **Correos Transaccionales**: Resend API

## Documentación de Referencia

La documentación detallada se encuentra segmentada en los siguientes módulos:

- `omnia-backend/OPERACIONES.md`: Manual operativo para el despliegue del backend, gestión de catálogo y automatización de servidores.
- `omnia-backend/README.md`: Documentación técnica de la capa de API e integraciones de servidor.

## Arquitectura de Despliegue

El ecosistema OMNIA está diseñado para un despliegue híbrido eficiente:

- **Frontend (Storefront & Admin)**: Optimizado para Edge Deployment a través de Vercel, aprovechando su CDN global y optimización nativa de activos.
- **Backend (Medusa API & Base de Datos)**: Arquitectura auto-hospedada (Zero-SaaS) en servidor Linux (Ubuntu/Debian) mediante Nginx y PM2, con pipelines de Integración y Despliegue Continuo (CI/CD) orquestados mediante GitHub Actions.

---
Desarrollado para OMNIA Studio por Carlos Cervantes.
