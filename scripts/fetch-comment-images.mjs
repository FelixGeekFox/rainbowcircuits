#!/usr/bin/env node
/**
 * One-off: download the image-comment attachments saved from a single
 * Reddit post (rc-gala-comments.json, produced in-browser) into the
 * issue gallery asset folder. Reddit's CDN URLs are signed but fetchable
 * server-side (no CORS), so node can grab them even though the page can't.
 *
 *   node scripts/fetch-comment-images.mjs <payload.json> [--issue issue-001]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const payloadPath = args.find((a) => !a.startsWith('--'));
const issue = (() => { const i = args.indexOf('--issue'); return i >= 0 ? args[i + 1] : 'issue-001'; })();
if (!payloadPath) { console.error('Usage: node scripts/fetch-comment-images.mjs <payload.json> [--issue issue-001]'); process.exit(1); }

const payload = JSON.parse(readFileSync(payloadPath, 'utf8'));
const assetDir = join(root, 'src', 'assets', issue, 'gallery-comments');
mkdirSync(assetDir, { recursive: true });

const results = [];
for (const img of payload.images) {
  const filename = `c-${img.cid}.${img.ext}`;
  const filePath = join(assetDir, filename);
  if (!existsSync(filePath)) {
    const res = await fetch(img.url, { headers: { 'User-Agent': 'rainbowcircuits-zine gallery importer' } });
    if (!res.ok) { console.warn(`FAILED ${filename}: HTTP ${res.status}`); continue; }
    writeFileSync(filePath, Buffer.from(await res.arrayBuffer()));
  }
  results.push({ key: `${issue}/gallery-comments/c-${img.cid}`, author: img.author, cid: img.cid, file: filename, w: img.width, h: img.height });
  console.log(`downloaded ${filename}  (u/${img.author})`);
}
writeFileSync(join(root, 'scripts', '.comment-images.json'), JSON.stringify(results, null, 2) + '\n');
console.log(`\n${results.length} image(s) → ${assetDir}`);
