import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

// Plugin to serve project-root /Fuentes as static files
function serveFuentesPlugin() {
    const fuentesDir = path.resolve(__dirname, 'Fuentes');
    return {
        name: 'serve-fuentes',
        configureServer(server) {
            server.middlewares.use('/Fuentes', (req, res, next) => {
                const filePath = path.join(fuentesDir, decodeURIComponent(req.url.split('?')[0]));
                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                    res.setHeader('Cache-Control', 'no-cache');
                    fs.createReadStream(filePath).pipe(res);
                } else {
                    next();
                }
            });
        },
        // Copy Fuentes into dist during build
        closeBundle() {
            const distFuentes = path.resolve(__dirname, 'dist', 'Fuentes');
            if (!fs.existsSync(distFuentes)) fs.mkdirSync(distFuentes, { recursive: true });
            const files = fs.readdirSync(fuentesDir);
            for (const file of files) {
                const src = path.join(fuentesDir, file);
                if (fs.statSync(src).isFile()) {
                    fs.copyFileSync(src, path.join(distFuentes, file));
                }
            }
            console.log(`[serve-fuentes] Copied ${files.length} files to dist/Fuentes`);
        }
    };
}

export default defineConfig({
    plugins: [serveFuentesPlugin()],
    server: {
        proxy: {
            '/sofia-api': {
                target: 'http://apisofia.sofiagestionagricola.cl',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/sofia-api/, '')
            }
        }
    },
    preview: {
        allowedHosts: ['proyectonatura.onrender.com']
    }
})
