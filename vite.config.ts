import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { ROUTE_SEO, type RoutePath } from './src/config/seo';

// Read siteUrl from the single config file so it is edited in ONE place.
function siteUrl(): string {
  const src = readFileSync(new URL('./src/config/site.ts', import.meta.url), 'utf8');
  const m = src.match(/siteUrl:\s*'([^']+)'/);
  return (m?.[1] || '').replace(/\/$/, '');
}

const escAttr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Clone index.html for a route with its own title / description / canonical / OG / robots */
function routeHtml(html: string, path: RoutePath, url: string): string {
  const seo = ROUTE_SEO[path];
  const title = escAttr(seo.title.ar);
  const desc = escAttr(seo.description.ar);
  const canonical = `${url}${path === '/' ? '/' : path}`;
  // the hero-image preload only helps the home page
  const base = path === '/' ? html : html.replace(/\s*<link rel="preload" as="image"[^>]*>/g, '');
  return base
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, `$1${seo.noindex ? 'noindex, nofollow' : 'index, follow'}$2`);
}

/** Injects absolute URLs into index.html, pre-renders one HTML shell per route, emits sitemap.xml + robots.txt */
function seoFiles(): Plugin {
  return {
    name: 'muruj-seo-files',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', siteUrl());
    },
    generateBundle(_opts, bundle) {
      const url = siteUrl();
      // Per-route HTML shells (served by Vercel via "cleanUrls": /units → units.html)
      const index = bundle['index.html'];
      if (index && index.type === 'asset') {
        const html = String(index.source);
        index.source = routeHtml(html, '/', url);
        // lazy route chunks: preload each route's own JS in its HTML shell (removes the JS waterfall)
        const pageFile: Record<string, string> = {
          '/units': 'Units',
          '/gallery': 'Gallery',
          '/register': 'Register',
          '/contact': 'Contact',
          '/privacy': 'Privacy',
          '/thank-you': 'ThankYou',
        };
        for (const path of ['/units', '/gallery', '/register', '/contact', '/privacy', '/thank-you'] as const) {
          const chunk = Object.values(bundle).find(
            (c) => c.type === 'chunk' && c.facadeModuleId?.replace(/\\/g, '/').endsWith(`/src/pages/${pageFile[path]}.tsx`),
          );
          let out = routeHtml(html, path, url);
          if (chunk && chunk.type === 'chunk') {
            const files = [chunk.fileName, ...chunk.imports.filter((f) => !html.includes(f))];
            const links = files.map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`).join('\n    ');
            out = out.replace('</head>', `    ${links}\n  </head>`);
          }
          this.emitFile({ type: 'asset', fileName: `${path.slice(1)}.html`, source: out });
        }
      }
      const today = new Date().toISOString().slice(0, 10);
      const pages = [
        { loc: '/', priority: '1.0' },
        { loc: '/units', priority: '0.8' },
        { loc: '/gallery', priority: '0.8' },
        { loc: '/register', priority: '0.9' },
        { loc: '/contact', priority: '0.7' },
        { loc: '/privacy', priority: '0.3' },
      ];
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        pages.map((p) => `  <url><loc>${url}${p.loc}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${p.priority}</priority></url>`).join('\n') +
        `\n</urlset>\n`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /thank-you\nDisallow: /api/\n\nSitemap: ${url}/sitemap.xml\n`,
      });
    },
  };
}

// Only variables prefixed with VITE_ are exposed to the client bundle.
// SMTP_* / GOOGLE_* are read exclusively by the serverless functions in /api.
export default defineConfig({
  plugins: [react(), tailwindcss(), seoFiles()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    // `npm run dev` + `npm run api:local` → /api is proxied to the local API server (scripts/local-server.mjs)
    proxy: { '/api': { target: process.env.API_PROXY_TARGET || 'http://localhost:3000', changeOrigin: false } },
  },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          phone: ['libphonenumber-js', 'react-international-phone'],
        },
      },
    },
  },
});
