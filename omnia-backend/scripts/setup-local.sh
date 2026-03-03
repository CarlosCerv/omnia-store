#!/usr/bin/env bash
# =============================================================================
# OMNIA Backend — Script de Inicialización Local
# Ejecutar: bash scripts/setup-local.sh
# Pre-requisitos: Node.js 20+, PostgreSQL corriendo localmente
# =============================================================================

set -euo pipefail  # Detener en cualquier error

# ─── Colores ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

log()     { echo -e "${BLUE}[OMNIA]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   OMNIA Backend — Setup Local                ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ─── 1. Verificar Node.js ─────────────────────────────────────────────────────
log "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado. Instala Node.js 20+ desde https://nodejs.org"
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    error "Node.js 20+ requerido. Versión actual: $(node -v)"
fi
success "Node.js $(node -v) detectado"

# ─── 2. Verificar PostgreSQL ──────────────────────────────────────────────────
log "Verificando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    warn "psql no encontrado en PATH. Asegúrate de que PostgreSQL esté corriendo."
else
    success "PostgreSQL detectado"
fi

# ─── 3. Inicializar el proyecto Medusa (si no existe ya) ─────────────────────
if [ ! -f "package.json" ]; then
    log "Inicializando proyecto Medusa.js..."
    npx create-medusa-app@latest . --no-browser --skip-db
    success "Proyecto Medusa inicializado"
else
    log "package.json encontrado — saltando inicialización de Medusa"
fi

# ─── 4. Instalar dependencias ─────────────────────────────────────────────────
log "Instalando dependencias npm..."
npm install
success "Dependencias instaladas"

# ─── 5. Configurar variables de entorno ───────────────────────────────────────
if [ ! -f ".env" ]; then
    log "Creando archivo .env desde template..."
    cp .env.template .env
    warn "Archivo .env creado. Edítalo con tus credenciales reales antes de continuar."
    warn "Especialmente: DATABASE_URL, JWT_SECRET y COOKIE_SECRET"
    echo ""
    echo "  Edita: nano .env  (o con tu editor preferido)"
    echo ""
    read -p "  Presiona ENTER cuando hayas configurado el .env para continuar..."
else
    log ".env ya existe — saltando"
fi

# ─── 6. Crear base de datos (si psql está disponible) ────────────────────────
if command -v psql &> /dev/null; then
    log "Creando base de datos 'omnia_medusa' si no existe..."
    DB_NAME=$(grep DATABASE_URL .env | cut -d'/' -f4 | cut -d'?' -f1)
    DB_NAME=${DB_NAME:-omnia_medusa}
    psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
        psql -U postgres -c "CREATE DATABASE ${DB_NAME};" && \
        success "Base de datos '${DB_NAME}' lista" || \
        warn "No se pudo crear la DB automáticamente. Créala manualmente: CREATE DATABASE ${DB_NAME};"
fi

# ─── 7. Correr migraciones ────────────────────────────────────────────────────
log "Corriendo migraciones de base de datos..."
if npx medusa db:migrate; then
    success "Migraciones aplicadas"
else
    error "Falló la migración. Verifica DATABASE_URL en .env"
fi

# ─── 8. Crear usuario administrador ──────────────────────────────────────────
echo ""
log "Crear usuario administrador de Medusa"
read -p "  Email del admin [admin@omnia.com]: " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@omnia.com}
read -s -p "  Password (mín. 8 caracteres): " ADMIN_PASS
echo ""

if npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASS"; then
    success "Usuario administrador creado: ${ADMIN_EMAIL}"
else
    warn "El usuario puede ya existir — puedes ignorar este error"
fi

# ─── 9. Resumen final ─────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   ✅  Setup Local Completado!                ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  Iniciar servidor de desarrollo:"
echo "    npm run dev"
echo ""
echo "  Panel de administración:"
echo "    http://localhost:9000/app"
echo ""
echo "  API (store):"
echo "    http://localhost:9000/store"
echo ""
