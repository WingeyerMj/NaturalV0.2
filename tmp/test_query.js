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

        const query = `
            SELECT l.*, 
                   f.nombre as finca_nombre, 
                   p.nombre as predio_nombre, 
                   c.numero as cuartel_numero,
                   fa.nombre as faena_nombre,
                   e.name as empleado_nombre
            FROM trabajo_campo_logs l
            LEFT JOIN admin_fincas f ON l.finca_id = f.id
            LEFT JOIN admin_predios p ON l.predio_id = p.id
            LEFT JOIN admin_cuarteles c ON l.cuartel_id = c.id
            LEFT JOIN admin_faenas fa ON l.faena_id = fa.id
            LEFT JOIN empleados e ON l.empleado_id = e.id
            WHERE l.status = 'active'
            ORDER BY l.fecha DESC, l.id DESC
        `;

        try {
            await connection.query(query);
            console.log("Query executed successfully!");
        } catch (e) {
            console.error("QUERY ERROR:", e.message);
        }

        await connection.end();
    } catch (err) {
        console.error(err);
    }
};
run();
