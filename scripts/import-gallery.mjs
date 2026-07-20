#!/usr/bin/env node
/**
 * Gallery importer — turns a saved Reddit listing JSON into gallery
 * entries with member credits.
 *
 * r/RainbowCircuits is private, so the listing must come from a
 * logged-in session. Easiest way to get it:
 *   1. In your browser (logged in to Reddit), visit:
 *        https://www.reddit.com/r/RainbowCircuits/new.json?limit=100
 *      (or search.json?q=flair%3AGala&restrict_sr=1&limit=100 for one flair)
 *   2. Save the page (Ctrl+S) as listing.json
 *   3. Run:
 *        node scripts/import-gallery.mjs listing.json --issue issue-001 [--flair Gala]
 *
 * What it does:
 *   - keeps only image posts (direct images and Reddit galleries)
 *   - downloads each image to src/assets/<issue>/gallery/<postid>-<n>.<ext>
 *   - merges entries into src/content/gallery/<issue>.json:
 *       title      ← post title
 *       member     ← u/<author>
 *       creditUrl  ← permalink to the original post
 *       alt        ← "" (fill in by hand — the build makes missing alt obvious)
 *   - never duplicates: posts already present (by creditUrl) are skipped
 *
 * Image URLs on Reddit's CDN are usually fetchable without auth even for
 * private subs; any download that fails is reported so it can be saved
 * manually into the same folder.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ── args ─────────────────────────────────────────────────────
const args = process.argv.slice(2);
const listingPath = args.find((a) => !a.startsWith('--'));
const issue = valueOf('--issue') ?? 'issue-001';
const flair = valueOf('--flair');
/** Keep the zine an edited selection: cap images taken from one post. */
const maxPerPost = Number(valueOf('--max-per-post') ?? Infinity);
function valueOf(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}
if (!listingPath) {
  console.error('Usage: node scripts/import-gallery.mjs <listing.json> [--issue issue-001] [--flair Gala]');
  process.exit(1);
}

// ── parse listing ────────────────────────────────────────────
const listing = JSON.parse(readFileSync(listingPath, 'utf8'));
const children = listing?.data?.children ?? [];
if (children.length === 0) {
  console.error('No posts found in the listing — is this a saved Reddit .json page?');
  process.exit(1);
}

const unescape = (u) => u.replaceAll('&amp;', '&');

const posts = [];
for (const child of children) {
  const p = child.data;
  if (flair && (p.link_flair_text ?? '').toLowerCase() !== flair.toLowerCase()) continue;

  const images = [];
  if (p.is_gallery && p.media_metadata) {
    const order = (p.gallery_data?.items ?? []).map((item) => item.media_id);
    for (const id of order.length ? order : Object.keys(p.media_metadata)) {
      const meta = p.media_metadata[id];
      if (meta?.status === 'valid' && meta.s) {
        const url = meta.s.u ?? meta.s.gif;
        if (url) images.push(unescape(url));
      }
    }
  } else if (p.post_hint === 'image' || /\.(png|jpe?g|webp|gif)$/i.test(p.url ?? '')) {
    images.push(unescape(p.url_overridden_by_dest ?? p.url));
  } else if (p.preview?.images?.[0]?.source?.url) {
    images.push(unescape(p.preview.images[0].source.url));
  }
  if (images.length === 0) continue;

  posts.push({
    id: p.id,
    title: p.title,
    author: p.author,
    permalink: `https://www.reddit.com${p.permalink}`,
    flair: p.link_flair_text ?? null,
    nsfw: Boolean(p.over_18),
    images,
  });
}

console.log(`Found ${posts.length} image post(s)${flair ? ` with flair "${flair}"` : ''}.`);

// ── load existing gallery ────────────────────────────────────
const galleryPath = join(root, 'src', 'content', 'gallery', `${issue}.json`);
const gallery = existsSync(galleryPath)
  ? JSON.parse(readFileSync(galleryPath, 'utf8'))
  : { issue, initiallyVisible: 6, items: [] };
const known = new Set(gallery.items.map((item) => item.creditUrl).filter(Boolean));

// ── download images & build entries ──────────────────────────
const assetDir = join(root, 'src', 'assets', issue, 'gallery');
mkdirSync(assetDir, { recursive: true });

let added = 0;
const failures = [];
for (const post of posts) {
  if (known.has(post.permalink)) {
    console.log(`  skip (already imported): ${post.title}`);
    continue;
  }
  const takenCount = Math.min(post.images.length, maxPerPost);
  for (let n = 0; n < takenCount; n++) {
    const url = post.images[n];
    const ext = (new URL(url).pathname.match(/\.(png|jpe?g|webp|gif)$/i)?.[1] ?? 'jpg').toLowerCase();
    const filename = post.images.length > 1 ? `${post.id}-${n + 1}.${ext}` : `${post.id}.${ext}`;
    const filePath = join(assetDir, filename);

    if (!existsSync(filePath)) {
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'rainbowcircuits-zine gallery importer' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        writeFileSync(filePath, Buffer.from(await res.arrayBuffer()));
        console.log(`  downloaded ${filename} (${post.title} — u/${post.author})`);
      } catch (error) {
        failures.push({ url, filename, post: post.title });
        console.warn(`  FAILED ${filename}: ${error.message} — save it manually to src/assets/${issue}/gallery/`);
      }
    }

    gallery.items.push({
      // Serviceable default alt from the post context — replace with a
      // real description of the image where possible.
      image: `${issue}/gallery/${filename.replace(/\.[^.]+$/, '')}`,
      alt: `“${post.title}” — shared by u/${post.author}${takenCount > 1 ? ` (image ${n + 1} of ${takenCount})` : ''}`,
      title: post.title,
      member: `u/${post.author}`,
      caption:
        post.images.length > takenCount
          ? `A selection — see the original post for all ${post.images.length} images`
          : takenCount > 1
            ? `${n + 1} of ${takenCount}`
            : undefined,
      creditUrl: post.permalink,
      nsfw: post.nsfw || undefined,
      placeholder: false,
    });
    added++;
  }
  known.add(post.permalink);
}

// drop empty placeholder rows once real entries exist
if (added > 0) {
  gallery.items = gallery.items.filter((item) => !(item.placeholder && item.member?.startsWith('[')));
}

writeFileSync(galleryPath, JSON.stringify(gallery, null, 2) + '\n');
console.log(`\nAdded ${added} gallery entr${added === 1 ? 'y' : 'ies'} → ${galleryPath}`);
if (failures.length) {
  console.log(`${failures.length} download(s) failed — save those images manually, keeping the same filenames.`);
}
console.log('Remember: fill in each "alt" field before publishing.');
