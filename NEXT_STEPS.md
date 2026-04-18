# Próximos Pasos — Cerámica Conecta

**Última actualización:** 16 de abril de 2026
**Estado actual:** Repo inicial subido a GitHub. Falta setup de base de datos, backend y frontend.

Este documento es tu guía única para continuar. Seguilo en orden.

---

## 0. Antes de arrancar: rotar el token de GitHub (seguridad)

El token que usamos para el primer push (`ghp_uR8Q...XI37OdYZ`) quedó incrustado en la URL del remote de git **y** apareció en el chat. Aunque todo esto es privado, la práctica correcta es reemplazarlo por uno nuevo.

### Paso 1 — Borrar el token viejo

1. Entrá a: `https://github.com/settings/tokens`
2. Buscá el token `ceramica-conecta-mac` (el que creaste hoy)
3. Click en **"Delete"** → confirmá

### Paso 2 — Crear uno nuevo

1. En la misma página, click **"Generate new token"** → **"Generate new token (classic)"**
2. Completá:
   - **Note:** `ceramica-conecta-mac-v2`
   - **Expiration:** `90 days` (o el que prefieras)
   - **Select scopes:** marcá la casilla **`repo`** (la primera)
3. Click **"Generate token"** (botón verde al final)
4. **Copiá el token completo** (`ghp_...`). Vas a verlo una sola vez.

### Paso 3 — Reemplazar el token en el remote local

En terminal, parado en la carpeta `ceramica-conecta-app`:

```bash
cd ~/Desktop/ceramica-conecta-app
git remote set-url origin https://TU_NUEVO_TOKEN@github.com/emaalessandrello/ceramica-conecta-app.git
```

Reemplazá `TU_NUEVO_TOKEN` por el token real. **No lo pegues en ningún chat.**

### Paso 4 — Verificar que funciona

```bash
git remote -v
git pull origin main
```

Si `git pull` funciona sin pedir credenciales, quedó perfecto.

---

## 1. Decidir: base de datos en la nube (Neon) o local (PostgreSQL en tu Mac)

**Recomendación:** Neon. Es 5 minutos de setup, gratis hasta 0.5 GB, y no tenés que mantener nada en tu Mac.

### Opción A — Neon (recomendado)

1. Entrá a `https://neon.tech` → **"Sign up with GitHub"**
2. Te lleva al dashboard. Click **"Create Project"**
3. Completá:
   - **Project name:** `ceramica-conecta`
   - **Database name:** `ceramica_conecta` (con guión bajo, no guión)
   - **Region:** la más cercana. Buenos Aires recomiendo **US East (N. Virginia)** o **South America (São Paulo)** si está disponible.
   - **Postgres version:** la más reciente (16 o 17 da igual)
4. Click **"Create Project"**
5. En el panel siguiente, buscá la sección **"Connection string"** y copiá la URL completa. Se ve así:
   ```
   postgresql://neondb_owner:xxxxxxxxxxxxxxxxxxxxxxxxxx@ep-cool-firefly-a1b2c3d4.us-east-2.aws.neon.tech/ceramica_conecta?sslmode=require
   ```
6. Guardala en Notas por ahora — la vas a usar en el siguiente paso.

### Opción B — PostgreSQL local

Si preferís Postgres local en tu Mac:

```bash
# Instalar Homebrew si no lo tenés
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Postgres
brew install postgresql@16
brew services start postgresql@16

# Crear la base de datos
createdb ceramica_conecta

# Tu DATABASE_URL queda:
# postgresql://emanuelalessandrello@localhost:5432/ceramica_conecta
```

---

## 2. Configurar el `.env` del backend

Parado en la carpeta del proyecto:

```bash
cd ~/Desktop/ceramica-conecta-app/backend
cp .env.example .env
```

Eso creó el archivo `.env`. Ahora hay que editarlo con tus valores reales.

**Abrir `.env` en un editor** (cualquiera de estas opciones):

```bash
# Con el editor que viene con Mac (nano):
nano .env

# Con TextEdit:
open -e .env

# Con VS Code (si lo tenés instalado):
code .env
```

**Valores a completar:**

```env
# DATABASE_URL — pegá la URL de Neon (o la local)
DATABASE_URL="postgresql://neondb_owner:xxxxx@ep-xxxx.neon.tech/ceramica_conecta?sslmode=require"

# JWT_SECRET — un string random largo (32+ caracteres). Podés generarlo así:
# En terminal aparte: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="c7f3a9b2e8d1f4a6b5c9e2d7f0a3b8c1d4e7f0a3b6c9d2e5f8a1b4c7d0e3f6a9"

JWT_EXPIRES_IN="86400"

PORT=3000
NODE_ENV="development"

INITIAL_EXCHANGE_RATE="1305.0"

CORS_ORIGIN="http://localhost:5173,http://localhost:3000"

LOG_LEVEL="debug"
```

Guardá el archivo (en nano: `Ctrl + O` → Enter → `Ctrl + X`).

**Importante:** `.env` está en `.gitignore`, así que nunca se sube al repo. Es privado de tu máquina.

---

## 3. Setup del backend

```bash
cd ~/Desktop/ceramica-conecta-app/backend

# Instalar dependencias (1-2 min)
npm install

# Generar el cliente de Prisma
npx prisma generate

# Crear las tablas en la BD (con Neon, esto funciona en 10 segundos)
npx prisma migrate dev --name init

# Cargar datos iniciales (usuario admin, formatos, competidores, descuentos)
npx prisma db seed
# Si falla con "Couldn't find a seed config", ejecutá en su lugar:
# node prisma/seed.js

# Levantar el servidor
npm run dev
```

**Resultado esperado:**

```
✅ Server running on http://localhost:3000
📚 API Documentation: http://localhost:3000/api/v1
```

**Verificá que funciona:** abrí `http://localhost:3000/health` en el navegador. Deberías ver:
```json
{"status":"ok","timestamp":"...","version":"1.0.0"}
```

**Dejá esta terminal abierta** con el server corriendo. Abrí otra para el frontend.

---

## 4. Setup del frontend

En una **nueva terminal**:

```bash
cd ~/Desktop/ceramica-conecta-app/frontend

# Copiar .env.local
cp .env.example .env.local

# Instalar dependencias (2-3 min — son muchas)
npm install

# Levantar dev server
npm run dev
```

**Resultado esperado:**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Nota:** El frontend todavía no tiene código de la app (src/ está vacío). Cuando abras `http://localhost:5173/` vas a ver una pantalla en blanco o un 404 de Vite. Eso es esperado — el código de React lo vamos a escribir juntos.

---

## 5. Cuando todo arriba funcione, avisame y arrancamos a escribir código

El próximo milestone es escribir el código de la app. Orden sugerido:

**Backend:**
1. Auth routes (`/api/v1/auth/login`, `/api/v1/auth/logout`)
2. Middleware de JWT para proteger rutas
3. Routes de products (CRUD + bulk-upload)
4. Routes de prices (con recálculo automático)
5. Routes de competitors + competitor-prices
6. Endpoint de comparativas
7. Reportes de márgenes

**Frontend:**
1. Setup base: Tailwind, React Router, Axios + TanStack Query
2. Login page (estilo simple)
3. Layout con sidebar (Dashboard / Productos / Competencia / Reportes)
4. Tabla de productos con filtros
5. Vista comparativa (la feature clave — tu precio vs 7 competidores)
6. Formulario de redefinición de precio con impacto en margen en vivo
7. Página de reportes con Recharts

---

## 6. Troubleshooting rápido

### `npm: command not found`
Node.js no está instalado. Descargar desde `https://nodejs.org` (versión LTS, 20.x).

### `Error: P1001: Can't reach database server`
- Si usás Neon: revisá que la URL tenga `?sslmode=require` al final
- Si usás local: verificá que Postgres esté corriendo (`brew services list`)

### `Error: relation "users" does not exist`
Faltó correr la migración. Ejecutá:
```bash
npx prisma migrate dev --name init
```

### `Port 3000 already in use`
Otro proceso usa el puerto. Dos opciones:
```bash
# Opción 1: cambiar el puerto en .env
PORT=3001

# Opción 2: matar el proceso
lsof -i :3000
kill -9 <PID>
```

### `Cannot find module '@prisma/client'`
Faltó `npm install` o `npx prisma generate`. Ejecutá:
```bash
npm install
npx prisma generate
```

### Prisma dice `Environment variable not found: DATABASE_URL`
El archivo `.env` no existe o está en el lugar equivocado. Tiene que estar en `backend/.env` (no en la raíz del proyecto).

### El seed falla con `Unique constraint failed`
Ya corriste el seed antes. Si querés empezar de cero:
```bash
npx prisma migrate reset
# Te pregunta si querés borrar datos: sí
# Después corre el seed automáticamente
```

---

## 7. Credenciales por defecto (después del seed)

Una vez que corra el seed, el usuario admin queda creado con:

- **Email:** `admin@ceramicaconecta.com`
- **Password:** `admin123`

Vas a usar esas credenciales para el primer login cuando el frontend esté listo.

---

## Resumen: checklist de "vuelta al proyecto"

- [ ] Rotar token viejo → crear nuevo → actualizar remote (`git remote set-url`)
- [ ] Crear cuenta en Neon + proyecto + copiar DATABASE_URL
- [ ] Crear `backend/.env` con valores reales (DATABASE_URL, JWT_SECRET)
- [ ] `cd backend && npm install && npx prisma migrate dev --name init && npx prisma db seed`
- [ ] `npm run dev` — verificar `http://localhost:3000/health` funciona
- [ ] En otra terminal: `cd frontend && cp .env.example .env.local && npm install && npm run dev`
- [ ] Verificar que `http://localhost:5173` carga (aunque sea en blanco)
- [ ] Avisarme: "todo funciona, arranquemos con el código"

Cuando tengas todo esto, vemos el código de la app.
