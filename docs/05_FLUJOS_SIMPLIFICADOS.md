# 05 - FLUJOS SIMPLIFICADOS
## Las 3 operaciones principales (Sin tecnicismos)

**Fecha:** Abril 16, 2026  
**Objetivo:** Entender cómo funciona la app en la práctica

---

## FLUJO 1: ACTUALIZAR LISTA DE PROVEEDOR (Semanal)

### ¿Cuándo hacerlo?
Cada lunes cuando Kimiker publica nueva lista de precios.

### ¿Qué hace la app?
Importa lista de Kimiker → calcula precios ARS automáticamente

### Paso a paso:

```
1. Vos: Descargas lista de Kimiker (Excel)
   └─ Archivo: "LISTA_PRECIOS_KIMIKER_APR2026.xlsx"

2. Abrís la app → Panel "Importar Proveedor"
   └─ Ves botón "Subir Excel"

3. Seleccionás el archivo y das click "Subir"
   └─ App lee: Código, Nombre, USD/kg

4. Backend procesa:
   └─ Para cada producto:
      ├─ Trae TC actual (1305)
      ├─ Trae IVA (21%)
      ├─ Trae formato (10g = 0.01kg)
      ├─ Calcula: USD/kg × 1.21 × 0.01 × 1305 = ARS precio 10g
      ├─ Calcula: USD/kg × 1.21 × 0.1 × 1305 = ARS precio 100g
      ├─ Calcula: USD/kg × 1.21 × 0.5 × 1305 = ARS precio 500g
      ├─ Calcula: USD/kg × 1.21 × 1.0 × 1305 = ARS precio 1kg
      └─ Guarda en base de datos

5. App muestra resumen:
   ├─ "45 productos importados"
   ├─ "0 errores"
   └─ "Precios actualizados: AMARILLO, AZUL, ROJO..."

6. Vos revisás que todo esté OK
   └─ Ves nueva tabla de precios

✅ Listo. Tus precios base están actualizados.
```

### En la app:
```
┌────────────────────────────────────┐
│   IMPORTAR PROVEEDOR               │
├────────────────────────────────────┤
│  [📁 Seleccionar archivo Excel]    │
│                                    │
│  Última importación: 10/04/2026    │
│                                    │
│  [🔄 SUBIR Y PROCESAR]             │
└────────────────────────────────────┘

Después...

┌────────────────────────────────────┐
│   RESULTADOS                       │
├────────────────────────────────────┤
│  ✅ 45 productos importados        │
│  ⚠️ 1 duplicado (8010)             │
│  ❌ 0 errores críticos             │
│                                    │
│  Precios base recalculados para:   │
│  • AMARILLO CC PURO                │
│  • AZUL DE COBALTO PURO            │
│  • AZUL VIOLETA ULTRAMAR PURO      │
│  ...                               │
└────────────────────────────────────┘
```

---

## FLUJO 2: ACTUALIZAR PRECIOS DE COMPETENCIA (Semanal)

### ¿Cuándo hacerlo?
Martes/Miércoles cuando visitás las webs de competencia.

### ¿Qué hace la app?
Guarda precios de competidores → compara con los tuyos automáticamente

### Paso a paso:

```
1. Vos: Abris web de DP (distribuidora mayorista)
   └─ Ves: DP-Y440 AMARILLO = $12.000 (100g)
           DP-A617 AZUL = $11.500 (100g)

2. Volvés a la app → Panel "Competencia"
   └─ Seleccionás competidor: "DP"

3. Clickeás "Nuevo Precio"
   ├─ Código DP: DP-Y440
   ├─ Tu código: 8010 (AMARILLO)
   ├─ Formato: 100g
   ├─ Precio DP: $12.000
   └─ Click "Guardar"

4. App procesa:
   └─ Busca tu precio de AMARILLO 100g: $8.000
      Compara:
      ├─ DP cuesta: $12.000
      ├─ Vos costás: $8.000
      ├─ Diferencia: -$4.000 (-33%)
      └─ Vos estás más barato ✅

5. App muestra tabla comparativa:

   PRODUCTO        | FORMATO | NUESTRO | DP    | PAGÉS | THIBEJU
   ─────────────────────────────────────────────────────────────
   AMARILLO CC     | 100g    | $8.000  | $12k  | $9.5k | $7.5k
   PURO            |         |         |       |       |
   ─────────────────────────────────────────────────────────────

6. Ves semáforo:
   🟩 VERDE: Estás más barato que todos
   🟨 AMARILLO: Estás en el medio
   🔴 ROJO: Estás más caro (revisar)

✅ Listo. Comparativa actualizada.
```

### En la app:
```
┌──────────────────────────────────┐
│   AGREGAR PRECIO COMPETENCIA     │
├──────────────────────────────────┤
│  Competidor: [DP ▼]              │
│  Código DP:  [DP-Y440]           │
│  Tu código:  [8010] (auto)       │
│  Nombre:     [AMARILLO CC PURO]  │
│  Formato:    [100g ▼]            │
│  Precio $:   [12000]             │
│                                  │
│  [✅ GUARDAR]  [❌ CANCELAR]      │
└──────────────────────────────────┘

Después...

┌──────────────────────────────────────┐
│   TABLA COMPARATIVA                  │
├──────────────────────────────────────┤
│ AMARILLO 100g                        │
│ ├─ Nuestro:  $8.000    (32% margen) │
│ ├─ DP:       $12.000   🔴 MÁS CARO  │
│ ├─ Pagés 1:  $9.500    🟨 MÁS CARO  │
│ ├─ Pagés 2:  $10.000   🟨 MÁS CARO  │
│ └─ Thibeju:  $7.500    🟩 MÁS BARATO│
│                                      │
│ Status: 🟩 COMPETITIVO              │
└──────────────────────────────────────┘
```

---

## FLUJO 3: REDEFINIR PRECIO MANUALMENTE (Cuando sea necesario)

### ¿Cuándo hacerlo?
Cuando ves que estás muy caro vs competencia y querés bajar para ganar volumen.

**Ejemplo:** AMARILLO es color fundamental, Thibeju lo tiene a $7.500, vos a $8.000. Decidís bajar a $7.800 para ganar clientes.

### Paso a paso:

```
1. Vos: Ves tabla comparativa
   └─ AMARILLO 100g:
      • Tu precio: $8.000
      • Thibeju: $7.500 ← MÁS BARATO
      • Margen actual: 32%
      • Decisión: BAJAR precio para competir

2. Clickeás en la fila AMARILLO → "EDITAR PRECIO"
   └─ Se abre formulario

3. Cambias precio:
   ├─ Precio anterior: $8.000
   ├─ Nuevo precio: $7.800
   ├─ Razón: "Psicología venta - color fundamental"
   └─ Click "ACTUALIZAR"

4. App recalcula automáticamente:
   ├─ Nuevo margen: 30% (bajó de 32%)
   ├─ Ganancia por unidad: $2.340 (bajó de $2.560)
   ├─ Descuento por volumen: -10% en 100g
   │  └─ Precio final cliente: $7.020
   └─ Guarda cambio + razón en histórico

5. App muestra:
   ├─ "Precio actualizado ✅"
   ├─ Nuevas métricas:
   │  ├─ Margen: 30% (era 32%)
   │  ├─ vs Thibeju: +$300 (ahora más caro por $300)
   │  └─ Competitividad: BUENA
   └─ Pregunta: "¿Sincronizar a Pency?"

6. Vos das click "SÍ, SINCRONIZAR"
   └─ App actualiza Pency automáticamente
      (En futuro, por ahora manual)

✅ Listo. Clientes verán precio nuevo.
```

### En la app:
```
┌────────────────────────────────────┐
│   EDITAR PRECIO AMARILLO 100g      │
├────────────────────────────────────┤
│  Precio anterior: $8.000           │
│  Nuevo precio:   [7800]            │
│                                    │
│  Razón (opcional):                 │
│  [Psicología venta - color fund.]  │
│                                    │
│  IMPACTO AUTOMÁTICO:               │
│  • Margen: 32% → 30%  ⬇️           │
│  • vs Thibeju: +$500 → +$300  ⬇️   │
│  • Competitividad: BUENA           │
│                                    │
│  [✅ GUARDAR]  [❌ CANCELAR]        │
└────────────────────────────────────┘

Después...

┌────────────────────────────────────┐
│   ACTUALIZACIÓN CONFIRMADA         │
├────────────────────────────────────┤
│  ✅ Precio actualizado             │
│                                    │
│  NUEVO ESTADO - AMARILLO 100g:     │
│  • Precio: $7.800                  │
│  • Margen: 30%                     │
│  • vs Thibeju: +$300 más caro      │
│  • vs DP: -$4.200 más barato       │
│  • Estado: 🟩 COMPETITIVO          │
│                                    │
│  [Sincronizar a Pency]             │
│  [Ver histórico de cambios]        │
│  [Ver impacto en otras tallas]     │
└────────────────────────────────────┘
```

---

## FLUJO BONUS: VER ANÁLISIS DE MÁRGENES

### ¿Cuándo hacerlo?
Viernes, para ver cómo está la rentabilidad de la semana.

### Paso a paso:

```
1. Vos: Clickeás en "REPORTES"
   └─ Panel nuevo

2. Seleccionás:
   ├─ Fecha inicial: 10 de Abril
   ├─ Fecha final: 16 de Abril
   ├─ Categoría: "PIGMENTOS" (opcional)
   └─ Click "GENERAR REPORTE"

3. App procesa:
   └─ Analiza todos los cambios de margen en el período
      ├─ Productos sin cambios (margen normal)
      ├─ Productos redefinidos (margen reducido)
      ├─ Promedio de margen
      └─ Impacto en ganancia

4. Muestra resumen:

   REPORTE: 10/04/2026 - 16/04/2026
   ─────────────────────────────────
   Productos: 45
   Margen promedio: 34.2%
   
   CAMBIOS REALIZADOS:
   • AMARILLO 100g: 32% → 30% (-2%) [Razón: Psicología venta]
   • ROJO 100g: 35% → 33% (-2%) [Razón: Competir con Pagés]
   
   IMPACTO:
   • Ganancia semana anterior: $X
   • Ganancia esta semana: $X - $1.200
   • Pérdida estimada: -5%
   • Pero: +20% en volumen esperado

5. Puede exportar a Excel:
   └─ "Descargar reporte.xlsx"

✅ Ahora ves si tus decisiones fueron rentables.
```

---

## RESUMEN: LAS 3 OPERACIONES

| Operación | Cuándo | Tiempo | Impacto |
|-----------|--------|--------|---------|
| **1. Actualizar proveedor** | Lunes | 5 min | ↻ Todos los precios base |
| **2. Actualizar competencia** | Martes-Mié | 15 min | 📊 Ver si estás competitivo |
| **3. Redefinir precios** | Según sea necesario | 2 min/producto | 💰 Ganar volumen vs margen |

---

## DATOS QUE NECESITAS SEMANAL

Para que la app funcione, necesitás:

```
LUNES:
└─ Lista Kimiker (Excel)

MARTES:
├─ DP: 45 precios (copiar de web)
├─ Pagés 1: 30 precios
├─ Pagés 2: 35 precios
├─ Thibeju: 40 precios
├─ Pellizer: 25 precios
├─ Terra: 20 precios
└─ Arcillas: 30 precios

MIÉRCOLES-VIERNES:
└─ Decisiones de precios (si necesitás bajar)

OPCIONAL:
└─ TC actualizado (si cambió)
```

---

## VENTAJA DE LA APP

**ANTES (SIN APP):**
```
Tiempo: 60 minutos
Riesgo: Alto (errores en copia/pega)
Visibilidad: Bajo (datos dispersos)
Decisiones: Lentas (mucha data que procesar)
```

**DESPUÉS (CON APP):**
```
Tiempo: 20 minutos
Riesgo: Bajo (todo estructurado)
Visibilidad: Alto (tabla comparativa automática)
Decisiones: Rápidas (análisis en tiempo real)
```

---

## PRÓXIMOS PASOS

1. ✅ Tenés documentación clara (05 archivos)
2. ✅ Tenés guía de setup paso a paso
3. ✅ Entendés cómo funciona la app
4. **Próximo:** Crear repositorio en GitHub + setup inicial del código

¿Vamos con el código?
