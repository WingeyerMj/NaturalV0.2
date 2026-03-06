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
        console.log('Adding finca_id to admin_bodegas if it doesn\'t exist...');
        // We can't use IF NOT EXISTS with ALTER TABLE directly in current MySQL without a procedure, 
        // but we can try to add it and ignore the error if it exists, or just query it first.
        const [columns] = await connection.query('SHOW COLUMNS FROM admin_bodegas LIKE "finca_id"');
        if (columns.length === 0) {
            await connection.query('ALTER TABLE admin_bodegas ADD COLUMN finca_id INT AFTER nombre');
            console.log('✅ Column finca_id added to admin_bodegas.');
        } else {
            console.log('ℹ️ Column finca_id already exists.');
        }
    } catch (err) {
        console.error('❌ SQL Error:', err);
    } finally {
        await connection.end();
    }
};
runSql();
