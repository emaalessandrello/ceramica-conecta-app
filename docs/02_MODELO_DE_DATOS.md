# 02 - MODELO DE DATOS
## Sistema de Gestión Comercial - Cerámica Conecta

**Fecha:** Abril 16, 2026  
**Versión:** 1.0  
**Tecnología:** PostgreSQL + Prisma ORM

---

## 1. DIAGRAMA ER (Entity-Relationship)

```
┌─────────────────────┐
│      USERS          │
├─────────────────────┤
│ id (PK)             │
│ email               │
│ password_hash       │
│ name                │
│ role (admin/viewer) │
│ created_at          │
│ updated_at          │
└─────────────────────┘
         ↑
         │ (1:N)
         │
┌─────────────────────┐
│    PRODUCTS         │
├─────────────────────┤
│ id (PK)             │
│ code (Kimiker)      │───┐
│ name_cc             │   │
│ name_kimiker        │   │
│ category            │   │
│ formats (JSON)      │   │
│ created_at          │   │
│ updated_at          │   │
└─────────────────────┘   │
         ↑                │
         │ (1:N)          │
         │                │
┌─────────────────────────────────┐
│        PRICES                    │
├─────────────────────────────────┤
│ id (PK)                         │
│ product_id (FK)                 │
│ format_id (FK) ─┐               │
│ usd_per_kg      │               │
│ ars_base_price  │               │
│ ars_price_with_discount         │
│ margin_percentage               │
│ cost_plus_iva_envio             │
│ date_frozen (for "price lock")  │
│ is_custom_price (manual change?)│
│ created_at                      │
│ updated_at                      │
└─────────────────────────────────┘
         ↑
         │ (1:N)
         │
┌─────────────────────┐
│   FORMATS           │
├─────────────────────┤
│ id (PK)             │
│ name (10g, 100g...) │
│ grams               │
│ kg_fraction         │
│ description         │
└─────────────────────┘


┌──────────────────────┐
│   COMPETITORS        │
├──────────────────────┤
│ id (PK)              │
│ name                 │
│ region (e.g., CABA)  │
│ is_mayorista         │
│ priority_rank        │
│ website (optional)   │
│ created_at           │
│ updated_at           │
└──────────────────────┘
         ↑
         │ (1:N)
         │
┌──────────────────────────────┐
│  COMPETITOR_PRICES           │
├──────────────────────────────┤
│ id (PK)                      │
│ competitor_id (FK)           │
│ product_id (FK)              │
│ format_id (FK)               │
│ competitor_code              │
│ price_ars                    │
│ last_updated                 │
│ data_source (manual/scrape)  │
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘


┌─────────────────────────┐
│    VOLUME_DISCOUNTS     │
├─────────────────────────┤
│ id (PK)                 │
│ format_id (FK)          │
│ min_quantity            │
│ discount_percentage     │
│ created_at              │
│ updated_at              │
└─────────────────────────┘


┌──────────────────────────┐
│   MARGIN_HISTORY         │
├──────────────────────────┤
│ id (PK)                  │
│ price_id (FK)            │
│ product_id (FK)          │
│ format_id (FK)           │
│ margin_percentage        │
│ is_custom (manual change)│
│ reason (optional)        │
│ period_date              │
│ created_at               │
└──────────────────────────┘
```

---

## 2. TABLAS DETALLADAS

### USERS
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- admin, viewer
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Propósito:** Almacenar credenciales. MVP solo vos + Nahuel (mismo rol).

---

### PRODUCTS
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_kimiker VARCHAR(50) NOT NULL UNIQUE,
  name_cc VARCHAR(255) NOT NULL, -- Nombre Cerámica Conecta
  name_kimiker VARCHAR(255), -- Nombre original proveedor
  category VARCHAR(100), -- pigmentos, esmaltes, engobes, etc.
  formats JSONB DEFAULT '[]', -- Array: [10g, 100g, 500g, 1kg]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Propósito:** Catálogo de productos.  
**Nota:** `formats` es JSONB porque cada producto tiene diferentes formatos (no fijo).

**Ejemplo:**
```json
{
  "id": "prod_001",
  "code_kimiker": "8010",
  "name_cc": "AMARILLO CC PURO",
  "name_kimiker": "AMARILLO INTENSO",
  "category": "pigmentos",
  "formats": ["10g", "100g", "500g", "1kg"]
}
```

---

### FORMATS
```sql
CREATE TABLE formats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 10g, 100g, 500g, 1kg
  grams INT NOT NULL,
  kg_fraction DECIMAL(5,3) NOT NULL, -- 0.01, 0.1, 0.5, 1.0
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Propósito:** Lookup table para formatos.

**Datos iniciales:**
```
| id | name | grams | kg_fraction |
|----|------|-------|-------------|
| f1 | 10g  | 10    | 0.01        |
| f2 | 100g | 100   | 0.1         |
| f3 | 500g | 500   | 0.5         |
| f4 | 1kg  | 1000  | 1.0         |
```

---

### PRICES
```sql
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  format_id UUID NOT NULL REFERENCES formats(id),
  usd_per_kg DECIMAL(10,2) NOT NULL, -- Precio base del proveedor
  ars_base_price DECIMAL(10,2) NOT NULL, -- USD * IVA * TC * kg_fraction
  ars_price_with_discount DECIMAL(10,2), -- Precio final con descuento aplicado
  margin_percentage DECIMAL(5,2), -- % de margen
  cost_plus_iva_envio DECIMAL(10,2), -- Costo total incluido IVA + envío
  is_custom_price BOOLEAN DEFAULT FALSE, -- ¿Fue redefinido manualmente?
  date_frozen DATE, -- Fecha hasta donde está "congelado" el precio
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, format_id)
);
```

**Propósito:** Precios finales de venta.

**Ejemplo (AMARILLO 100g):**
```
{
  "product_id": "prod_001",
  "format_id": "f2", -- 100g
  "usd_per_kg": 67.0,
  "ars_base_price": 8900.0, -- 67 * 1.21 * 0.1 * 1305
  "ars_price_with_discount": 8000.0, -- Con descuento (manual decision)
  "margin_percentage": 32.5,
  "cost_plus_iva_envio": 100.704,
  "is_custom_price": true,
  "date_frozen": "2026-04-20"
}
```

---

### COMPETITORS
```sql
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE, -- DP, Pagés 1, Thibeju, etc.
  region VARCHAR(100), -- CABA, Mendoza, BS AS
  is_mayorista BOOLEAN DEFAULT FALSE,
  priority_rank INT DEFAULT 0, -- 1=más importante (ej: DP), 5=menos importante
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Propósito:** Catálogo de competencia.

**Datos iniciales:**
```
| id | name     | region   | is_mayorista | priority_rank |
|----|----------|----------|--------------|---------------|
| c1 | DP       | CABA     | true         | 1             |
| c2 | Pagés 1  | Mendoza  | false        | 2             |
| c3 | Pagés 2  | Mendoza  | false        | 2             |
| c4 | Thibeju  | Mendoza  | false        | 3             |
| c5 | Pellizer | BS AS    | true         | 3             |
| c6 | Terra    | BS AS    | true         | 3             |
| c7 | Arcillas | CABA     | true         | 1             |
```

---

### COMPETITOR_PRICES
```sql
CREATE TABLE competitor_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  format_id UUID NOT NULL REFERENCES formats(id),
  competitor_code VARCHAR(100), -- Código del competidor (DP-Y440, etc.)
  price_ars DECIMAL(10,2) NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_source VARCHAR(50) DEFAULT 'manual', -- manual, scrape, api
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(competitor_id, product_id, format_id)
);
```

**Propósito:** Precios de competencia.

**Ejemplo (DP - AMARILLO 100g):**
```
{
  "competitor_id": "c1",
  "product_id": "prod_001",
  "format_id": "f2", -- 100g
  "competitor_code": "DP-Y440",
  "price_ars": 12000.0,
  "data_source": "manual"
}
```

---

### VOLUME_DISCOUNTS
```sql
CREATE TABLE volume_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format_id UUID NOT NULL REFERENCES formats(id),
  min_quantity INT NOT NULL, -- Cantidad mínima para aplicar descuento
  discount_percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Propósito:** Descontar por volumen.

**Datos iniciales (según planilla actual):**
```
| format_id | min_quantity | discount_percentage |
|-----------|--------------|-------------------|
| f4        | 1            | 5.0                | -- 1kg: -5%
| f3        | 1            | 10.0               | -- 500g: -10%
| f2        | 1            | 10.0               | -- 100g: -10%
| f1        | 1            | 11.0               | -- 10g: -11%
```

---

### MARGIN_HISTORY
```sql
CREATE TABLE margin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_id UUID NOT NULL REFERENCES prices(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  format_id UUID NOT NULL REFERENCES formats(id),
  margin_percentage DECIMAL(5,2) NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE, -- ¿Cambio manual?
  reason VARCHAR(255), -- Ej: "Competir con DP"
  period_date DATE NOT NULL, -- Fecha del período de análisis
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Propósito:** Histórico de cambios de margen (para reportes y análisis).

---

## 3. RELACIONES CLAVE

```
1. PRODUCTS → PRICES (1:N)
   Un producto tiene múltiples precios (uno por formato).

2. PRODUCTS → COMPETITOR_PRICES (1:N)
   Un producto tiene precios de competencia de cada competidor.

3. FORMATS → PRICES (1:N)
   Un formato (10g, 100g) se usa en múltiples productos.

4. COMPETITORS → COMPETITOR_PRICES (1:N)
   Un competidor tiene precios de múltiples productos.

5. PRICES → MARGIN_HISTORY (1:N)
   Cada precio tiene histórico de cambios de margen.
```

---

## 4. ÍNDICES (Para Optimización)

```sql
CREATE INDEX idx_products_code ON products(code_kimiker);
CREATE INDEX idx_prices_product ON prices(product_id);
CREATE INDEX idx_prices_format ON prices(format_id);
CREATE INDEX idx_competitor_prices_competitor ON competitor_prices(competitor_id);
CREATE INDEX idx_competitor_prices_product ON competitor_prices(product_id);
CREATE INDEX idx_margin_history_period ON margin_history(period_date);
```

---

## 5. CONSTRAINTS Y VALIDACIONES

| Tabla | Campo | Validación |
|-------|-------|-----------|
| PRODUCTS | code_kimiker | NOT NULL, UNIQUE, VARCHAR(50) |
| PRODUCTS | name_cc | NOT NULL, VARCHAR(255) |
| PRICES | usd_per_kg | NOT NULL, DECIMAL > 0 |
| PRICES | ars_base_price | DECIMAL > 0 |
| PRICES | margin_percentage | DECIMAL 0-100 |
| COMPETITORS | name | NOT NULL, UNIQUE |
| COMPETITOR_PRICES | price_ars | NOT NULL, DECIMAL > 0 |
| VOLUME_DISCOUNTS | discount_percentage | DECIMAL 0-100 |

---

## 6. Inicialización de Datos (Seeds)

**Fase 1:** Cargar:
- ✅ FORMATS (10g, 100g, 500g, 1kg)
- ✅ COMPETITORS (DP, Pagés 1-2, Thibeju, Terra, Pellizer, Arcillas)
- ✅ VOLUME_DISCOUNTS (5%, 10%, 11%)
- ✅ USERS (vos + Nahuel, admin role)

**Fase 2:** Cargar desde Excel:
- ✅ PRODUCTS (desde lista Kimiker)
- ✅ PRICES (calculadas automáticamente)

**Fase 3:** Actualización semanal:
- ✅ COMPETITOR_PRICES (manual por ahora, scrape después)
- ✅ MARGIN_HISTORY (registro de cambios)

---

## 7. Próximo Paso

→ Continuar con **03_API_ENDPOINTS.md**  
  (Rutas, métodos, payloads detallados)
