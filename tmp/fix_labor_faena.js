import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: 'naturalfood_db'
        });

        console.log("Adding faena_id to admin_labor...");
        try {
            await connection.query('ALTER TABLE admin_labor ADD COLUMN faena_id INT AFTER nombre');
            await connection.query('ALTER TABLE admin_labor ADD CONSTRAINT fk_labor_faena FOREIGN KEY (faena_id) REFERENCES admin_faenas(id) ON DELETE SET NULL');
            console.log("Success admin_labor");
        } catch (e) { console.log(e.message); }

        console.log("Adding labor_id to trabajo_campo_logs...");
        try {
            await connection.query('ALTER TABLE trabajo_campo_logs ADD COLUMN labor_id INT AFTER faena_id');
            await connection.query('ALTER TABLE trabajo_campo_logs ADD CONSTRAINT fk_log_labor FOREIGN KEY (labor_id) REFERENCES admin_labor(id) ON DELETE SET NULL');
            console.log("Success trabajo_campo_logs");
        } catch (e) { console.log(e.message); }

        await connection.end();
    } catch (err) {
        console.error(err);
    }
};
run();
