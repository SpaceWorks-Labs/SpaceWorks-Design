import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const mime = { '.html': 'text/html', '.css': 'text/css', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const port = Number(process.env.PORT || 4174);
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = resolve(root, '.' + pathname);
    const local = relative(root, target).replaceAll('\\', '/');
    if (local.startsWith('..') || !/^(examples\/web|tokens|fonts|logo)(\/|$)/.test(local)) { res.writeHead(403); res.end('Forbidden'); return; }
    const file = (await stat(target)).isDirectory() ? resolve(target, 'index.html') : target;
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': (mime[extname(file)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`First screen: http://localhost:${port}/examples/web/`));
