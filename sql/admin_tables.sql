-- ═══════════════════════════════════════════════════════════
-- NATURALFOOD - Administration Tables
-- Creates all tables for the "Administración Usuarios" module
-- ═══════════════════════════════════════════════════════════

USE naturalfood_db;

-- 1. Admin Fincas
CREATE TABLE IF NOT EXISTS admin_fincas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(255) DEFAULT '',
    hectareas DECIMAL(10,2) DEFAULT 0,
    encargado VARCHAR(255) DEFAULT '',
    telefono VARCHAR(50) DEFAULT '',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Admin Predios
CREATE TABLE IF NOT EXISTS admin_predios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    finca_id INT,
    superficie DECIMAL(10,2) DEFAULT 0,
    variedad VARCHAR(255) DEFAULT '',
    tipo_suelo VARCHAR(255) DEFAULT '',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (finca_id) REFERENCES admin_fincas(id) ON DELETE SET NULL
);

-- 3. Admin Cuarteles/Parcelas
CREATE TABLE IF NOT EXISTS admin_cuarteles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    predio_id INT,
    superficie DECIMAL(10,2) DEFAULT 0,
    variedad VARCHAR(255) DEFAULT '',
    hileras INT DEFAULT 0,
    plantas_por_hilera INT DEFAULT 0,
    sistema_conduccion VARCHAR(255) DEFAULT '',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (predio_id) REFERENCES admin_predios(id) ON DELETE SET NULL
);

-- 4. Admin Faenas
CREATE TABLE IF NOT EXISTS admin_faenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100) DEFAULT '',
    duracion_estimada VARCHAR(50) DEFAULT '',
    costo_estimado DECIMAL(12,2) DEFAULT 0,
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Admin Labor
CREATE TABLE IF NOT EXISTS admin_labor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) DEFAULT '',
    descripcion TEXT,
    unidad_medida VARCHAR(50) DEFAULT '',
    costo_unitario DECIMAL(12,2) DEFAULT 0,
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Admin Personal
CREATE TABLE IF NOT EXISTS admin_personal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    dni VARCHAR(20) DEFAULT '',
    legajo VARCHAR(50) DEFAULT '',
    cargo VARCHAR(100) DEFAULT '',
    finca VARCHAR(255) DEFAULT '',
    telefono VARCHAR(50) DEFAULT '',
    fecha_ingreso DATE,
    salario DECIMAL(12,2) DEFAULT 0,
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Admin Bodegas
CREATE TABLE IF NOT EXISTS admin_bodegas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(255) DEFAULT '',
    capacidad VARCHAR(100) DEFAULT '',
    tipo VARCHAR(100) DEFAULT '',
    encargado VARCHAR(255) DEFAULT '',
    telefono VARCHAR(50) DEFAULT '',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. Admin Productos
CREATE TABLE IF NOT EXISTS admin_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) DEFAULT '',
    unidad VARCHAR(50) DEFAULT '',
    precio DECIMAL(12,2) DEFAULT 0,
    stock DECIMAL(12,2) DEFAULT 0,
    proveedor VARCHAR(255) DEFAULT '',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. Admin Institucional
CREATE TABLE IF NOT EXISTS admin_institucional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) DEFAULT '',
    direccion VARCHAR(255) DEFAULT '',
    telefono VARCHAR(50) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    contacto VARCHAR(255) DEFAULT '',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 10. Admin Zonas de Riego
CREATE TABLE IF NOT EXISTS admin_zonas_riego (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    finca_id INT,
    superficie DECIMAL(10,2) DEFAULT 0,
    tipo_riego VARCHAR(100) DEFAULT '',
    caudal VARCHAR(50) DEFAULT '',
    frecuencia VARCHAR(100) DEFAULT '',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (finca_id) REFERENCES admin_fincas(id) ON DELETE SET NULL
);

-- 11. Admin Sistema de Riego
CREATE TABLE IF NOT EXISTS admin_sistema_riego (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) DEFAULT '',
    marca VARCHAR(100) DEFAULT '',
    modelo VARCHAR(100) DEFAULT '',
    capacidad VARCHAR(100) DEFAULT '',
    zona_riego_id INT,
    fecha_instalacion DATE,
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (zona_riego_id) REFERENCES admin_zonas_riego(id) ON DELETE SET NULL
);

-- 12. Admin Planificación
CREATE TABLE IF NOT EXISTS admin_planificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(100) DEFAULT '',
    fecha_inicio DATE,
    fecha_fin DATE,
    responsable VARCHAR(255) DEFAULT '',
    prioridad ENUM('alta','media','baja') DEFAULT 'media',
    estado ENUM('pendiente','en_progreso','completado','cancelado') DEFAULT 'pendiente',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
