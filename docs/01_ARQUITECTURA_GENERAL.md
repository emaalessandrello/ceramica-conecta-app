# 01 - ARQUITECTURA GENERAL
## Sistema de Gestión Comercial - Cerámica Conecta

**Fecha:** Abril 16, 2026  
**Versión:** 1.0  
**Estado:** Fase de Diseño

---

## 1. VISIÓN DEL PROYECTO

**Problema:** Gestionar precios de 7 competidores (copiar/pegar manual) + calcular márgenes = tarea semanal tediosa, propensa a errores.

**Solución:** App unificada (web) que:
- Centraliza cálculo de precios (USD → ARS con IVA, TC, descuentos)
- Compara automáticamente con competencia (lado a lado)
- Permite redefinir precios manualmente si necesitás competir
- Muestra impacto en margen en tiempo real
- Genera reportes de rentabilidad

**Objetivo:** Reducir tiempo de gestión de precios de 45-60 min/semana a 15-20 min/semana.

---

## 2. STACK TECNOLÓGICO

### Frontend
- **Framework:** React 18+
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query) + Zustand
- **Charts:** Recharts (gráficos de márgenes, tendencias)
- **Tablas:** TanStack Table (React Table) - filtros, sort, export
- **Deploy:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **API Style:** REST (JSON)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT (simple, sin OAuth por ahora)
- **Deploy:** Render o Railway

### Infrastructure
- **DB Hosting:** Neon (PostgreSQL serverless)
- **File Storage:** Cloudinary (para imágenes de productos, si futuro)
- **Emails:** Resend (para reportes semanales, si futuro)

### Dev Tools
- **Version Control:** Git + GitHub
- **Docs:** Esta arquitectura en Cowork
- **Testing:** Jest + Supertest (backend), Vitest + React Testing Library (frontend)

---

## 3. COMPONENTES PRINCIPALES

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │Dashboard │  │Comparativa│  │Reportes │           │
│  │Precios   │  │Competencia│  │Márgenes │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│       ↓              ↓              ↓                 │
│  ┌─────────────────────────────────────┐            │
│  │   TanStack Query (Data Sync)        │            │
│  └─────────────────────────────────────┘            │
│       ↓              ↓              ↓                 │
└─────────────────────────────────────────────────────┘
                      ↓ HTTP/JSON
┌─────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                 │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐           │
│  │        REST API (Express.js)         │           │
│  │  /api/products                       │           │
│  │  /api/prices                         │           │
│  │  /api/competitors                    │           │
│  │  /api/margins                        │           │
│  └──────────────────────────────────────┘           │
│       ↓              ↓              ↓                 │
│  ┌─────────────────────────────────────┐            │
│  │    Business Logic + Calculations    │            │
│  │  - USD → ARS conversion             │            │
│  │  - Margin calculation               │            │
│  │  - Volume discount application      │            │
│  └─────────────────────────────────────┘            │
│       ↓              ↓              ↓                 │
│  ┌─────────────────────────────────────┐            │
│  │    Database Layer (Prisma ORM)      │            │
│  └─────────────────────────────────────┘            │
│       ↓                                              │
└─────────────────────────────────────────────────────┘
                      ↓ SQL
┌─────────────────────────────────────────────────────┐
│             PostgreSQL Database                      │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Products │  │  Prices  │  │Competitors│          │
│  └──────────┘  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Users   │  │ Discounts│  │ Margins  │           │
│  └──────────┘  └──────────┘  └──────────┘           │
└─────────────────────────────────────────────────────┘
```

---

## 4. FLUJO DE DATOS (Alto Nivel)

### Scenario A: Actualizar precios del proveedor

```
1. Usuario sube Excel de Kimiker
   ↓
2. Backend parsea archivo (xlsx → JSON)
   ↓
3. Extrae: Código, Nombre, USD/kg
   ↓
4. Recalcula: USD/kg × IVA × TC × fracción kg → ARS
   ↓
5. Guarda en DB (Products + Prices)
   ↓
6. Frontend muestra nueva tabla de precios
```

### Scenario B: Actualizar precios de competencia

```
1. Usuario copia/pega código + precio de competidor X
   ↓
2. Backend guarda en tabla Competitors
   ↓
3. Calcula diferencia vs nuestro precio
   ↓
4. Frontend muestra semáforo (rojo=más caro, verde=más barato)
```

### Scenario C: Redefinir precio manualmente

```
1. Usuario ve AMARILLO muy caro vs DP
   ↓
2. Decide bajar a $950 (en lugar de $990)
   ↓
3. Backend recalcula:
   - Margen nuevo
   - Descuentos aplicados
   - Impacto en ganancia %
   ↓
4. Frontend muestra análisis en tiempo real
   ↓
5. Usuario confirma y publica a Pency (futuro)
```

---

## 5. AUTENTICACIÓN

**MVP:** Muy simple
- Login con email + contraseña (sin OAuth)
- JWT token en localStorage
- Solo usuario: vos + Nahuel (mismo token por ahora)
- Sin roles complejos

**Futuro:** Agregar permisos por usuario (Natalia solo ve stock, etc.)

---

## 6. DECISIONES CLAVE

| Decisión | Justificación |
|----------|---------------|
| **PostgreSQL (no MongoDB)** | Datos relacionales (productos ↔ precios ↔ descuentos) |
| **REST (no GraphQL)** | MVP simple, no necesita queries complejas |
| **React (no Vue/Svelte)** | Ecosistema maduro, librerías estables |
| **Prisma (no raw SQL)** | Type-safe, migraciones automáticas |
| **Vercel + Render** | Deploy simple, sin costos mensuales iniciales |
| **Tailwind (no CSS custom)** | Velocidad de desarrollo, responsive automático |

---

## 7. FASES DEL PROYECTO

### Fase 1: MVP (Semanas 1-2)
- ✅ Auth básico
- ✅ CRUD de productos + precios
- ✅ Tabla comparativa con competencia
- ✅ Cálculo de márgenes simple

### Fase 2: Mejoras (Semanas 3-4)
- ✅ Redefinición manual de precios
- ✅ Reportes de márgenes por período
- ✅ Descuentos por volumen automático
- ✅ Export a Excel

### Fase 3: Integraciones (Semana 5+)
- ⏳ Sincronización con Pency API
- ⏳ Scraping de competencia (automático)
- ⏳ Dashboard de ventas (si Pency tiene API)

---

## 8. CRITERIOS DE ÉXITO

| Métrica | Target |
|---------|--------|
| **Tiempo de actualización semanal** | < 20 minutos (vs 45-60 hoy) |
| **Errores en precios** | 0 (vs errores ocasionales hoy) |
| **Usuarios activos** | Vos + Nahuel |
| **Disponibilidad** | 99.9% uptime |
| **Load time** | < 2s (página principal) |

---

## 9. Próximo Paso

→ Continuar con **02_MODELO_DE_DATOS.md**  
  (Tablas, campos, relaciones en detalle)
