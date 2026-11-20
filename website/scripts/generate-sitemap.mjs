import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rawSiteUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.SITE_URL ||
  process.env.VERCEL_URL;

if (!rawSiteUrl) {
  throw new Error(
    'Set SITE_URL to the canonical website URL before building the sitemap.',
  );
}

const siteUrl = new URL(
  rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`,
);
const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl.href}</loc></url>
  <url><loc>${new URL('/docs/', siteUrl).href}</loc></url>
</urlset>
`;
const robots = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', siteUrl).href}
`;

await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDir, 'sitemap.xml'), sitemap),
  writeFile(path.join(publicDir, 'robots.txt'), robots),
]);
