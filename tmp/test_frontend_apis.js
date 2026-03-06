import fs from 'fs';

const testUrls = [
    'http://localhost:10000/api/trabajo-campo-completo',
    'http://localhost:10000/api/admin-fincas',
    'http://localhost:10000/api/admin-predios',
    'http://localhost:10000/api/admin-cuarteles',
    'http://localhost:10000/api/admin-faenas',
    'http://localhost:10000/api/admin-labor',
    'http://localhost:10000/api/users',
    'http://localhost:10000/api/admin-productos'
];

async function run() {
    for (const url of testUrls) {
        try {
            const r = await fetch(url);
            const text = await r.text();
            try {
                const j = JSON.parse(text);
                console.log(`${url}: OK, Array? ${Array.isArray(j)}, length: ${j.length}`);
            } catch (e) {
                console.log(`${url}: FAIL TO PARSE JSON! Length: ${text.length}`);
                console.log(text.substring(0, 50));
            }
        } catch (err) {
            console.log(`${url}: FETCH FAILED!`, err.message);
        }
    }
}
run();
