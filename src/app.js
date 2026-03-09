import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Configurar Proxy para la API de Sofia (Replicando comportamiento de Vite)
app.use('/sofia-api', createProxyMiddleware({
    target: 'http://apisofia.sofiagestionagricola.cl',
    changeOrigin: true,
    pathRewrite: {
        '^/sofia-api': '', // Quitar /sofia-api al enviar a la API real
    },
}));

// Serve static files from the "dist" directory
// Note: We use path.join to point to the build folder created by Vite
app.use(express.static(path.join(__dirname, '../dist')));

// ── TRABAJO DE CAMPO: Carga Completa ──
app.get('/api/trabajo-campo-completo', async (req, res) => {
    try {
        const query = `
            SELECT l.*, 
                   f.nombre as finca_nombre, 
                   p.nombre as predio_nombre, 
                   c.numero as cuartel_numero,
                   fa.nombre as faena_nombre,
                   la.nombre as labor_nombre,
                   e.name as empleado_nombre
            FROM trabajo_campo_logs l
            LEFT JOIN admin_fincas f ON l.finca_id = f.id
            LEFT JOIN admin_predios p ON l.predio_id = p.id
            LEFT JOIN admin_cuarteles c ON l.cuartel_id = c.id
            LEFT JOIN admin_faenas fa ON l.faena_id = fa.id
            LEFT JOIN admin_labor la ON l.labor_id = la.id
            LEFT JOIN empleados e ON l.empleado_id = e.id
            WHERE l.status = 'active'
            ORDER BY l.fecha DESC, l.id DESC
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Fetch trabajo-campo error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/trabajo-campo', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const { log, insumos, herramientas } = req.body;

        // 1. Insert Log
        const [logRes] = await conn.query(
            'INSERT INTO trabajo_campo_logs (fecha, finca_id, predio_id, cuartel_id, faena_id, labor_id, empleado_id, cantidad, unidad, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [log.fecha, log.finca_id, log.predio_id, log.cuartel_id, log.faena_id, log.labor_id, log.empleado_id, log.cantidad, log.unidad, log.notas]
        );
        const logId = logRes.insertId;

        // 2. Insert Insumos and Update Stock
        if (insumos && Array.isArray(insumos)) {
            for (const item of insumos) {
                await conn.query(
                    'INSERT INTO trabajo_campo_insumos (log_id, producto_id, cantidad) VALUES (?, ?, ?)',
                    [logId, item.producto_id, item.cantidad]
                );
                // Deduct Stock
                await conn.query(
                    'UPDATE admin_productos SET stock = stock - ? WHERE id = ?',
                    [item.cantidad, item.producto_id]
                );
            }
        }

        // 3. Insert Herramientas
        if (herramientas && Array.isArray(herramientas)) {
            for (const toolId of herramientas) {
                await conn.query(
                    'INSERT INTO trabajo_campo_herramientas (log_id, producto_id) VALUES (?, ?)',
                    [logId, toolId]
                );
            }
        }

        await conn.commit();
        res.json({ success: true, logId });
    } catch (error) {
        await conn.rollback();
        console.error('Work Log Error:', error);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        conn.release();
    }
});

// For any request that doesn't match a static file, serve index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
