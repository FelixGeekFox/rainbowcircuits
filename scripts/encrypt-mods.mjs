#!/usr/bin/env node
/**
 * Encrypt the moderator guide for the locked /mods/ page.
 *
 * Only the CIPHERTEXT is committed to the (public) repo. The plaintext
 * source lives in mod-content/mod-guide.html, which is gitignored and
 * never leaves your machine.
 *
 * Crypto: PBKDF2 (SHA-256, 250k iterations) derives an AES-256-GCM key
 * from your passcode. GCM's auth tag means a wrong passcode fails loudly
 * instead of returning garbage.
 *
 * Usage (PowerShell):
 *   $env:MOD_PASSCODE = "your team passphrase"
 *   npm run encrypt-mods
 *
 * Usage (bash):
 *   MOD_PASSCODE="your team passphrase" npm run encrypt-mods
 *
 * Then commit + push the updated src/content/protected/mod-guide.enc.json.
 * Anyone visiting /mods/ needs the passphrase to read the guide.
 *
 * Options:
 *   --source <file>   plaintext to encrypt (default mod-content/mod-guide.html)
 *   --out <file>      output blob (default src/content/protected/mod-guide.enc.json)
 *   --passcode <s>    passcode (prefer the MOD_PASSCODE env var so it stays
 *                     out of your shell history)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const source = opt('--source') ?? 'mod-content/mod-guide.html';
const out = opt('--out') ?? 'src/content/protected/mod-guide.enc.json';
const passcode = process.env.MOD_PASSCODE ?? opt('--passcode');
const ITERATIONS = 250_000;

if (!passcode) {
  console.error('No passcode. Set the MOD_PASSCODE environment variable (recommended) or pass --passcode "…".');
  process.exit(1);
}
const sourcePath = join(root, source);
if (!existsSync(sourcePath)) {
  console.error(`Source file not found: ${source}\nCreate it (your local, gitignored plaintext) and try again.`);
  process.exit(1);
}

const plaintext = readFileSync(sourcePath, 'utf8');
const encoder = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));

const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(passcode), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  keyMaterial,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);
const ciphertext = new Uint8Array(
  await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(plaintext)),
);

const b64 = (bytes) => Buffer.from(bytes).toString('base64');
const blob = {
  v: 1,
  kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: ITERATIONS },
  salt: b64(salt),
  iv: b64(iv),
  ciphertext: b64(ciphertext),
};

const outPath = join(root, out);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(blob, null, 2) + '\n');
console.log(`Encrypted ${source} (${plaintext.length} chars) → ${out}`);
console.log('Commit and push that file to publish. Keep your passcode safe — it is the only key.');
