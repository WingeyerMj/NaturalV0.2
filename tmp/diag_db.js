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
        console.log('✅ Connected to database.');

        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables found:');
        console.table(tables.map(t => Object.values(t)[0]));

        await connection.end();
    } catch (err) {
        console.error('❌ Database error:', err.message);
    }
};
run();
