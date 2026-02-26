# NATURALFOOD - Plan de Implementación: Módulo de Informes

## Estructura de Navegación
- Menú lateral: **UN solo desplegable "Informes"** con 3 sub-opciones:
  1. Jornales
  2. Cosecha
  3. Aplicaciones

## Ciclo de Producción
- **1 de Mayo → 30 de Abril** (vid)

## Fuentes de Datos
- **Jornales y Cosecha**: API Sofía (JSON)
- **Aplicaciones**: Archivos CSV (uno por finca: El Espejo, Fincas Viejas)

## Parsing de Campos Sofía
- **cuartel**: `"21 - Ha:2.200, Pl:3584"` → extraer Ha (hectáreas) y Pl (plantas)
- **rendimiento**: `"18200.000"` → float sin separador de miles, punto = decimales
- **clasifica**: columna que determina el predio

## Sección 1: JORNALES
### Filtros
- Comparativo de ciclos
- Período de tiempo (fecha inicio/fin)
- Predio (de columna "clasifica")
- Variedad
- CSV upload para presupuesto de jornales

### Lógica
- Jornales consumidos por labor (separados)
- Promedio jornales/hectárea por finca y por predio
- Hectáreas de cada predio
- **Regla especial**: En "El Espejo", "Poda" + "Poda dov" = una sola labor "Poda"

## Sección 2: COSECHA
### Filtros independientes
- Ciclo de producción
- Variedad
- Predios
- Fincas
- Comparativo entre dos ciclos

### Lógica
- Kilos cosechados = campo `rendimiento` cuando labor es: cosecha kg 1, cosecha kg 2, cosecha kg 3, cosecha kg 4, cosecha kg 5
- Rendimiento total entre ambas fincas

## Sección 3: APLICACIONES (CSV por finca)
### 3.1 Aplicaciones Foliares
- 20 semanas fenológicas (Sep 14, 2025 → Ene 31, 2026)
- Etapas definidas por ingeniero

### 3.2 Fertilización
- Pre-cosecha: 4 etapas fenológicas variables
- Post-cosecha: TBD
- Presupuesto: total comprado / semanas (12-16)
- CSV diferencia: tipo=Real, Presupuestado-Pre, Presupuestado-Pos
- 16 semanas presupuestadas (Oct 12 → Ene 31)
- Gráfico por producto con línea de promedio semanal
- **Normalización**: "NUTRI 1075 M" === "Nutri 1075M"

### 3.3 Herbicidas
- Sin calendario/etapas
- Solo por fecha de aplicación
- Aplicación por mochila

## Fases de Implementación
1. **Fase 1**: Reestructurar navegación (sidebar colapsable con Informes)
2. **Fase 2**: Modelos de datos (parsers de JSON Sofía + CSV)
3. **Fase 3**: Sección Jornales (vista + controller)
4. **Fase 4**: Sección Cosecha (vista + controller)
5. **Fase 5**: Sección Aplicaciones (Foliares + Fertilización + Herbicidas)
