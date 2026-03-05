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
}); app.use('/sofia-api', createProxyMiddleware({
    target: 'http://apisofia.sofiagestionagricola.cl',
    changeOrigin: true,
    pathRewrite: {
        '^/sofia-api': '', // Quitar /sofia-api al enviar a la API real
    },
}));

// Serve static files from the "dist" directory
// Note: We use path.join to point to the build folder created by Vite
app.use(express.static(path.join(__dirname, '../dist')));

// For any request that doesn't match a static file, serve index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
