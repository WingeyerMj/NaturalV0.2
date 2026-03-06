-- ═══════════════════════════════════════════════════════════
-- NATURALFOOD - Base de Datos MySQL
-- Gestión de Usuarios (Login y Registro)
-- 
-- Para ejecutar este script:
--   mysql -u root -p < naturalfood_db.sql
-- ═══════════════════════════════════════════════════════════

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS naturalfood_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE naturalfood_db;

-- ═══════════════════════════════════════════════════════════
-- Tabla: users
-- Gestión completa de usuarios del sistema
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  password      VARCHAR(255)    NOT NULL,
  role          ENUM('Administrador', 'Ingeniero', 'RRHH', 'Carga', 'Sub-Admin') NOT NULL DEFAULT 'Sub-Admin',
  avatar        VARCHAR(10)     NOT NULL DEFAULT '',
  active        TINYINT(1)      NOT NULL DEFAULT 1,
  pending       TINYINT(1)      NOT NULL DEFAULT 0,
  registered_at DATETIME        DEFAULT CURRENT_TIMESTAMP,
  approved_at   DATETIME        DEFAULT NULL,
  last_login    DATETIME        DEFAULT NULL,
  created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Índices para búsquedas frecuentes
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (active),
  INDEX idx_pending (pending)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ═══════════════════════════════════════════════════════════
-- Datos iniciales: Usuarios del sistema
-- Las contraseñas están en texto plano (en producción usar bcrypt/argon2)
-- ═══════════════════════════════════════════════════════════
INSERT INTO users (id, name, email, password, role, avatar, active, pending) VALUES
  (1, 'Carlos Mendoza',   'admin@naturalfood.com',      'admin123',       'Administrador', 'CM', 1, 0),
  (2, 'Laura Vásquez',    'ingeniero@naturalfood.com',  'ing123',         'Ingeniero',     'LV', 1, 0),
  (3, 'María García',     'rrhh@naturalfood.com',       'rrhh123',        'RRHH',          'MG', 1, 0),
  (4, 'Juan Pérez',       'carga@naturalfood.com',      'carga123',       'Carga',         'JP', 1, 0),
  (5, 'Roberto Díaz',     'subadmin@naturalfood.com',   'N4tur4lf00d$00', 'Sub-Admin',     'RD', 1, 0),
  (6, 'Ana Martínez',     'ana@naturalfood.com',        'ana123',         'Carga',         'AM', 1, 0)
ON DUPLICATE KEY UPDATE name = VALUES(name);


-- ═══════════════════════════════════════════════════════════
-- Vista: usuarios activos (sin contraseña)
-- Para consultas seguras desde la aplicación
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_active_users AS
SELECT id, name, email, role, avatar, active, pending, registered_at, last_login
FROM users
WHERE active = 1 AND pending = 0;


-- ═══════════════════════════════════════════════════════════
-- Vista: solicitudes pendientes de registro
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW v_pending_registrations AS
SELECT id, name, email, role, avatar, registered_at
FROM users
WHERE pending = 1 AND active = 0;


-- ═══════════════════════════════════════════════════════════
-- Procedimiento: Registro de nuevo usuario
-- ═══════════════════════════════════════════════════════════
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_register_user(
  IN p_name     VARCHAR(100),
  IN p_email    VARCHAR(150),
  IN p_password VARCHAR(255)
)
BEGIN
  DECLARE v_exists INT DEFAULT 0;
  
  -- Verificar si el email ya existe
  SELECT COUNT(*) INTO v_exists FROM users WHERE email = p_email;
  
  IF v_exists > 0 THEN
    SELECT 'ERROR' AS status, 'Este correo ya está registrado.' AS message;
  ELSE
    -- Generar avatar con las iniciales del nombre
    SET @avatar = UPPER(CONCAT(
      LEFT(SUBSTRING_INDEX(p_name, ' ', 1), 1),
      LEFT(SUBSTRING_INDEX(p_name, ' ', -1), 1)
    ));
    
    INSERT INTO users (name, email, password, role, avatar, active, pending, registered_at)
    VALUES (p_name, p_email, p_password, 'Sub-Admin', @avatar, 0, 1, NOW());
    
    SELECT 'OK' AS status, LAST_INSERT_ID() AS user_id, 'Registro exitoso. Pendiente de aprobación.' AS message;
  END IF;
END //

DELIMITER ;


-- ═══════════════════════════════════════════════════════════
-- Procedimiento: Autenticación de usuario
-- ═══════════════════════════════════════════════════════════
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_authenticate(
  IN p_email    VARCHAR(150),
  IN p_password VARCHAR(255)
)
BEGIN
  DECLARE v_id      INT;
  DECLARE v_active  TINYINT;
  DECLARE v_pending TINYINT;
  
  SELECT id, active, pending INTO v_id, v_active, v_pending
  FROM users
  WHERE email = p_email AND password = p_password
  LIMIT 1;
  
  IF v_id IS NULL THEN
    SELECT 'ERROR' AS status, 'Credenciales inválidas.' AS message;
  ELSEIF v_pending = 1 AND v_active = 0 THEN
    SELECT 'PENDING' AS status, 'Tu cuenta está pendiente de aprobación.' AS message;
  ELSEIF v_active = 0 THEN
    SELECT 'INACTIVE' AS status, 'Tu cuenta está desactivada.' AS message;
  ELSE
    -- Actualizar último login
    UPDATE users SET last_login = NOW() WHERE id = v_id;
    
    -- Retornar datos del usuario (sin contraseña)
    SELECT 'OK' AS status, id, name, email, role, avatar, active
    FROM users
    WHERE id = v_id;
  END IF;
END //

DELIMITER ;


-- ═══════════════════════════════════════════════════════════
-- Procedimiento: Aprobar usuario pendiente
-- ═══════════════════════════════════════════════════════════
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_approve_user(
  IN p_user_id INT
)
BEGIN
  UPDATE users 
  SET active = 1, pending = 0, approved_at = NOW()
  WHERE id = p_user_id AND pending = 1;
  
  IF ROW_COUNT() > 0 THEN
    SELECT 'OK' AS status, 'Usuario aprobado exitosamente.' AS message;
  ELSE
    SELECT 'ERROR' AS status, 'Usuario no encontrado o ya aprobado.' AS message;
  END IF;
END //

DELIMITER ;


-- ═══════════════════════════════════════════════════════════
-- Procedimiento: Rechazar (eliminar) solicitud de registro
-- ═══════════════════════════════════════════════════════════
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_reject_user(
  IN p_user_id INT
)
BEGIN
  DELETE FROM users
  WHERE id = p_user_id AND pending = 1 AND active = 0;
  
  IF ROW_COUNT() > 0 THEN
    SELECT 'OK' AS status, 'Solicitud rechazada.' AS message;
  ELSE
    SELECT 'ERROR' AS status, 'Usuario no encontrado o ya procesado.' AS message;
  END IF;
END //

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_update_user(
  IN p_id       INT,
  IN p_name     VARCHAR(100),
  IN p_email    VARCHAR(150),
  IN p_role     VARCHAR(50),
  IN p_password VARCHAR(255),
  IN p_active   TINYINT
)
BEGIN
  -- Actualizar datos básicos
  UPDATE users 
  SET name = p_name, 
      email = p_email, 
      role = p_role, 
      active = p_active
  WHERE id = p_id;

  -- Actualizar contraseña solo si se envía
  IF p_password IS NOT NULL AND p_password != '' THEN
    UPDATE users SET password = p_password WHERE id = p_id;
  END IF;

  SELECT 'OK' AS status, 'Usuario actualizado.' AS message;
END //

DELIMITER ;


-- ═══════════════════════════════════════════════════════════
-- MÓDULO: Administración Usuarios
-- Tablas para gestión de datos maestros del sistema
-- ═══════════════════════════════════════════════════════════

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Admin Cuarteles/Parcelas
CREATE TABLE IF NOT EXISTS admin_cuarteles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Admin Labor
CREATE TABLE IF NOT EXISTS admin_labor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    faena_id INT,
    tipo VARCHAR(100) DEFAULT '',
    descripcion TEXT,
    unidad_medida VARCHAR(50) DEFAULT '',
    costo_unitario DECIMAL(12,2) DEFAULT 0,
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faena_id) REFERENCES admin_faenas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Admin Bodegas
CREATE TABLE IF NOT EXISTS admin_bodegas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    finca_id INT,
    ubicacion VARCHAR(255) DEFAULT '',
    capacidad VARCHAR(100) DEFAULT '',
    tipo VARCHAR(100) DEFAULT '',
    encargado VARCHAR(255) DEFAULT '',
    telefono VARCHAR(50) DEFAULT '',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (finca_id) REFERENCES admin_fincas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Admin Productos (Insumos/Herramientas)
CREATE TABLE IF NOT EXISTS admin_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria ENUM('Insumo', 'Herramienta', 'Otro') DEFAULT 'Insumo',
    bodega_id INT,
    unidad VARCHAR(50) DEFAULT 'unidades',
    precio DECIMAL(12,2) DEFAULT 0,
    stock DECIMAL(12,2) DEFAULT 0,
    proveedor VARCHAR(255) DEFAULT '',
    notas TEXT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bodega_id) REFERENCES admin_bodegas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ... (tablas 9-14 ya definidas antes)

-- 15. Insumos utilizados en Trabajo de Campo
CREATE TABLE IF NOT EXISTS trabajo_campo_insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES trabajo_campo_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES admin_productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Herramientas utilizadas en Trabajo de Campo
CREATE TABLE IF NOT EXISTS trabajo_campo_herramientas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_id INT NOT NULL,
    producto_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES trabajo_campo_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES admin_productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 13. Admin Contratos
CREATE TABLE IF NOT EXISTS admin_contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    numero_contrato VARCHAR(100) DEFAULT '',
    tipo_contrato VARCHAR(100) DEFAULT '',
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    salario_acordado DECIMAL(12,2) DEFAULT 0,
    estado ENUM('activo', 'vencido', 'cancelado') DEFAULT 'activo',
    notas TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Carga de Trabajo de Campo (Work Logs)
CREATE TABLE IF NOT EXISTS trabajo_campo_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    finca_id INT NOT NULL,
    predio_id INT NOT NULL,
    cuartel_id INT NOT NULL,
    faena_id INT NOT NULL,
    labor_id INT,
    empleado_id INT NOT NULL,
    cantidad DECIMAL(10,2) DEFAULT 0,
    unidad VARCHAR(50) DEFAULT 'horas',
    costo_unitario DECIMAL(12,2) DEFAULT 0,
    total_costo DECIMAL(12,2) DEFAULT 0,
    notas TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (finca_id) REFERENCES admin_fincas(id) ON DELETE CASCADE,
    FOREIGN KEY (predio_id) REFERENCES admin_predios(id) ON DELETE CASCADE,
    FOREIGN KEY (cuartel_id) REFERENCES admin_cuarteles(id) ON DELETE CASCADE,
    FOREIGN KEY (faena_id) REFERENCES admin_faenas(id) ON DELETE CASCADE,
    FOREIGN KEY (labor_id) REFERENCES admin_labor(id) ON DELETE SET NULL,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
