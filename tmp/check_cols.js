import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const tables = ['admin_fincas', 'admin_bodegas', 'admin_predios', 'admin_cuarteles'];
        for (const table of tables) {
            const [cols] = await connection.query(`SHOW COLUMNS FROM ${table}`);
            console.log(`\nTable: ${table}`);
            console.table(cols.map(c => ({ Field: c.Field, Type: c.Type })));
        }
        await connection.end();
    } catch (err) {
        console.error(err);
    }
};
test();
