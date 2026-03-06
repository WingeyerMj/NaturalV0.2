import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const runSql = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'naturalfood_db'
    });

    try {
        console.log('Creating admin_contratos table...');
        await connection.query(`
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
    `);
        console.log('✅ Table admin_contratos created/updated.');
    } catch (err) {
        console.error('❌ SQL Error:', err);
    } finally {
        await connection.end();
    }
};
runSql();
