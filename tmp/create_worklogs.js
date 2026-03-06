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
        console.log('Creating trabajo_campo_logs table...');
        await connection.query(`
      CREATE TABLE IF NOT EXISTS trabajo_campo_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fecha DATE NOT NULL,
          finca_id INT NOT NULL,
          predio_id INT NOT NULL,
          cuartel_id INT NOT NULL,
          faena_id INT NOT NULL,
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
          FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
        console.log('✅ Table trabajo_campo_logs created.');
    } catch (err) {
        console.error('❌ SQL Error:', err);
    } finally {
        await connection.end();
    }
};
runSql();
