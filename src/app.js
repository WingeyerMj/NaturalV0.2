import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { createProxyMiddleware } from 'http-proxy-middleware';

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

// For any request that doesn't match a static file, serve index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
