import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const runSql = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        const sqlPath = "c:\\Users\\usuario\\Desktop\\Antigravity\\NaturalV0.5\\Fuentes\\naturalfood_db.sql";
        console.log(`Leyendo SQL de: ${sqlPath}`);
        let sql = fs.readFileSync(sqlPath, 'utf8');

        // Remover comandos DELIMITER que mysql2 no soporta nativamente en múltiples statements
        sql = sql.replace(/DELIMITER \/\/|DELIMITER ;/g, '');

        console.log('Aplicando SQL a la base de datos...');
        await connection.query(sql);
        console.log('✅ Base de datos actualizada con éxito.');
    } catch (err) {
        console.error('❌ Error al actualizar la base de datos:', err);
    } finally {
        await connection.end();
    }
};

runSql();
