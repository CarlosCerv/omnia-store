# OMNIA Backend — Manual de Operaciones
Stack Tecnológico: Medusa.js | PostgreSQL | PM2 | Nginx | GitHub Actions
Última actualización: Marzo 2026

---

## Índice de Scripts de Automatización

| Archivo | Función Principal | Entorno de Ejecución |
|:--|:--|:--|
| `scripts/setup-local.sh` | Inicialización del entorno de desarrollo | Equipo Local |
| `scripts/setup-server.sh` | Aprovisionamiento de infraestructura Ubuntu | Servidor de Producción (root) |
| `scripts/deploy.sh` | Secuencia de despliegue manual de emergencia | Servidor de Producción |

Nota: Para otorgar permisos de ejecución utilice `chmod +x scripts/*.sh`.

---

## 1. Configuración de Entorno Local

```bash
# Iniciar clonado del repositorio
git clone https://github.com/[ORGANIZACION]/omnia-backend.git
cd omnia-backend

# Ejecutar script de automatización de entorno
chmod +x scripts/setup-local.sh
bash scripts/setup-local.sh
```

El script de configuración automatiza las siguientes tareas:
1. Validación de dependencias base (Node.js 20+ y PostgreSQL).
2. Instalación de paquetes NPM.
3. Generación de entorno local (`.env`) a partir de plantilla.
4. Creación de base de datos relacional `omnia_medusa`.
5. Ejecución de migraciones de esquema de Medusa.js.
6. Aprovisionamiento de credenciales de administrador.

Para iniciar el servidor de desarrollo:
```bash
npm run dev
# API Endpoint: http://localhost:9000
# Panel Administrativo: http://localhost:9000/app
```

---

## 2. Aprovisionamiento de Servidor (Producción)

Requisito previo: Servidor virtual corriendo Ubuntu 22.04 LTS con privilegios de root (sudo).

```bash
# Transferir archivo de aprovisionamiento al servidor
scp scripts/setup-server.sh ubuntu@IP_SERVIDOR:/tmp/

# Iniciar secuencia de configuración remota
ssh ubuntu@IP_SERVIDOR
sudo bash /tmp/setup-server.sh
```

El script ejecutará las siguientes instalaciones y configuraciones:
- Instalación de Node.js v20 mediante repositorio NodeSource.
- Instalación global de PM2 para gestión de procesos en segundo plano.
- Instalación y securización de PostgreSQL.
- Configuración de Nginx como proxy inverso hacia el puerto 9000.
- Generación y vinculación de certificados SSL vía Certbot (Let's Encrypt).
- Generación de claves criptográficas y configuración del archivo `.env` de producción.

Post-configuración, es imperativo establecer las variables externas:
```bash
sudo nano /var/www/omnia-backend/.env
# Inserte valores para RESEND_API_KEY, STRIPE_SECRET_KEY, etc.
pm2 restart omnia-backend --update-env
```

---

## 3. Gestión de Catálogo de Productos

Para dar de alta nuevos productos en el sistema, siga este flujo operativo:

1. Autentíquese en el panel administrativo: `https://backend.dominio.com/app`
2. Navegue a la sección **Products** y seleccione **New Product**.
3. Complete los metadatos requeridos:
   - `Title`: Ejemplo `Omnia Signature Black`
   - `Description`: Redacción editorial de producto.
   - `Collection`: Selección de categoría aplicable.
4. En la sección **Variants**, agregue variantes considerando la matriz de opciones (Talla y Color).
5. Asigne el precio en moneda local (MXN) a cada variante.
6. Aprovisione la galería fotográfica en la sección **Media**.
7. Guarde y cambie el estado a **Published** para propagación inmediata a la API del Storefront.

---

## 4. Control de Inventario

La plataforma opera bajo el supuesto de control de existencias a nivel de variante SKU (ej. Talla M + Color Onix).

- Navegue a **Products -> [Seleccionar Producto] -> Variants**.
- Modifique los valores en el campo estructural `Inventory`.
- La plataforma transaccionará existencias automáticamente tras confirmaciones de pago reales o transferencias liquidadas.
- Variantes con inventario cero se abstraen automáticamente en la interfaz como "Agotado".

---

## 5. Pipeline de Despliegue Continuo (CI/CD)

Flujo de integración y distribución orquestado por GitHub Actions:

```text
git push origin main
       │
       ▼
GitHub Actions (deploy-backend.yml)
  ├── 1. Checkout del código fuente
  ├── 2. Configuración de runtime Node.js 20
  └── 3. Ejecución SSH en Servidor Remoto
        ├── git pull origin main
        ├── npm ci --omit=dev
        ├── npm run build
        ├── npx medusa db:migrate
        └── pm2 restart omnia-backend
```

En caso de fallo sistemático del pipeline, se recurre a la ejecución manual:
```bash
ssh ubuntu@IP_SERVIDOR
cd /var/www/omnia-backend
bash scripts/deploy.sh

# Para obviar fase de migraciones de base de datos:
bash scripts/deploy.sh --skip-migrations
```

---

## 6. Referencia Operativa PM2

Comandos para la monitorización y gestión del proceso principal Node.js:

```bash
pm2 status                        # Visualización del estado de procesos activos
pm2 logs omnia-backend            # Transmisión de registros stdout/stderr
pm2 restart omnia-backend         # Reinicio en caliente del proceso
pm2 restart omnia-backend --update-env  # Reinicio inyectando los últimos valores .env
pm2 stop omnia-backend            # Detención controlada del hilo
pm2 monit                         # Métricas de consumo CPU/RAM en la terminal
```

---

## 7. Diccionario de Variables de Entorno (Servidor)

Matriz de configuración del entorno productivo:

| Variable Clave | Función Principal | Carácter |
|:--|:--|:--|
| `DATABASE_URL` | Cadena de conexión PostgreSQL (formato DSN) | Requerida |
| `JWT_SECRET` | Clave simétrica para firma de tokens JSON Web | Requerida |
| `COOKIE_SECRET` | Clave generadora para firmas de sesión | Requerida |
| `STORE_CORS` | Origen Cross-Origin autorizado (Storefront) | Requerida |
| `ADMIN_CORS` | Origen Cross-Origin autorizado (Panel Administrativo) | Requerida |
| `RESEND_API_KEY` | Clave API de la plataforma de comunicaciones | Correos |

---

## 8. Gestión de Secretos de Repositorio

Para habilitar la pipeline de GitHub Actions, defina los siguientes valores en `Settings -> Secrets -> Actions`:

| Secreto de Infraestructura | Definición de Valor |
|:--|:--|
| `VPS_HOST` | Dirección IPv4 pública o FQDN del servidor destino |
| `VPS_USER` | Identidad del usuario remoto (habitualmente `ubuntu` o `root`) |
| `VPS_SSH_KEY` | Contenido de la clave criptográfica privada ED25519 o RSA |

Instrucciones para aprovisionamiento seguro de claves de despliegue:
```bash
# Entorno local del administrador
ssh-keygen -t ed25519 -C "github-actions-omnia" -f ~/.ssh/omnia_deploy_key -N ""

# Inserción de huella pública en el servidor
ssh-copy-id -i ~/.ssh/omnia_deploy_key.pub ubuntu@IP_SERVIDOR

# El output del siguiente comando debe ser copiado como VPS_SSH_KEY
cat ~/.ssh/omnia_deploy_key
```
