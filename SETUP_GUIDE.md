# Guía de Configuración OMNIA Storefront

Bienvenido al repositorio de la tienda online **OMNIA**. Este proyecto utiliza **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** y **TypeScript** con una arquitectura escalable basada en "características" (Feature-Driven).

Esta guía detalla los pasos para poner en marcha el proyecto en un entorno local.

---

## 1. Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de comenzar:

-   **Node.js**: Versión `20.x` o superior (se recomienda usar `nvm` o `fnm` para gestionar versiones).
-   **npm**: Versión `10.x` o superior. Alternativamente puedes usar `pnpm` o `yarn`.

## 2. Instalación

Clona el repositorio o navega hasta el directorio raíz del proyecto (`omnia-store`) y ejecuta el siguiente comando para instalar todas las dependencias:

```bash
npm install
```

Esto instalará librerías clave como:
- `next`, `react`, `react-dom`
- `tailwindcss`, `@tailwindcss/postcss`
- `framer-motion` (para animaciones y transiciones suaves)
- `lucide-react` (para iconografía minimalista)
- `zustand` (para el manejo de estado global ligero)

## 3. Ejecutar el Servidor de Desarrollo

Una vez instaladas las dependencias, inicia el servidor de desarrollo local:

```bash
npm run dev
```

Abre tu navegador web y dirígete a [http://localhost:3000](http://localhost:3000) para ver la aplicación corriendo. La página se actualizará automáticamente (Hot Module Replacement) cada vez que modifiques código en la carpeta `src`.

## 4. Scripts y Comandos Útiles

El archivo `package.json` incluye los siguientes comandos principales:

-   **`npm run dev`**: Inicia la aplicación en modo desarrollo.
-   **`npm run build`**: Construye la aplicación optimizada para producción. Es crucial ejecutar esto antes de un despliegue para asegurar que no hay errores de TypeScript o compilación.
-   **`npm run start`**: Inicia el servidor de producción (requiere haber ejecutado `npm run build` previamente).
-   **`npm run lint`**: Analiza el código buscando errores de estilo, importaciones sin uso, y vulnerabilidades en TypeScript y React usando ESLint.

## 5. Arquitectura y Estructura del Código

El código fuente se encuentra dentro de la carpeta `src/`. El proyecto sigue una arquitectura **Feature-Driven**, lo cual significa que el código está organizado por funcionalidad o dominio de negocio:

```text
src/
├── app/                  # Sistema de enrutamiento App Router de Next.js (pages, layouts)
├── components/           # Componentes UI globales (Layouts, UI primitives)
│   └── layout/           # Componentes globales de estructura (Header, etc.)
├── features/             # Módulos específicos del negocio (Core de la escala)
│   ├── cart/             # Lógica y UI del carrito
│   ├── home/             # Componentes específicos de la página de inicio (Hero)
│   └── products/         # Pantallas de detalle de productos y lógica relacionada
├── lib/                  # Utilidades como clientes de API o helpers
└── types/                # Interfaces y tipos globales compartidos
```

## 6. Siguientes Pasos Recomendados

Si estás integrándote al proyecto, algunas de las primeras tareas a visualizar son:
1.  **Revisar el estado global**: El archivo de configuración de `zustand` (próximo a implementarse en `src/lib/store` o dentro de `src/features/cart`).
2.  **Integración de Datos**: Conectar el frontend con el JSON estático de productos y posteriormente un CMS / Headless Commerce.
3.  **Pruebas**: Explorar la futura configuración de `vitest` / `playwright`.
