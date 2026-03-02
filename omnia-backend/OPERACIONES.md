# OMNIA — Guía de Operaciones del Backend

> Manual interno del equipo técnico.  
> Stack: Medusa.js (Node.js) · PostgreSQL · PM2 · GitHub Actions  
> Última actualización: Marzo 2026

---

## Tabla de Contenidos

1. [Levantar el servidor local](#1-levantar-el-servidor-local)
2. [Acceder al Panel de Administración](#2-acceder-al-panel-de-administración)
3. [Cómo agregar un nuevo producto (Serie de Producción)](#3-cómo-agregar-un-nuevo-producto)
4. [Cómo gestionar el inventario](#4-cómo-gestionar-el-inventario)
5. [Cómo funciona el despliegue automático](#5-cómo-funciona-el-despliegue-automático)
6. [Comandos PM2 para operación manual](#6-comandos-pm2-para-operación-manual)

---

## 1. Levantar el servidor local

### Prerrequisitos
- Node.js 20+
- PostgreSQL corriendo localmente
- Base de datos `omnia_medusa` creada

```bash
# 1. Clonar el backend (si es la primera vez)
git clone https://github.com/tu-org/omnia-backend.git
cd omnia-backend

# 2. Instalar dependencias
npm install

# 3. Copiar y editar el archivo de entorno
cp .env.template .env
# Edita .env con tu DATABASE_URL, JWT_SECRET y COOKIE_SECRET

# 4. Correr migraciones de DB (solo primera vez o tras nuevas migraciones)
npx medusa db:migrate

# 5. Crear usuario administrador (solo primera vez)
npx medusa user -e admin@omnia.com -p tu_password

# 6. Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:9000`.

---

## 2. Acceder al Panel de Administración

Con el servidor corriendo, abre tu navegador en:

```
http://localhost:9000/app
```

Usa las credenciales que creaste con `npx medusa user -e ... -p ...`.

En **producción**, el panel está disponible en:

```
https://backend.tu-dominio.com/app
```

---

## 3. Cómo Agregar un Nuevo Producto

### Desde el panel de Medusa Admin:

1. **Ir a Products** → Click en **"New Product"**
2. **Información general**:
   - `Title`: Nombre del producto (ej: `Omnia Signature Black`)  
   - `Subtitle`: Descripción corta (ej: `Algodón orgánico de alto gramaje`)
   - `Description`: Descripción completa editorial
3. **Organizatión**:
   - `Collection`: Asignar a colección (ej: `Signature`)
   - `Tags`: Agregar etiquetas (ej: `esencial`, `temporada`)
4. **Variants** (Variantes = combinaciones de Talla/Color):
   - Click en **"Add variant"**
   - Definir `Options`: `Size` (S, M, L, XL) y `Color` (Onix, Hueso)
   - Definir el precio en MXN para cada variante
5. **Thumbnail**: Subir imagen principal del producto
6. **Media**: Subir imágenes adicionales de galería
7. Click **"Save and publish"**

> 💡 **El producto aparecerá automáticamente en el storefront** en la próxima carga de página (el storefront consulta la API de Medusa).

---

## 4. Cómo Gestionar el Inventario

### Flujo de inventario en Medusa:

Medusa maneja el inventario a nivel de **variante** (combinación SKU = Talla + Color).

1. **Ver stock**: Ve a **Products** → Seleccionar producto → Tab **"Variants"**
2. **Actualizar stock**: Click en la variante → Campo **"Inventory"** → Ingresar cantidad
3. **Stock en 0**: El producto se marca automáticamente como `out_of_stock` en la API
4. **Reservas**: Al completarse un pago, Medusa descuenta automáticamente el stock de la variante comprada

### En el Storefront:
El componente `ProductDetailClient.tsx` consulta la disponibilidad de stock vía la API de Medusa. Si el stock es 0, el botón "Añadir a la Bolsa" se desactiva automáticamente.

---

## 5. Cómo Funciona el Despliegue Automático

### Flujo completo de un `git push`:

```
Desarrollador hace git push a main
         │
         ▼
GitHub Actions detecta el push
(.github/workflows/deploy-backend.yml)
         │
         ▼
Runner ubuntu-latest:
  ├── Checkout del código
  ├── Configura Node.js 20
  └── Instala dependencias locales (validación)
         │
         ▼
Connexión SSH al VPS (usando secrets: VPS_HOST, VPS_USER, VPS_SSH_KEY)
         │
         ▼
Comandos en el servidor:
  ├── git pull origin main       → Descarga el nuevo código
  ├── npm ci --omit=dev          → Instala deps de producción
  ├── npm run build              → Compila el proyecto
  ├── npx medusa db:migrate      → Aplica migraciones de DB
  └── pm2 restart omnia-backend  → Reinicia el proceso (zero-downtime)
         │
         ▼
✅ Deploy completado en ~2-3 minutos
```

> ⚠️ **Importante**: Si la migración de base de datos falla, PM2 **NO** reinicia el proceso. El deploy se detiene y GitHub Actions marca el job como fallido.

---

## 6. Comandos PM2 para Operación Manual

Conectarse al servidor por SSH y ejecutar:

```bash
# ─── Estado general ──────────────────────────────
# Ver todos los procesos y su estado
pm2 status

# Ver logs en tiempo real del backend
pm2 logs omnia-backend

# Ver los últimos 200 líneas de logs
pm2 logs omnia-backend --lines 200

# ─── Gestión del proceso ─────────────────────────
# Reiniciar el backend (carga el nuevo código si ya se hizo pull)
pm2 restart omnia-backend

# Reiniciar recargando variables de entorno
pm2 restart omnia-backend --update-env

# Detener el backend (sin eliminarlo de PM2)
pm2 stop omnia-backend

# Iniciar el backend si fue detenido
pm2 start omnia-backend

# ─── Iniciar desde cero (si PM2 no tiene el proceso) ─
cd /var/www/omnia-backend
pm2 start npm --name "omnia-backend" -- start
pm2 save

# ─── Guardar configuración de PM2 ────────────────
# Para que PM2 reinicie los procesos automáticamente tras un reboot del servidor
pm2 startup
pm2 save

# ─── Monitoreo ───────────────────────────────────
# Dashboard interactivo de CPU y memoria
pm2 monit
```

---

## Contacto y Soporte

Para incidencias en producción, revisar primero:
1. `pm2 logs omnia-backend` — errores del proceso Node
2. Vercel Logs — errores del storefront Next.js
3. Stripe Dashboard → Webhooks — eventos de pago fallidos
