import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Ensuring admin_productos category/bodega columns...');
        try {
            await conn.query(`ALTER TABLE admin_productos 
                MODIFY COLUMN categoria ENUM('Insumo', 'Herramienta', 'Otro') DEFAULT 'Insumo',
                ADD COLUMN bodega_id INT AFTER categoria,
                ADD CONSTRAINT fk_prod_bodega FOREIGN KEY (bodega_id) REFERENCES admin_bodegas(id) ON DELETE SET NULL
            `);
        } catch (e) { console.log('Columns might already exist.'); }

        console.log('Creating trabajo_campo_insumos...');
        await conn.query(`CREATE TABLE IF NOT EXISTS trabajo_campo_insumos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            log_id INT NOT NULL,
            producto_id INT NOT NULL,
            cantidad DECIMAL(12,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (log_id) REFERENCES trabajo_campo_logs(id) ON DELETE CASCADE,
            FOREIGN KEY (producto_id) REFERENCES admin_productos(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        console.log('Creating trabajo_campo_herramientas...');
        await conn.query(`CREATE TABLE IF NOT EXISTS trabajo_campo_herramientas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            log_id INT NOT NULL,
            producto_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (log_id) REFERENCES trabajo_campo_logs(id) ON DELETE CASCADE,
            FOREIGN KEY (producto_id) REFERENCES admin_productos(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

        console.log('✅ Base de datos actualizada para insumos y herramientas.');
    } catch (err) {
        console.error('❌ SQL Error:', err);
    } finally {
        await conn.end();
    }
};
run();
