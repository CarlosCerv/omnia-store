#!/usr/bin/env bash
# =============================================================================
# OMNIA Backend — Deploy Manual
# Ejecutar en el SERVIDOR después de un push que GitHub Actions no procesó,
# o para forzar un redeploy sin esperar al pipeline.
#
# Uso:  bash scripts/deploy.sh [--skip-migrations]
# =============================================================================

set -euo pipefail

# ─── Colores ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

log()     { echo -e "${BLUE}[OMNIA]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }

APP_DIR="${APP_DIR:-/var/www/omnia-backend}"
SKIP_MIGRATIONS=false

for arg in "$@"; do
  [ "$arg" = "--skip-migrations" ] && SKIP_MIGRATIONS=true
done

START_TIME=$(date +%s)
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   OMNIA Backend — Deploy Manual              ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

cd "$APP_DIR"

# ─── 1. Git pull ──────────────────────────────────────────────────────────────
log "Descargando último código de main..."
git fetch origin main
git checkout main
git pull origin main
COMMIT=$(git log -1 --format="%h — %s" --no-color)
success "Código actualizado: ${COMMIT}"

# ─── 2. Instalar dependencias ─────────────────────────────────────────────────
log "Instalando dependencias..."
npm ci --omit=dev
success "Dependencias instaladas"

# ─── 3. Build ─────────────────────────────────────────────────────────────────
log "Compilando el proyecto..."
npm run build
success "Build completado"

# ─── 4. Migraciones ───────────────────────────────────────────────────────────
if [ "$SKIP_MIGRATIONS" = false ]; then
    log "Corriendo migraciones de base de datos..."
    npx medusa db:migrate
    success "Migraciones aplicadas"
else
    warn "Migraciones omitidas (--skip-migrations)"
fi

# ─── 5. Reiniciar PM2 ─────────────────────────────────────────────────────────
log "Reiniciando proceso PM2..."
if pm2 describe omnia-backend > /dev/null 2>&1; then
    pm2 restart omnia-backend --update-env
else
    pm2 start npm --name "omnia-backend" -- start
fi
pm2 save
success "PM2 reiniciado"

# ─── 6. Health check ──────────────────────────────────────────────────────────
log "Verificando que el servidor responde..."
sleep 3
if curl -sf http://localhost:9000/health > /dev/null 2>&1; then
    success "Health check OK — servidor respondiendo"
else
    warn "El servidor aún no responde. Revisa: pm2 logs omnia-backend"
fi

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   ✅  Deploy Completado en ${ELAPSED}s            ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  pm2 status        → Ver estado del proceso"
echo "  pm2 logs          → Ver logs en tiempo real"
echo ""
