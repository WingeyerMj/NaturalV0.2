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

        const [cols] = await connection.query('SHOW COLUMNS FROM trabajo_campo_logs');
        console.log(cols);
        await connection.end();
    } catch (err) {
        console.error(err);
    }
};
run();
