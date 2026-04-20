#!/usr/bin/env bash
# ============================================================================
# Cerámica Conecta — Script de bootstrap
# ============================================================================
# Uso:
#   chmod +x setup.sh  (solo la primera vez, para hacerlo ejecutable)
#   ./setup.sh
#
# Qué hace:
#   1. Verifica Node.js y npm
#   2. Verifica que backend/.env exista con DATABASE_URL y JWT_SECRET
#   3. Instala dependencias del backend
#   4. Genera cliente Prisma + aplica migraciones + corre seed
#   5. Crea frontend/.env.local si no existe
#   6. Instala dependencias del frontend
#   7. Muestra cómo arrancar ambos servers
# ============================================================================

set -e  # Si cualquier comando falla, abortar el script

# Colores para los mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones helper
log_info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_ok()      { echo -e "${GREEN}✅ $1${NC}"; }
log_warn()    { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error()   { echo -e "${RED}❌ $1${NC}"; }
log_section() { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${BLUE}  $1${NC}"; echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

# Asegurar que estamos en la raíz del repo
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# ============================================================================
# 1. Verificar prerrequisitos
# ============================================================================
log_section "1/6 Verificando prerrequisitos"

if ! command -v node &> /dev/null; then
  log_error "Node.js no está instalado."
  log_info "Instalá Node.js desde https://nodejs.org (descargá el .pkg para macOS)"
  exit 1
fi
log_ok "Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
  log_error "npm no está instalado (debería venir con Node.js)"
  exit 1
fi
log_ok "npm $(npm --version)"

# ============================================================================
# 2. Verificar que backend/.env exista
# ============================================================================
log_section "2/6 Verificando backend/.env"

if [ ! -f "backend/.env" ]; then
  log_error "No existe backend/.env"
  log_info "Hacé esto antes de seguir:"
  echo ""
  echo "  cd backend"
  echo "  cp .env.example .env"
  echo "  nano .env   # editar con tus credenciales reales de Supabase + JWT_SECRET"
  echo ""
  log_info "El .env necesita al menos:"
  echo "  DATABASE_URL=postgresql://...@pooler.supabase.com:6543/postgres"
  echo "  DIRECT_URL=postgresql://...@pooler.supabase.com:5432/postgres"
  echo "  JWT_SECRET=<64 caracteres hex, generalo con:>"
  echo "    node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
  exit 1
fi

# Verificar que las variables críticas estén seteadas
if ! grep -q "^DATABASE_URL=" backend/.env; then
  log_error "backend/.env no tiene DATABASE_URL"
  exit 1
fi
if ! grep -q "^JWT_SECRET=" backend/.env; then
  log_error "backend/.env no tiene JWT_SECRET"
  exit 1
fi
log_ok "backend/.env encontrado con DATABASE_URL y JWT_SECRET"

# ============================================================================
# 3. Instalar deps del backend
# ============================================================================
log_section "3/6 Instalando dependencias del backend"
cd backend
npm install
log_ok "Dependencias del backend instaladas"

# ============================================================================
# 4. Prisma: generate + migrate + seed
# ============================================================================
log_section "4/6 Preparando base de datos (Prisma)"

log_info "Generando Prisma Client..."
npx prisma generate

log_info "Aplicando migraciones..."
# deploy es para prod/setup (no crea migraciones nuevas, solo aplica las existentes)
npx prisma migrate deploy

log_info "Corriendo seed (datos iniciales)..."
npx prisma db seed || log_warn "Seed falló (puede ser que ya existan datos). Continuando."

log_ok "Base de datos lista"
cd ..

# ============================================================================
# 5. Crear frontend/.env.local
# ============================================================================
log_section "5/6 Configurando frontend"

if [ ! -f "frontend/.env.local" ]; then
  cp frontend/.env.example frontend/.env.local
  log_ok "frontend/.env.local creado desde .env.example"
else
  log_ok "frontend/.env.local ya existe (no lo toco)"
fi

# ============================================================================
# 6. Instalar deps del frontend
# ============================================================================
log_section "6/6 Instalando dependencias del frontend"
cd frontend
npm install
log_ok "Dependencias del frontend instaladas"
cd ..

# ============================================================================
# Final: instrucciones para arrancar
# ============================================================================
echo ""
log_section "🎉 Setup completo"
echo ""
echo "Para arrancar la app necesitás 2 terminales:"
echo ""
echo -e "  ${GREEN}Terminal 1 (backend):${NC}"
echo "    cd backend && npm run dev"
echo "    → http://localhost:3000/health"
echo ""
echo -e "  ${GREEN}Terminal 2 (frontend):${NC}"
echo "    cd frontend && npm run dev"
echo "    → http://localhost:5173"
echo ""
echo "Credenciales del admin (del seed):"
echo "  Email:    admin@ceramicaconecta.com"
echo "  Password: admin123"
echo ""
