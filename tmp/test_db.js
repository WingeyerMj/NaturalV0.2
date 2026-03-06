import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: 'naturalfood_db'
        });
        console.log('✅ Connected to database.');
        await connection.end();
    } catch (err) {
        console.error('❌ Connection error:', err);
    }
};
test();
