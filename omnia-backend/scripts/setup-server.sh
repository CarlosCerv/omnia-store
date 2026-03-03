#!/usr/bin/env bash
# =============================================================================
# OMNIA Backend — Script de Setup en Servidor VPS (Ubuntu 22.04)
# Ejecutar como root o con sudo en el servidor:
#   bash scripts/setup-server.sh
#
# Instala: Node.js 20, PM2, PostgreSQL, Nginx (reverse proxy), certbot (SSL)
# =============================================================================

set -euo pipefail

# ─── Colores ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

log()     { echo -e "${BLUE}[OMNIA]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# Verificar que se ejecuta como root o con sudo
if [ "$EUID" -ne 0 ]; then
    error "Ejecuta este script con sudo: sudo bash scripts/setup-server.sh"
fi

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   OMNIA Backend — Setup VPS (Ubuntu)         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ─── 1. Configuración base ────────────────────────────────────────────────────
APP_DIR="/var/www/omnia-backend"
APP_USER="ubuntu"   # Cambiar si usas otro usuario en tu VPS

read -p "¿Usuario del sistema para ejecutar el app? [ubuntu]: " INPUT_USER
APP_USER=${INPUT_USER:-ubuntu}

read -p "¿Dominio del backend? (ej: api.omnia.com o IP): " DOMAIN
DOMAIN=${DOMAIN:-localhost}

read -p "¿Nombre de la DB de Medusa? [omnia_medusa]: " DB_NAME
DB_NAME=${DB_NAME:-omnia_medusa}

read -p "¿URL del repositorio Git? " GIT_REPO

# ─── 2. Actualizar sistema ────────────────────────────────────────────────────
log "Actualizando paquetes del sistema..."
apt-get update -qq && apt-get upgrade -y -qq
success "Sistema actualizado"

# ─── 3. Instalar Node.js 20 via NodeSource ────────────────────────────────────
log "Instalando Node.js 20..."
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" -lt 20 ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
success "Node.js $(node -v) instalado"

# ─── 4. Instalar PM2 globalmente ──────────────────────────────────────────────
log "Instalando PM2..."
npm install -g pm2
success "PM2 $(pm2 -v) instalado"

# ─── 5. Instalar PostgreSQL ───────────────────────────────────────────────────
log "Instalando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    apt-get install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
fi
success "PostgreSQL instalado y activo"

# ─── 6. Crear base de datos y usuario de Postgres ────────────────────────────
log "Configurando base de datos..."
DB_USER="omnia_user"
DB_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)

# Crear usuario y base de datos si no existen
sudo -u postgres psql <<EOF
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  END IF;
END \$\$;

SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}' \gset
\if :ROW_COUNT
  \echo 'Database already exists'
\else
  CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
\endif
EOF

success "Base de datos '${DB_NAME}' con usuario '${DB_USER}' lista"

# Guardar DATABASE_URL para usarla luego
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
echo ""
warn "DATABASE_URL generada (guárdala en tu .env):"
echo "  ${DATABASE_URL}"
echo ""

# ─── 7. Instalar Nginx ────────────────────────────────────────────────────────
log "Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
fi

# Configurar Nginx como reverse proxy para Medusa
NGINX_CONF="/etc/nginx/sites-available/omnia-backend"
cat > "$NGINX_CONF" <<NGINX
server {
    listen 80;
    server_name ${DOMAIN};

    # Tamaño máximo para uploads de imágenes de productos
    client_max_body_size 50M;

    # Medusa backend
    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 120s;
    }
}
NGINX

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/omnia-backend
nginx -t && systemctl reload nginx
success "Nginx configurado como reverse proxy en puerto 80"

# ─── 8. Clonar el repositorio ─────────────────────────────────────────────────
log "Clonando repositorio en ${APP_DIR}..."
mkdir -p "$APP_DIR"
chown "$APP_USER":"$APP_USER" "$APP_DIR"

if [ -d "${APP_DIR}/.git" ]; then
    log "Repositorio ya existe — haciendo pull..."
    sudo -u "$APP_USER" git -C "$APP_DIR" pull origin main
else
    sudo -u "$APP_USER" git clone "$GIT_REPO" "$APP_DIR"
fi
success "Repositorio clonado en ${APP_DIR}"

# ─── 9. Instalar dependencias del proyecto ────────────────────────────────────
log "Instalando dependencias npm..."
cd "$APP_DIR"
sudo -u "$APP_USER" npm ci --omit=dev
success "Dependencias instaladas"

# ─── 10. Crear archivo .env en el servidor ────────────────────────────────────
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)

ENV_FILE="${APP_DIR}/.env"
if [ ! -f "$ENV_FILE" ]; then
    log "Creando .env en el servidor..."
    cat > "$ENV_FILE" <<ENV
DATABASE_URL=${DATABASE_URL}
JWT_SECRET=${JWT_SECRET}
COOKIE_SECRET=${COOKIE_SECRET}
NODE_ENV=production
PORT=9000
STORE_CORS=https://omnia-store-seven.vercel.app
ADMIN_CORS=https://${DOMAIN}
ENV
    chown "$APP_USER":"$APP_USER" "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    success ".env creado con secrets generados automáticamente"
    warn "Agrega tus claves Stripe y Resend manualmente al .env del servidor"
else
    warn ".env ya existe — no se sobreescribió"
fi

# ─── 11. Correr migraciones ───────────────────────────────────────────────────
log "Corriendo migraciones de Medusa..."
cd "$APP_DIR"
sudo -u "$APP_USER" npx medusa db:migrate
success "Migraciones aplicadas"

# ─── 12. Iniciar con PM2 ─────────────────────────────────────────────────────
log "Iniciando el backend con PM2..."
sudo -u "$APP_USER" pm2 start npm --name "omnia-backend" -- start
sudo -u "$APP_USER" pm2 save

# Configurar PM2 para auto-arrancar al reboot
env PATH=$PATH:/usr/bin pm2 startup systemd -u "$APP_USER" --hp "/home/${APP_USER}"
success "PM2 configurado para reinicio automático"

# ─── 13. Certbot SSL (si hay dominio real) ────────────────────────────────────
if [ "$DOMAIN" != "localhost" ]; then
    log "Instalando Certbot (SSL/HTTPS)..."
    apt-get install -y certbot python3-certbot-nginx
    read -p "¿Email para alertas SSL (Let's Encrypt)?: " SSL_EMAIL
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$SSL_EMAIL" && \
        success "SSL configurado en https://${DOMAIN}" || \
        warn "SSL falló — puedes ejecutarlo manualmente: certbot --nginx -d ${DOMAIN}"
fi

# ─── Resumen Final ────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   ✅  Setup del Servidor Completado!         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  Backend corriendo en:  http://${DOMAIN}"
echo "  Admin panel:           http://${DOMAIN}/app"
echo "  PM2 Status:            pm2 status"
echo ""
echo "  DATABASE_URL: ${DATABASE_URL}"
echo ""
warn "Guarda la DATABASE_URL y las secrets generadas en un lugar seguro."
warn "Agrega STRIPE_API_KEY y RESEND_API_KEY al .env del servidor."
echo ""
