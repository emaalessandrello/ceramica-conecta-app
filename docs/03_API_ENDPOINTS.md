# 03 - API ENDPOINTS
## Sistema de Gestión Comercial - Cerámica Conecta

**Fecha:** Abril 16, 2026  
**Versión:** 1.0  
**Base URL:** `https://api.ceramicaconecta.com/api/v1`  
**Auth:** JWT en header `Authorization: Bearer {token}`

---

## 1. AUTENTICACIÓN

### POST /auth/login
Inicia sesión con email + contraseña.

**Request:**
```json
{
  "email": "vos@ceramicaconecta.com",
  "password": "tu_password_secura"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "user_001",
    "email": "vos@ceramicaconecta.com",
    "name": "Vos",
    "role": "admin"
  },
  "expiresIn": 86400
}
```

**Error (401):**
```json
{
  "error": "Invalid email or password"
}
```

---

### POST /auth/logout
Cierra sesión (invalida token, si usamos lista negra).

**Request:**
```json
{}
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 2. PRODUCTS

### GET /products
Obtiene lista de productos.

**Query params:**
- `category` (optional): "pigmentos", "esmaltes", "engobes"
- `search` (optional): Búsqueda por nombre o código
- `limit`: default 50, max 200
- `offset`: default 0

**Response (200):**
```json
{
  "data": [
    {
      "id": "prod_001",
      "code_kimiker": "8010",
      "name_cc": "AMARILLO CC PURO",
      "name_kimiker": "AMARILLO INTENSO",
      "category": "pigmentos",
      "formats": ["10g", "100g", "500g", "1kg"],
      "created_at": "2026-04-10T08:00:00Z"
    }
  ],
  "total": 45,
  "limit": 50,
  "offset": 0
}
```

---

### POST /products
Crea un nuevo producto.

**Auth:** Admin only

**Request:**
```json
{
  "code_kimiker": "8010",
  "name_cc": "AMARILLO CC PURO",
  "name_kimiker": "AMARILLO INTENSO",
  "category": "pigmentos",
  "formats": ["10g", "100g", "500g", "1kg"]
}
```

**Response (201):**
```json
{
  "id": "prod_001",
  "code_kimiker": "8010",
  "name_cc": "AMARILLO CC PURO",
  "name_kimiker": "AMARILLO INTENSO",
  "category": "pigmentos",
  "formats": ["10g", "100g", "500g", "1kg"],
  "created_at": "2026-04-16T14:30:00Z"
}
```

---

### POST /products/bulk-upload
Sube múltiples productos desde Excel (Kimiker).

**Auth:** Admin only

**Request (multipart/form-data):**
```
file: <excel_file>
```

**Response (200):**
```json
{
  "imported": 45,
  "skipped": 2,
  "errors": [
    {
      "row": 3,
      "error": "Duplicate code_kimiker: 8010"
    }
  ]
}
```

---

## 3. PRICES

### GET /prices
Obtiene precios (con filtros).

**Query params:**
- `product_id` (optional)
- `format_id` (optional)
- `include_competitors` (optional, bool): Incluir precios de competencia

**Response (200):**
```json
{
  "data": [
    {
      "id": "price_001",
      "product_id": "prod_001",
      "product": {
        "name_cc": "AMARILLO CC PURO",
        "code_kimiker": "8010"
      },
      "format_id": "fmt_002",
      "format": {
        "name": "100g",
        "grams": 100
      },
      "usd_per_kg": 67.0,
      "ars_base_price": 8900.0,
      "ars_price_with_discount": 8000.0,
      "margin_percentage": 32.5,
      "is_custom_price": true,
      "date_frozen": "2026-04-20",
      "competitors": [
        {
          "competitor_id": "comp_001",
          "competitor_name": "DP",
          "price_ars": 12000.0,
          "difference_ars": -3000.0,
          "difference_percent": -25.0
        }
      ],
      "created_at": "2026-04-10T08:00:00Z"
    }
  ],
  "total": 180
}
```

---

### GET /prices/{id}
Obtiene un precio específico con detalles completos.

**Response (200):**
```json
{
  "id": "price_001",
  "product": { ... },
  "format": { ... },
  "usd_per_kg": 67.0,
  "ars_base_price": 8900.0,
  "ars_price_with_discount": 8000.0,
  "margin_percentage": 32.5,
  "cost_plus_iva_envio": 100.704,
  "is_custom_price": true,
  "date_frozen": "2026-04-20",
  "history": [
    {
      "period_date": "2026-04-10",
      "margin_percentage": 35.0,
      "reason": "Initial import"
    },
    {
      "period_date": "2026-04-16",
      "margin_percentage": 32.5,
      "reason": "Compete with DP"
    }
  ],
  "created_at": "2026-04-10T08:00:00Z"
}
```

---

### PUT /prices/{id}
Actualiza un precio (redefinición manual).

**Auth:** Admin only

**Request:**
```json
{
  "ars_price_with_discount": 8500.0,
  "reason": "Psicología de venta: AMARILLO color fundamental"
}
```

**Response (200):**
```json
{
  "id": "price_001",
  "ars_price_with_discount": 8500.0,
  "margin_percentage": 34.2, -- Recalculado automáticamente
  "is_custom_price": true,
  "updated_at": "2026-04-16T14:30:00Z"
}
```

---

### POST /prices/bulk-recalculate
Recalcula todos los precios (ej: cambio de TC).

**Auth:** Admin only

**Request:**
```json
{
  "new_exchange_rate": 1420.0,
  "reason": "BNA updated"
}
```

**Response (200):**
```json
{
  "updated": 180,
  "timestamp": "2026-04-16T14:30:00Z"
}
```

---

## 4. COMPETITORS

### GET /competitors
Lista de competidores.

**Query params:**
- `region` (optional): "CABA", "Mendoza"
- `is_mayorista` (optional): true/false

**Response (200):**
```json
{
  "data": [
    {
      "id": "comp_001",
      "name": "DP",
      "region": "CABA",
      "is_mayorista": true,
      "priority_rank": 1,
      "created_at": "2026-04-01T00:00:00Z"
    }
  ],
  "total": 7
}
```

---

### POST /competitors
Agrega un nuevo competidor.

**Auth:** Admin only

**Request:**
```json
{
  "name": "Nuevo Competitor",
  "region": "Mendoza",
  "is_mayorista": false,
  "priority_rank": 4
}
```

**Response (201):**
```json
{
  "id": "comp_008",
  "name": "Nuevo Competitor",
  "region": "Mendoza",
  "is_mayorista": false,
  "priority_rank": 4,
  "created_at": "2026-04-16T14:30:00Z"
}
```

---

## 5. COMPETITOR PRICES

### GET /competitor-prices
Precios de competencia con filtros.

**Query params:**
- `competitor_id` (optional)
- `product_id` (optional)
- `format_id` (optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": "cprice_001",
      "competitor": {
        "id": "comp_001",
        "name": "DP"
      },
      "product": {
        "id": "prod_001",
        "name_cc": "AMARILLO CC PURO"
      },
      "format": {
        "id": "fmt_002",
        "name": "100g"
      },
      "competitor_code": "DP-Y440",
      "price_ars": 12000.0,
      "our_price_ars": 8000.0,
      "difference": -4000.0,
      "difference_percent": -33.3,
      "last_updated": "2026-04-16T00:00:00Z"
    }
  ],
  "total": 315
}
```

---

### POST /competitor-prices/bulk-update
Carga múltiples precios de competencia.

**Auth:** Admin only

**Request:**
```json
{
  "competitor_id": "comp_001",
  "prices": [
    {
      "product_code": "8010",
      "format_name": "100g",
      "competitor_code": "DP-Y440",
      "price_ars": 12000.0
    },
    {
      "product_code": "8020",
      "format_name": "100g",
      "competitor_code": "DP-A617",
      "price_ars": 11500.0
    }
  ],
  "data_source": "manual"
}
```

**Response (200):**
```json
{
  "imported": 25,
  "skipped": 1,
  "errors": [
    {
      "row": 3,
      "error": "Product code 9999 not found"
    }
  ]
}
```

---

## 6. COMPARATIVAS (Views)

### GET /comparatives/price-table
Tabla unificada: Tu precio vs competencia.

**Query params:**
- `format_id` (optional): Filtrar por formato
- `sort_by` (optional): "our_price", "difference", "margin"
- `only_custom_prices` (optional, bool): Solo los que redefiniste

**Response (200):**
```json
{
  "data": [
    {
      "product": {
        "id": "prod_001",
        "code_kimiker": "8010",
        "name_cc": "AMARILLO CC PURO"
      },
      "format": "100g",
      "our_price": 8000.0,
      "our_margin": 32.5,
      "is_custom": true,
      "cheapest_competitor": {
        "name": "Thibeju",
        "price": 7500.0,
        "difference": 500.0
      },
      "all_competitors": [
        { "name": "DP", "price": 12000.0 },
        { "name": "Pagés 1", "price": 9500.0 },
        { "name": "Thibeju", "price": 7500.0 }
      ]
    }
  ]
}
```

---

## 7. REPORTES

### GET /reports/margins
Reporte de márgenes por período.

**Query params:**
- `start_date` (required): YYYY-MM-DD
- `end_date` (required): YYYY-MM-DD
- `category` (optional)
- `format` (optional): "json", "csv", "excel"

**Response (200, JSON):**
```json
{
  "period": {
    "start_date": "2026-04-10",
    "end_date": "2026-04-16"
  },
  "summary": {
    "total_products": 45,
    "avg_margin_percent": 34.2,
    "custom_price_count": 3,
    "custom_price_reason": [
      {
        "reason": "Psicología de venta",
        "count": 2
      }
    ]
  },
  "by_product": [
    {
      "product_id": "prod_001",
      "product_name": "AMARILLO CC PURO",
      "avg_margin": 32.5,
      "formats": [
        { "name": "10g", "margin": 28.0 },
        { "name": "100g", "margin": 32.5 },
        { "name": "500g", "margin": 35.0 },
        { "name": "1kg", "margin": 36.2 }
      ]
    }
  ],
  "by_category": [
    {
      "category": "pigmentos",
      "avg_margin": 35.0,
      "count": 25
    }
  ]
}
```

---

### GET /reports/margins/export
Descarga reporte en Excel.

**Query params:**
- `start_date`
- `end_date`
- Mismo formato que GET /reports/margins

**Response (200):**
- File: `margenes_2026-04-10_2026-04-16.xlsx`

---

## 8. DATOS GLOBALES

### GET /system/exchange-rate
Obtiene TC actual.

**Response (200):**
```json
{
  "rate": 1305.0,
  "source": "BNA",
  "last_updated": "2026-04-16T00:00:00Z"
}
```

---

### PUT /system/exchange-rate
Actualiza TC manualmente.

**Auth:** Admin only

**Request:**
```json
{
  "rate": 1420.0,
  "reason": "BNA oficial"
}
```

**Response (200):**
```json
{
  "rate": 1420.0,
  "updated_at": "2026-04-16T14:30:00Z"
}
```

---

## 9. HEALTH CHECK

### GET /health
Verifica que la API está disponible.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-04-16T14:30:00Z",
  "version": "1.0.0"
}
```

---

## 10. ERRORES ESTÁNDAR

Todos los endpoints usan estos códigos HTTP:

| Código | Descripción |
|--------|------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validación) |
| 401 | Unauthorized (sin token) |
| 403 | Forbidden (sin permisos) |
| 404 | Not Found |
| 409 | Conflict (ej: código duplicado) |
| 500 | Server Error |

**Formato de error estándar:**
```json
{
  "error": "Descripción del error",
  "code": "INVALID_INPUT",
  "details": {
    "field": "price_ars",
    "message": "Must be positive"
  }
}
```

---

## 11. RATE LIMITING

- 100 requests/minuto por usuario
- 1000 requests/hora por usuario
- Endpoints de bulk son 10 requests/minuto

---

## 12. Próximo Paso

→ Continuar con **04_FLUJOS_DE_OPERACION.md**  
  (Casos de uso paso a paso)
