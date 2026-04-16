# 04 - GUÍA DE INICIO RÁPIDO
## Sistema de Gestión Comercial - Cerámica Conecta

**Fecha:** Abril 16, 2026  
**Versión:** 1.0  
**Objetivo:** Setup local + primer deploy en 1-2 horas

---

## FASE 0: PRE-REQUISITOS

### Instalar en tu máquina:

1. **Node.js** (v18+)
   - Descargar: https://nodejs.org/
   - Verificar: `node --version` en terminal

2. **Git**
   - Descargar: https://git-scm.com/
   - Verificar: `git --version`

3. **PostgreSQL** (local o Neon cloud)
   - Opción A: Descargar PostgreSQL local
   - Opción B: Crear cuenta en Neon.tech (serverless, gratis)

4. **VS Code** (editor recomendado)
   - Descargar: https://code.visualstudio.com/

---

## FASE 1: CLONAR REPOSITORIO (1 min)

```bash
# Abrir terminal en la carpeta donde querés trabajar
cd ~/Proyectos

# Clonar el repo (lo crearemos en GitHub)
git clone https://github.com/tuuser/ceramica-conecta-app.git
cd ceramica-conecta-app

# Ver estructura
ls -la
```

**Estructura esperada:**
```
ceramica-conecta-app/
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── prisma/
│       └── schema.prisma
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── 01_ARQUITECTURA_GENERAL.md
│   ├── 02_MODELO_DE_DATOS.md
│   └── 03_API_ENDPOINTS.md
└── README.md
```

---

## FASE 2: SETUP BACKEND (10 min)

### 2.1 Instalar dependencias
```bash
cd backend
npm install
```

### 2.2 Configurar variables de entorno
```bash
# Copiar template
cp .env.example .env

# Editar .env con tus valores
# Abrir en editor y rellenar:
```

**.env template:**
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ceramica_conecta"

# o si usas Neon:
DATABASE_URL="postgresql://user:password@ep-cool-token.neon.tech/ceramica_conecta"

# JWT Secret
JWT_SECRET="tu_secret_super_seguro_aca"

# Server
PORT=3000
NODE_ENV="development"

# Exchange Rate (inicial)
INITIAL_EXCHANGE_RATE=1305.0
```

### 2.3 Crear base de datos
```bash
# Si usas PostgreSQL local, primero crear DB:
createdb ceramica_conecta

# Si usas Neon, el DB ya existe con DATABASE_URL
```

### 2.4 Ejecutar migraciones de Prisma
```bash
# Esto crea las tablas en la BD
npx prisma migrate dev --name init

# Seed la base de datos (datos iniciales)
npx prisma db seed
```

### 2.5 Verificar que todo funciona
```bash
npm run dev
```

**Resultado esperado:**
```
Server running on http://localhost:3000
Connected to database successfully
```

---

## FASE 3: SETUP FRONTEND (10 min)

### En otra terminal:

```bash
cd ../frontend
npm install
```

### Crear .env.local:
```bash
cp .env.example .env.local
```

**.env.local:**
```
VITE_API_URL="http://localhost:3000/api/v1"
VITE_APP_NAME="Cerámica Conecta"
```

### Iniciar dev server:
```bash
npm run dev
```

**Resultado esperado:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## FASE 4: VERIFICAR QUE FUNCIONA (5 min)

### 4.1 Abrir en navegador:
```
http://localhost:5173/
```

Deberías ver la pantalla de login.

### 4.2 Credenciales por defecto (seed data):
```
Email: admin@ceramicaconecta.com
Password: admin123
```

### 4.3 Si todo funciona:
- ✅ Frontend carga
- ✅ Login funciona
- ✅ Ves la tabla de productos

---

## FASE 5: PRIMER DEPLOYMENT (20 min)

### Backend → Render

1. **Crear cuenta en Render.com** (gratis)
2. **Conectar GitHub:**
   - Link tu repo
   - Render detecta `backend/` automáticamente
3. **Configurar variables:**
   - DATABASE_URL → Neon
   - JWT_SECRET → Tu secret
   - PORT → 3000
4. **Deploy:**
   - Render hace deploy automático al pushear a main

**URL del backend:** `https://ceramica-conecta-api.onrender.com`

### Frontend → Vercel

1. **Crear cuenta en Vercel.com** (gratis)
2. **Conectar GitHub:**
   - Vercel detecta `frontend/` como proyecto Vite
3. **Configurar variables:**
   - VITE_API_URL → Tu URL de Render
4. **Deploy:**
   - Vercel hace deploy automático

**URL del frontend:** `https://ceramica-conecta.vercel.app`

---

## FASE 6: WORKFLOW DIARIO

### Cuando hagas cambios:

```bash
# Backend (en carpeta /backend)
npm run dev          # Mientras desarrollas
npm run test         # Antes de pushear
git add .
git commit -m "feat: nueva feature"
git push origin main # Render redeploya automáticamente

# Frontend (en carpeta /frontend)
npm run dev          # Mientras desarrollas
npm run build        # Verificar que compila
git add .
git commit -m "feat: nueva UI"
git push origin main # Vercel redeploya automáticamente
```

---

## COMANDOS ÚTILES

### Backend:
```bash
npm run dev              # Inicia server en dev mode
npm run test            # Ejecuta tests
npm run build           # Build para producción
npx prisma studio      # Abre UI para ver/editar DB
npx prisma migrate dev # Crea nueva migración
npx prisma db seed    # Ejecuta seeds
```

### Frontend:
```bash
npm run dev             # Inicia dev server
npm run build           # Build para producción
npm run preview         # Preview de producción local
npm run lint            # Verifica código
```

### General:
```bash
git log --oneline       # Ver histórico de commits
git status              # Ver cambios pendientes
git branch -a           # Ver ramas
```

---

## TROUBLESHOOTING

### "Command not found: node"
**Solución:** Node.js no está instalado. Descargar desde nodejs.org

### "Error: cannot connect to database"
**Solución:** 
- Verificar que PostgreSQL está corriendo
- Verificar DATABASE_URL en .env
- Si usas Neon, copiar URL correcta

### "PORT 3000 already in use"
**Solución:**
```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso que usa 3000
# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### "VITE_API_URL is undefined"
**Solución:**
- Crear archivo `.env.local` en `/frontend`
- Agregar `VITE_API_URL=http://localhost:3000/api/v1`

### "Prisma migration error"
**Solución:**
```bash
# Reset base de datos (pierde datos)
npx prisma migrate reset

# O resetear y reiniciar:
npx prisma db push
npx prisma db seed
```

---

## PRÓXIMO PASO

→ Ir a **05_FLUJOS_SIMPLIFICADOS.md**  
  (Las 3 operaciones más importantes explicadas simple)
