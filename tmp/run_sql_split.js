import mysql from 'mysql2/promise';
import fs from 'fs';
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
        const sqlPath = "c:\\Users\\usuario\\Desktop\\Antigravity\\NaturalV0.5\\Fuentes\\naturalfood_db.sql";
        console.log(`Reading SQL from: ${sqlPath}`);
        let content = fs.readFileSync(sqlPath, 'utf8');

        // Remove comments and DELIMITER markers
        content = content.replace(/\/\*[\s\S]*?\*\/|--.*?\n/g, '');
        content = content.replace(/DELIMITER[\s\S]*?DELIMITER/g, ''); // Skip procedures for now as they are complex to split

        // Split by semicolon that is not inside quotes
        const statements = content.split(/;(?=(?:[^'"`]*['"`][^'"`]*['"`])*[^'"`]*$)/g)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Execution started (${statements.length} statements)...`);
        for (const stmt of statements) {
            try {
                await connection.query(stmt);
            } catch (e) {
                console.error(`❌ Error in STATEMENT: ${stmt.slice(0, 50)}...`);
                console.error(e.message);
            }
        }
        console.log('✅ Base de datos configurada.');
    } catch (err) {
        console.error('❌ Error general:', err);
    } finally {
        await connection.end();
    }
};
runSql();
