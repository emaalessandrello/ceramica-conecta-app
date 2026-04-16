# 🚀 CREAR REPOSITORIO EN GITHUB - INSTRUCCIONES PASO A PASO

**Objetivo:** Subir el proyecto a GitHub para que tengas versión control + memoria centralizada

---

## PASO 1: Crear repositorio en GitHub.com

### 1.1 Abrir GitHub en navegador
```
https://github.com/new
```

### 1.2 Rellenar formulario:
```
Repository name: ceramica-conecta-app
Description: Sistema de gestión comercial para distribuidora de cerámica
Visibility: Public
Initialize repository: NO (sin README, .gitignore, license)
```

### 1.3 Click "Create repository"

**Resultado:** Te aparece pantalla con comandos para subir código.

---

## PASO 2: Preparar carpeta local

### 2.1 Crear carpeta del proyecto
```bash
mkdir ceramica-conecta-app
cd ceramica-conecta-app
```

### 2.2 Copiar archivos generados

**De los 5 documentos generados, copia esto:**

```
ceramica-conecta-app/
├── docs/
│   ├── 01_ARQUITECTURA_GENERAL.md
│   ├── 02_MODELO_DE_DATOS.md
│   ├── 03_API_ENDPOINTS.md
│   ├── 04_GUIA_INICIO_RAPIDO.md
│   └── 05_FLUJOS_SIMPLIFICADOS.md
├── .gitignore (archivo)
├── ONBOARDING_CERAMICA_CONECTA.md (el que generé antes)
└── README.md
```

### 2.3 Crear carpeta backend
```bash
mkdir backend
cd backend

# Crear carpeta src
mkdir src
mkdir prisma

# Copiar estos archivos al backend/:
# - package.json (renombra de backend_package.json)
# - .env.example (renombra de backend_env_example)
# - prisma/schema.prisma (renombra de prisma_schema.prisma)

# Crear archivo vacío para index.js (lo escribiremos después)
touch src/index.js

cd ..
```

### 2.4 Crear carpeta frontend
```bash
mkdir frontend

# Crear estructura básica (por ahora vacía)
cd frontend
mkdir src
touch package.json
touch .env.example
touch vite.config.js

cd ..
```

**Estructura final antes de subir:**
```
ceramica-conecta-app/
├── docs/
│   ├── 01_ARQUITECTURA_GENERAL.md
│   ├── 02_MODELO_DE_DATOS.md
│   ├── 03_API_ENDPOINTS.md
│   ├── 04_GUIA_INICIO_RAPIDO.md
│   └── 05_FLUJOS_SIMPLIFICADOS.md
├── backend/
│   ├── src/
│   │   └── index.js (vacío por ahora)
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── vite.config.js
├── .gitignore
├── ONBOARDING_CERAMICA_CONECTA.md
└── README.md
```

---

## PASO 3: Inicializar Git y subir a GitHub

### 3.1 En terminal (dentro de ceramica-conecta-app):
```bash
# Inicializar git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "chore: initial project structure"

# Agregar origin (reemplaza TU_USERNAME)
git remote add origin https://github.com/emaalessandrello/ceramica-conecta-app.git

# Cambiar rama a main (importante)
git branch -M main

# Subir al repositorio
git push -u origin main
```

### 3.2 Verificar en GitHub
```
Ir a: https://github.com/emaalessandrello/ceramica-conecta-app
```

**Deberías ver:**
- ✅ Los 5 documentos en `/docs`
- ✅ Carpeta `/backend` con structure
- ✅ Carpeta `/frontend` con structure
- ✅ README.md visible
- ✅ .gitignore
- ✅ ONBOARDING_CERAMICA_CONECTA.md

---

## PASO 4: Setup local después de subir

### 4.1 Clonar desde GitHub (para verificar)
```bash
cd ~/Proyectos
git clone https://github.com/emaalessandrello/ceramica-conecta-app.git
cd ceramica-conecta-app
```

### 4.2 Setup del backend (primero)
```bash
cd backend

# Copiar .env
cp .env.example .env

# Editar .env con tus valores
# vim .env
# o abrirlo en VS Code

# Instalar dependencias
npm install

# Crear DB y migraciones
npx prisma migrate dev --name init

# Probar que funciona
npm run dev
```

**Resultado esperado:**
```
Server running on http://localhost:3000
Connected to database successfully
```

### 4.3 Setup del frontend (en otra terminal)
```bash
cd frontend
cp .env.example .env.local

# Editar .env.local con:
# VITE_API_URL=http://localhost:3000/api/v1

npm install
npm run dev
```

**Resultado esperado:**
```
VITE v4.x.x ready in xxx ms
➜  Local: http://localhost:5173/
```

---

## PASO 5: Flujo de trabajo diario

### Cuando hagas cambios:

```bash
# Ver qué cambió
git status

# Agregar cambios
git add .

# Commit con mensaje claro
git commit -m "feat: agregar endpoint de precios"

# Subir a GitHub
git push origin main
```

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### "fatal: not a git repository"
**Solución:** Asegurate de estar en la carpeta `ceramica-conecta-app`:
```bash
cd ceramica-conecta-app
git status
```

### "fatal: The current branch main does not have any upstream tracking information"
**Solución:** Ya la solucionamos con `git push -u origin main`

### "Please tell me who you are" (Git error)
**Solución:** Configurar Git:
```bash
git config --global user.email "tu@email.com"
git config --global user.name "Tu Nombre"
```

### "npm: command not found"
**Solución:** Node.js no está instalado. Descargar desde nodejs.org

---

## 📊 DESPUÉS DE SUBIR A GITHUB

Una vez que tengas todo en GitHub:

1. **Carga los documentos en Cowork:**
   - Abre Cowork en Claude
   - En el proyecto "Cerámica Conecta"
   - Importa o copia/pega los 5 documentos

2. **Fija el link del repo:**
   - En Cowork, documenta: https://github.com/emaalessandrello/ceramica-conecta-app

3. **Estás listo para empezar a desarrollar**

---

## ✅ CHECKLIST FINAL

- [ ] Repositorio creado en GitHub
- [ ] Archivos subidos
- [ ] Se puede clonar correctamente
- [ ] Backend setup local funciona
- [ ] Frontend setup local funciona
- [ ] Documentación en Cowork
- [ ] Primer commit hecho

**¡Una vez hecho todo esto, estás 100% listo para desarrollar!**

---

**Próximo paso:** Empezar a escribir código del backend (controllers, routes, servicios)
