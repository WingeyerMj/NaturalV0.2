-- ═══════════════════════════════════════════════════════════
-- MIGRACIÓN: Tablas de Negocio (NaturalFood)
-- ═══════════════════════════════════════════════════════════

USE naturalfood_db;

-- 1. Fincas
CREATE TABLE IF NOT EXISTS fincas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  hectares DECIMAL(10,2),
  status ENUM('active', 'inactive') DEFAULT 'active',
  manager VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Variedades
CREATE TABLE IF NOT EXISTS variedades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50),
  days_to_harvest INT,
  sugar_content VARCHAR(50),
  `usage` VARCHAR(100),
  status ENUM('active', 'inactive') DEFAULT 'active'
);

-- 3. Predios
CREATE TABLE IF NOT EXISTS predios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  finca_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  hectares DECIMAL(10,2),
  variety VARCHAR(100),
  irrigation_type VARCHAR(100),
  soil_type VARCHAR(100),
  status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
  FOREIGN KEY (finca_id) REFERENCES fincas(id) ON DELETE CASCADE
);

-- 4. Empleados
CREATE TABLE IF NOT EXISTS empleados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  legajo VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  dni VARCHAR(20),
  position VARCHAR(100),
  finca VARCHAR(100), -- Manteniendo como texto para consistencia con modelo actual
  start_date DATE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  salary DECIMAL(12,2)
);

-- 5. Labores
CREATE TABLE IF NOT EXISTS labores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  type VARCHAR(100),
  predio_name VARCHAR(100), -- Usamos nombres por ahora para match rápido con el CSV/Mock
  finca_name VARCHAR(100),
  employee_name VARCHAR(100),
  hours DECIMAL(5,2),
  notes TEXT,
  status ENUM('completed', 'pending') DEFAULT 'pending'
);

-- 6. Presupuestos
CREATE TABLE IF NOT EXISTS presupuestos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  planned DECIMAL(15,2),
  executed DECIMAL(15,2),
  month VARCHAR(50)
);

-- 7. Aplicaciones
CREATE TABLE IF NOT EXISTS aplicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product VARCHAR(100) NOT NULL,
  dose VARCHAR(50),
  predio VARCHAR(100),
  date DATE,
  status ENUM('applied', 'pending', 'scheduled') DEFAULT 'pending',
  engineer VARCHAR(100)
);

-- 8. Notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  message TEXT,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  time_label VARCHAR(50), -- "Hace 2 horas", etc.
  is_read TINYINT DEFAULT 0,
  action_type VARCHAR(50),
  action_user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════
-- DATA SEEDING (Desde DataModels.js)
-- ═══════════════════════════════════════════════════════════

INSERT INTO fincas (id, name, location, hectares, status, manager) VALUES
(1, 'Finca La Esperanza', 'San Martín, Mendoza', 120, 'active', 'Carlos Mendoza'),
(2, 'Finca El Sol', 'Junín, Mendoza', 85, 'active', 'Laura Vásquez'),
(3, 'Finca Las Viñas', 'Rivadavia, San Juan', 200, 'active', 'Carlos Mendoza'),
(4, 'Finca San Pedro', 'San Rafael, Mendoza', 65, 'inactive', 'Roberto Díaz'),
(5, 'Finca Valle Grande', 'Caucete, San Juan', 150, 'active', 'Laura Vásquez')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO variedades (name, type, days_to_harvest, sugar_content, `usage`, status) VALUES
('Flame Seedless', 'Roja', 115, '18-20°Brix', 'Pasa / Mesa', 'active'),
('Superior Seedless', 'Verde', 120, '16-18°Brix', 'Mesa', 'active'),
('Sultanina', 'Verde', 110, '20-22°Brix', 'Pasa', 'active'),
('Crimson Seedless', 'Roja', 130, '17-19°Brix', 'Mesa / Pasa', 'active'),
('Thompson Seedless', 'Verde', 105, '19-22°Brix', 'Pasa', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO predios (id, finca_id, name, hectares, variety, irrigation_type, soil_type, status) VALUES
(1, 1, 'Parcela Norte A', 15, 'Flame Seedless', 'Goteo', 'Franco-arenoso', 'active'),
(2, 1, 'Parcela Norte B', 18, 'Superior Seedless', 'Goteo', 'Franco', 'active'),
(3, 1, 'Parcela Sur A', 12, 'Sultanina', 'Aspersión', 'Franco-arcilloso', 'active'),
(4, 2, 'Sector Este 1', 20, 'Flame Seedless', 'Goteo', 'Arenoso', 'active'),
(5, 2, 'Sector Oeste 1', 22, 'Crimson Seedless', 'Goteo', 'Franco', 'active'),
(6, 3, 'Lote 1', 25, 'Sultanina', 'Surco', 'Franco-arenoso', 'active'),
(7, 3, 'Lote 2', 30, 'Flame Seedless', 'Goteo', 'Franco', 'active'),
(8, 3, 'Lote 3', 28, 'Superior Seedless', 'Goteo', 'Arcilloso', 'pending'),
(9, 5, 'Area Central', 35, 'Crimson Seedless', 'Goteo', 'Franco-arenoso', 'active'),
(10, 5, 'Area Sur', 40, 'Sultanina', 'Aspersión', 'Franco', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO empleados (id, legajo, name, dni, position, finca, start_date, status, salary) VALUES
(1, 'EMP-001', 'Pedro Sánchez', '30245678', 'Capataz', 'Finca La Esperanza', '2020-03-15', 'active', 280000),
(2, 'EMP-002', 'Miguel Ángel Torres', '32456789', 'Peón Rural', 'Finca La Esperanza', '2021-06-01', 'active', 220000),
(3, 'EMP-003', 'Rosa Fernández', '28345612', 'Encargada de Poda', 'Finca El Sol', '2019-11-20', 'active', 250000),
(4, 'EMP-004', 'Diego López', '35678901', 'Peón Rural', 'Finca Las Viñas', '2022-01-10', 'active', 220000),
(5, 'EMP-005', 'Lucía Morales', '31098765', 'Técnica Agrónoma', 'Finca Valle Grande', '2020-08-05', 'active', 320000)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO labores (date, type, predio_name, finca_name, employee_name, hours, notes, status) VALUES
('2026-02-10', 'Poda', 'Parcela Norte A', 'Finca La Esperanza', 'Pedro Sánchez', 8, 'Poda de formación completada', 'completed'),
('2026-02-10', 'Riego', 'Sector Este 1', 'Finca El Sol', 'Rosa Fernández', 6, 'Riego por goteo - turno mañana', 'completed'),
('2026-02-09', 'Fumigación', 'Lote 1', 'Finca Las Viñas', 'Diego López', 7, 'Aplicación de fungicida preventivo', 'completed')
ON DUPLICATE KEY UPDATE type=VALUES(type);

INSERT INTO presupuestos (category, planned, executed, month) VALUES
('Mano de Obra', 2500000, 2180000, 'Enero 2026'),
('Insumos Agroquímicos', 1800000, 1950000, 'Enero 2026'),
('Riego y Energía', 800000, 720000, 'Enero 2026')
ON DUPLICATE KEY UPDATE category=VALUES(category);
