# NATURALFOOD - Product Requirements Document (PRD)
## Plataforma de Gestión Agrícola

---

## 1. Introducción y Objetivos

**Nombre del Proyecto:** Plataforma de Gestión Agrícola NATURALFOOD  
**Modelo Arquitectónico:** MVC (Model-View-Controller)  
**Versión:** 1.0  
**Fecha:** Febrero 2026

### Objetivo
Desarrollar un sistema web para la gestión integral de la producción de uva para pasa. En esta primera fase, el foco principal es la visualización de informes y la gestión de datos maestros.

---

## 2. Definición de Roles y Permisos (Matriz de Acceso)

| Rol | Descripción | Permisos Clave |
|-----|-------------|----------------|
| **Administrador** | Superusuario | Acceso total al sistema, gestión de usuarios y logs |
| **Ingeniero** | Gestor técnico/operativo | Definición de presupuesto, aplicaciones, parámetros de predios, variedades y fincas |
| **RRHH** | Gestión de personal | Alta, baja y modificación de legajos de empleados |
| **Carga** | Operador de campo | Registro exclusivo de labores diarias y partes de campo |
| **Sub-Admin** | Perfil consultivo | Acceso exclusivo a visualización de informes y dashboards |

---

## 3. Arquitectura del Sistema (MVC)

```
src/
├── main.js                    # Entry point
├── models/
│   └── DataModels.js          # Model Layer - Data management
├── views/
│   └── Views.js               # View Layer - HTML templates
├── controllers/
│   └── AppController.js       # Controller Layer - Business logic
└── styles/
    └── main.css               # Design system & styles
```

### Model (Modelo)
- Gestión de la base de datos (tablas de Fincas, Predios, Variedades, Empleados, Labores y Presupuestos)
- Autenticación y gestión de sesiones
- Datos simulados con localStorage (backend API-ready)

### View (Vista)
- Interfaz institucional (Landing Page)
- Formularios de login
- Dashboards dinámicos con Chart.js
- Tablas de datos con búsqueda
- Modales y notificaciones toast

### Controller (Controlador)
- Lógica de rutas y navegación
- Validación de credenciales
- Control de acceso basado en roles
- Cálculo de indicadores para informes
- Bindeo de eventos e interactividad

---

## 4. Requisitos Funcionales

### 4.1 Frontend Institucional
- ✅ Página de inicio con información sobre NATURALFOOD
- ✅ Hero section con estadísticas y CTAs
- ✅ Sección de características (features grid)
- ✅ Estadísticas de la operación
- ✅ Botón de acceso visible al login

### 4.2 Módulo de Informes
- ✅ Informe de Ejecución Presupuestaria (planificado vs ejecutado con gráficos)
- ✅ Informe de Labores de Campo (por tipo y por finca)
- ✅ Visualización de Parámetros (fincas, variedades, aplicaciones)

### 4.3 Módulo de Gestión de Datos
- ✅ Fincas: Listado, búsqueda y visualización
- ✅ Predios: Parcelas con datos técnicos
- ✅ Variedades: Catálogo de variedades de uva
- ✅ Empleados: Gestión completa de personal
- ✅ Labores: Registro y filtrado de labores de campo
- ✅ Presupuestos: Gráficos y detalle por categoría
- ✅ Aplicaciones: Tratamientos fitosanitarios
- ✅ Usuarios: Gestión de acceso al sistema

---

## 5. Cuentas de Demostración

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@naturalfood.com | admin123 |
| Ingeniero | ingeniero@naturalfood.com | ing123 |
| RRHH | rrhh@naturalfood.com | rrhh123 |
| Carga | carga@naturalfood.com | carga123 |
| Sub-Admin | subadmin@naturalfood.com | sub123 |

---

## 6. Flujo de Navegación

1. **Inicio:** El usuario entra a la web institucional
2. **Autenticación:** Login con correo y contraseña
3. **Redirección por Rol:**
   - **Sub-Admin** → Informes y gráficos directamente
   - **Carga** → Formulario de registro de labor
   - **Ingeniero/Admin** → Menú lateral completo con todas las secciones
   - **RRHH** → Dashboard + gestión de empleados

---

## 7. Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Build Tool:** Vite 7.x
- **Gráficos:** Chart.js
- **Tipografía:** Google Fonts (Inter + Outfit)
- **Diseño:** Dark theme premium con glassmorphism
