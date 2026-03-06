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

        console.log("Renaming nombre to numero in admin_cuarteles...");
        await connection.query('ALTER TABLE admin_cuarteles CHANGE nombre numero INT NOT NULL');
        console.log("Success");

        await connection.end();
    } catch (err) {
        console.error(err);
    }
};
run();
