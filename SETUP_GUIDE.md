# Guía de Configuración Técnica — OMNIA Storefront

Documentación de arquitectura e inicialización para el repositorio principal de la plataforma e-commerce **OMNIA**. Este proyecto operativiza **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** y **TypeScript** estructurado mediante una topología enfocada a características (Feature-Driven Architecture).

---

## 1. Prerrequisitos de Sistema

El entorno de desarrollo requiere la instalación de las siguientes versiones de runtime:

- **Node.js**: Versión `20.x` o superior (se sugiere gestionar el runtime mediante herramientas como `nvm` o `fnm`).
- **npm**: Versión `10.x` o superior. 

## 2. Instalación de Dependencias

Tras la obtención remota del repositorio, posicione su terminal en la raíz estructural (`omnia-store`) y ejecute la resolución de dependencias:

```bash
npm install
```

Este proceso descargará y enlazará las librerías Core:
- `next`, `react`, `react-dom`
- `tailwindcss`, `@tailwindcss/postcss`
- `framer-motion` (Framework de interpolación y renderizado animado)
- `lucide-react` (Matriz iconográfica estandarizada)
- Interfaces de validación (`zod`) y utilidades de base de datos (`@prisma/client`).

## 3. Inicialización de Servidor de Desarrollo

Inicie el motor Turbopack integrado para previsualización interactiva:

```bash
npm run dev
```

El servidor web escuchará las peticiones en el puerto asignado genéricamente `http://localhost:3000`. Cualquier modificación local en la carpeta `src` desencadenará una compilación Delta (Hot Module Replacement) automáticamente.

## 4. Comandos NPM Documentados

Definiciones registradas en el `package.json`:

- **`npm run dev`**: Despliegue de entorno interactivo no optimizado.
- **`npm run build`**: Compilación estricta y generación de HTML estático y funciones Serverless preparadas para producción.
- **`npm run start`**: Ejecución de las compilaciones cacheadas localmente tras un build.
- **`npm run lint`**: Validación sintáctica y estricta bajo directivas de ESLint y el compilador de TypeScript (`tsc`).

## 5. Topología del Repositorio

La carpeta interna `src/` modulariza lógicamente la lógica de negocio a fin de evitar dependencias circulares:

```text
src/
├── app/                  # Topología y jerarquía de rutas basado en Next.js App Router. Integración de API Routes.
├── components/           # Primitivas modulares aisladas e independientes de dominio.
│   └── ui/               # Botones, Elementos Flotantes (Toasts), Dropdowns.
├── features/             # Agrupaciones complejas de negocio que implementan Hooks y UI propia.
│   └── checkout/         # Componentes vinculados a transacciones financieras.
├── lib/                  # Código puramente transaccional (Conexión Prisma, utilidades Mailer, wrappers API Medusa).
└── types/                # Definiciones estáticas de interfaces TypeScript.
```

## 6. Siguientes Fases de Integración

Para colaboradores integrándose a la infraestructura:
1.  **Conexión de Backend**: OMNIA opera ahora un fallback en 3 niveles (Medusa.js SDK -> Prisma PostgreSQL Directo -> Mocks). Revise `src/services/productService.ts` para entender la inyección.
2.  **Transaccionalidad**: El proceso de conversión de compra delega su operación de notificaciones post-venta al API de Resend tras completar transacciones bancarias. Variables críticas existen en el `.env.example`.
