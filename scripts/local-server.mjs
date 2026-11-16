/**
 * Local test server (alternative to `vercel dev` when you are not logged in to Vercel).
 *  - serves the production build from /dist with SPA fallback
 *  - bundles /api/*.ts with esbuild and runs them with a Vercel-like req/res
 *
 * Usage:  npm run build && node scripts/local-server.mjs   (reads .env if present)
 */
import http from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';

const root = resolve(new URL('..', import.meta.url).pathname);
const dist = join(root, 'dist');
const PORT = Number(process.env.PORT || 3000);

// minimal .env loader
if (existsSync(join(root, '.env'))) {
  for (const line of readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

const outDir = join(root, 'node_modules', '.local-api');
mkdirSync(outDir, { recursive: true });
const handlers = {};
for (const name of ['lead', 'health']) {
  const outfile = join(outDir, `${name}.mjs`);
  await build({ entryPoints: [join(root, 'api', `${name}.ts`)], bundle: true, platform: 'node', format: 'esm', target: 'node20', outfile, packages: 'external', logLevel: 'error' });
  handlers[name] = (await import(pathToFileURL(outfile).href + `?t=${Date.now()}`)).default;
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.woff2': 'font/woff2' };

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith('/api/')) {
      const name = url.pathname.slice(5).replace(/\/$/, '');
      const fn = handlers[name];
      if (!fn) return res.writeHead(404).end('not found');
      let raw = '';
      for await (const c of req) raw += c;
      try {
        req.body = raw && (req.headers['content-type'] || '').includes('json') ? JSON.parse(raw) : raw;
      } catch {
        req.body = raw;
      }
      req.query = Object.fromEntries(url.searchParams);
      res.status = (c) => ((res.statusCode = c), res);
      res.json = (o) => (res.setHeader('Content-Type', 'application/json'), res.end(JSON.stringify(o)), res);
      res.send = (b) => (res.end(b), res);
      try {
        await fn(req, res);
      } catch (e) {
        console.error(e);
        if (!res.headersSent) res.status(500).json({ success: false });
      }
      return;
    }
    let file = join(dist, decodeURIComponent(url.pathname));
    // mimic Vercel "cleanUrls": /units → units.html, then SPA fallback to index.html
    if (existsSync(file + '.html')) file = file + '.html';
    if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) file = join(dist, 'index.html');
    const type = MIME[extname(file)] || 'application/octet-stream';
    let body = readFileSync(file);
    const headers = { 'Content-Type': type };
    if (file.includes('/assets/') || file.includes('/images/') || file.includes('/fonts/')) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    // gzip text assets like Vercel does
    if (/text|javascript|xml|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) {
      body = gzipSync(body);
      headers['Content-Encoding'] = 'gzip';
    }
    res.writeHead(200, headers);
    res.end(body);
  })
  .listen(PORT, '0.0.0.0', () => console.log(`Local server: http://localhost:${PORT}`));
