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

// -- Middleware --
app.use(cors());
app.use(express.json());

// -- Auth API Endpoints --

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [results] = await pool.query('CALL sp_authenticate(?, ?)', [email, password]);
        const statusData = results[0][0];

        if (statusData.status === 'OK') {
            // Success: User data is in the same row
            const { status, ...user } = statusData;
            res.json({ success: true, user });
        } else if (statusData.status === 'PENDING') {
            res.json({ success: false, pending: true, message: statusData.message });
        } else {
            res.status(401).json({ success: false, message: statusData.message });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Register
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [results] = await pool.query('CALL sp_register_user(?, ?, ?)', [name, email, password]);
        const statusData = results[0][0];

        if (statusData.status === 'OK') {
            res.json({ success: true, message: statusData.message });
        } else {
            res.status(400).json({ success: false, message: statusData.message });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get Users (Active or Pending)
app.get('/api/users', async (req, res) => {
    const { includePending } = req.query;
    try {
        let query = 'SELECT id, name, email, role, avatar, active, pending, registered_at FROM users';
        if (includePending !== 'true') {
            query += ' WHERE active = 1';
        }
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Approve User
app.post('/api/users/approve', async (req, res) => {
    const { id } = req.body;
    try {
        const [results] = await pool.query('CALL sp_approve_user(?)', [id]);
        const statusData = results[0][0];

        if (statusData.status === 'OK') {
            res.json({ success: true, message: statusData.message });
        } else {
            res.status(400).json({ success: false, message: statusData.message });
        }
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Reject User
app.post('/api/users/reject', async (req, res) => {
    const { id } = req.body;
    try {
        const [results] = await pool.query('CALL sp_reject_user(?)', [id]);
        const statusData = results[0][0];

        if (statusData.status === 'OK') {
            res.json({ success: true, message: statusData.message });
        } else {
            res.status(400).json({ success: false, message: statusData.message });
        }
    } catch (error) {
        console.error('Reject user error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update User (Full edit)
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password, active } = req.body;
    try {
        const [results] = await pool.query('CALL sp_update_user(?, ?, ?, ?, ?, ?)', [
            id, name, email, role, password || null, active ? 1 : 0
        ]);
        res.json({ success: true, message: 'Usuario actualizado con éxito.' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// -- Business API Endpoints --

// Fincas
app.get('/api/fincas', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM fincas WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        console.error('Fetch fincas error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Predios
app.get('/api/predios', async (req, res) => {
    const { fincaId } = req.query;
    try {
        let query = 'SELECT * FROM predios WHERE status != "inactive"';
        const params = [];
        if (fincaId) {
            query += ' AND finca_id = ?';
            params.push(fincaId);
        }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Fetch predios error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Variedades
app.get('/api/variedades', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM variedades WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        console.error('Fetch variedades error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Empleados
app.get('/api/empleados', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empleados WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        console.error('Fetch empleados error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Labores
app.get('/api/labores', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM labores ORDER BY date DESC');
        res.json(rows);
    } catch (error) {
        console.error('Fetch labores error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Presupuestos
app.get('/api/presupuestos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM presupuestos');
        res.json(rows);
    } catch (error) {
        console.error('Fetch presupuestos error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Aplicaciones
app.get('/api/aplicaciones', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM aplicaciones');
        res.json(rows);
    } catch (error) {
        console.error('Fetch aplicaciones error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// ═══════════════════════════════════════════════════════════
// MÓDULO: Administración Usuarios - CRUD Genérico
// ═══════════════════════════════════════════════════════════

const ADMIN_TABLES = [
    'admin_fincas',
    'admin_predios',
    'admin_cuarteles',
    'admin_faenas',
    'admin_labor',
    'empleados',
    'admin_bodegas',
    'admin_productos',
    'admin_institucional',
    'admin_zonas_riego',
    'admin_sistema_riego',
    'admin_planificacion',
    'admin_contratos',
    'trabajo_campo_logs'
];

// Generate CRUD routes for each admin table
ADMIN_TABLES.forEach(tableName => {
    const route = `/api/${tableName.replace(/_/g, '-')}`;

    // GET all (active only by default, ?all=true for all)
    app.get(route, async (req, res) => {
        try {
            const showAll = req.query.all === 'true';
            const query = showAll
                ? `SELECT * FROM ${tableName} ORDER BY id DESC`
                : `SELECT * FROM ${tableName} WHERE status = 'active' ORDER BY id DESC`;
            const [rows] = await pool.query(query);
            res.json(rows);
        } catch (error) {
            console.error(`Fetch ${tableName} error:`, error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });

    // GET by id
    app.get(`${route}/:id`, async (req, res) => {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [req.params.id]);
            if (rows.length === 0) return res.status(404).json({ success: false, message: 'No encontrado' });
            res.json(rows[0]);
        } catch (error) {
            console.error(`Fetch ${tableName} by id error:`, error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });

    // POST create
    app.post(route, async (req, res) => {
        try {
            const data = { ...req.body };
            delete data.id;
            delete data.created_at;
            delete data.updated_at;

            const keys = Object.keys(data);
            const values = Object.values(data);
            const placeholders = keys.map(() => '?').join(', ');

            const [result] = await pool.query(
                `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
                values
            );
            res.json({ success: true, id: result.insertId, message: 'Registro creado exitosamente.' });
        } catch (error) {
            console.error(`Create ${tableName} error:`, error);
            res.status(500).json({ success: false, message: 'Error al crear registro: ' + error.message });
        }
    });

    // PUT update
    app.put(`${route}/:id`, async (req, res) => {
        try {
            const data = { ...req.body };
            delete data.id;
            delete data.created_at;
            delete data.updated_at;

            const keys = Object.keys(data);
            const values = Object.values(data);
            const setClause = keys.map(k => `${k} = ?`).join(', ');

            await pool.query(
                `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
                [...values, req.params.id]
            );
            res.json({ success: true, message: 'Registro actualizado exitosamente.' });
        } catch (error) {
            console.error(`Update ${tableName} error:`, error);
            res.status(500).json({ success: false, message: 'Error al actualizar registro: ' + error.message });
        }
    });

    // DELETE (soft delete - set status to inactive)
    app.delete(`${route}/:id`, async (req, res) => {
        try {
            await pool.query(`UPDATE ${tableName} SET status = 'inactive' WHERE id = ?`, [req.params.id]);
            res.json({ success: true, message: 'Registro eliminado exitosamente.' });
        } catch (error) {
            console.error(`Delete ${tableName} error:`, error);
            res.status(500).json({ success: false, message: 'Error al eliminar registro: ' + error.message });
        }
    });
});

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
