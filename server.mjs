import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.json':'application/json' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) { res.writeHead(403).end(); return; }
    const content = await readFile(file);
    res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'}).end(content);
  } catch { res.writeHead(404).end('Not found'); }
});
server.listen(Number(process.env.PORT) || 3000, process.env.HOST || '0.0.0.0', () => console.log(`Servidor disponível na porta ${server.address().port}`));
