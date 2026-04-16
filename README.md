# 🎨 Cerámica Conecta - Sistema de Gestión Comercial

**Distribuidora de insumos cerámicos | App de gestión de precios y márgenes**

---

## 📋 Tabla de Contenidos

- [Visión](#visión)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Estructura](#estructura)
- [Documentación](#documentación)
- [Contribuidores](#contribuidores)

---

## 🎯 Visión

**Problema:** Gestionar precios de 7 competidores (copiar/pegar manual) + calcular márgenes = tarea semanal tediosa, propensa a errores.

**Solución:** App unificada que:
- ✅ Centraliza cálculo de precios (USD → ARS con IVA, TC)
- ✅ Compara automáticamente con competencia (lado a lado)
- ✅ Permite redefinir precios manualmente si necesitás competir
- ✅ Muestra impacto en margen en tiempo real
- ✅ Genera reportes de rentabilidad

**Objetivo:** Reducir tiempo de gestión de precios de 45-60 min/semana → 15-20 min/semana.

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** + Vite
- **TailwindCSS** para estilos
- **TanStack Query** para sincronización de datos
- **Recharts** para gráficos
- **Deploy:** Vercel

### Backend
- **Node.js** + Express.js
- **PostgreSQL** (Neon serverless)
- **Prisma** ORM
- **JWT** para autenticación
- **Deploy:** Render

### Infrastructure
- **Database:** PostgreSQL en Neon.tech (free tier)
- **File Storage:** Cloudinary (futuro)
- **Hosting:** Vercel (frontend) + Render (backend)

---

## 🚀 Quick Start

### Requisitos
- Node.js v18+
- Git
- PostgreSQL (local o Neon)

### Setup Local (5 minutos)

#### 1. Clonar repositorio
```bash
git clone https://github.com/emaalessandrello/ceramica-conecta-app.git
cd ceramica-conecta-app
```

#### 2. Setup Backend
```bash
cd backend
cp .env.example .env

# Editar .env con tus valores (DATABASE_URL, JWT_SECRET, etc.)

npm install
npx prisma migrate dev --name init
npm run dev
```

El backend corre en `http://localhost:3000`

#### 3. Setup Frontend
```bash
cd ../frontend
cp .env.example .env.local

# Editar .env.local con:
# VITE_API_URL=http://localhost:3000/api/v1

npm install
npm run dev
```

El frontend corre en `http://localhost:5173`

#### 4. Login
- Email: `admin@ceramicaconecta.com`
- Password: `admin123`

**¡Listo!** La app está corriendo localmente.

---

## 📁 Estructura

```
ceramica-conecta-app/
├── backend/
│   ├── src/
│   │   ├── routes/          # Endpoints API
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── services/         # Servicios reutilizables
│   │   ├── middleware/       # Auth, validación
│   │   ├── utils/            # Helpers
│   │   └── index.js          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Definición de BD
│   │   └── seeds.js          # Datos iniciales
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components reutilizables
│   │   ├── pages/            # Páginas principales
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # Llamadas a API
│   │   ├── store/            # Zustand state management
│   │   ├── styles/           # Tailwind config
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── 01_ARQUITECTURA_GENERAL.md
│   ├── 02_MODELO_DE_DATOS.md
│   ├── 03_API_ENDPOINTS.md
│   ├── 04_GUIA_INICIO_RAPIDO.md
│   └── 05_FLUJOS_SIMPLIFICADOS.md
│
├── .gitignore
├── README.md (este archivo)
└── CHANGELOG.md
```

---

## 📚 Documentación

Toda la documentación está en `/docs`:

1. **[01_ARQUITECTURA_GENERAL.md](./docs/01_ARQUITECTURA_GENERAL.md)** — Visión, stack, decisiones
2. **[02_MODELO_DE_DATOS.md](./docs/02_MODELO_DE_DATOS.md)** — Tablas, relaciones, índices
3. **[03_API_ENDPOINTS.md](./docs/03_API_ENDPOINTS.md)** — Todas las rutas con ejemplos
4. **[04_GUIA_INICIO_RAPIDO.md](./docs/04_GUIA_INICIO_RAPIDO.md)** — Setup paso a paso
5. **[05_FLUJOS_SIMPLIFICADOS.md](./docs/05_FLUJOS_SIMPLIFICADOS.md)** — Cómo funciona sin tecnicismos

---

## 🔧 Comandos Útiles

### Backend
```bash
npm run dev              # Inicia server en dev
npm run test            # Ejecuta tests
npm run build           # Build para producción
npx prisma studio      # Abre UI para ver/editar BD
npx prisma db seed    # Carga datos iniciales
```

### Frontend
```bash
npm run dev             # Inicia dev server
npm run build           # Build para producción
npm run preview         # Preview de build
```

### Git
```bash
git add .
git commit -m "feat: descripción"
git push origin main
```

---

## 🚢 Deployment

### Backend → Render
1. Conectar GitHub repo
2. Configurar variables de entorno
3. Deploy automático en cada push a `main`

### Frontend → Vercel
1. Conectar GitHub repo
2. Vercel detecta Vite automáticamente
3. Deploy automático en cada push a `main`

Ver instrucciones detalladas en `[04_GUIA_INICIO_RAPIDO.md](./docs/04_GUIA_INICIO_RAPIDO.md)`.

---

## 👥 Contribuidores

- **Emmanuel Alessandrello** — Frontend + Backend
- **Nahuel** — Feedback + Testing
- **Natalia** — Testing de fraccionamiento

---

## 📝 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para histórico de cambios.

---

## 📞 Soporte

Preguntas o problemas? Abrí un issue en GitHub o contactá a Emmanuel.

---

**Última actualización:** Abril 16, 2026  
**Versión:** 1.0.0 (MVP)  
**Estado:** 🚧 En desarrollo
