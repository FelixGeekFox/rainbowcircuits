#!/usr/bin/env node
/**
 * Sync Discord scheduled events → src/data/discord-events.json
 *
 * Runs in CI (see .github/workflows/deploy.yml) before the Astro build, so
 * the calendar page is baked with the latest events on every deploy and on
 * an hourly schedule. The bot token stays a CI secret and never reaches the
 * browser.
 *
 * Setup (one-time):
 *   1. Create a Discord application + bot at https://discord.com/developers
 *   2. Invite the bot to the server (no special permissions needed — any
 *      member can read scheduled events; the bot just has to be present).
 *   3. Add repo secrets:  DISCORD_BOT_TOKEN  and  DISCORD_GUILD_ID
 *
 * Behaviour:
 *   - No token/guild configured → leaves the committed JSON untouched and
 *     exits 0 (so the site still builds; the calendar shows its empty state).
 *   - API error → keeps the existing JSON and exits 0 (last-known-good).
 *   - Success → writes only scheduled/active events, soonest first.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src', 'data', 'discord-events.json');

const token = process.env.DISCORD_BOT_TOKEN?.trim();
const guildId = process.env.DISCORD_GUILD_ID?.trim();

if (!token || !guildId) {
  console.warn('[discord] DISCORD_BOT_TOKEN / DISCORD_GUILD_ID not set — keeping existing calendar data.');
  process.exit(0);
}

// entity_type: 1 STAGE_INSTANCE, 2 VOICE, 3 EXTERNAL
const locationFor = (e) =>
  e.entity_metadata?.location ||
  (e.entity_type === 2 ? 'Discord · Voice' : e.entity_type === 1 ? 'Discord · Stage' : 'Discord');

try {
  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/scheduled-events?with_user_count=false`,
    { headers: { Authorization: `Bot ${token}`, 'User-Agent': 'rainbowcircuits.org calendar sync' } },
  );
  if (!res.ok) throw new Error(`Discord API HTTP ${res.status} — ${await res.text().catch(() => '')}`);
  const raw = await res.json();

  const events = raw
    // status: 1 SCHEDULED, 2 ACTIVE, 3 COMPLETED, 4 CANCELED
    .filter((e) => e.status === 1 || e.status === 2)
    .map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description ?? '',
      start: e.scheduled_start_time,
      end: e.scheduled_end_time ?? null,
      location: locationFor(e),
      coverUrl: e.image ? `https://cdn.discordapp.com/guild-events/${e.id}/${e.image}.png?size=1024` : null,
      url: `https://discord.com/events/${guildId}/${e.id}`,
    }))
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  const payload = { guildId, updatedAt: new Date().toISOString(), events };
  writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');
  console.log(`[discord] wrote ${events.length} upcoming event(s) → ${outPath}`);
} catch (error) {
  // Keep the last-known-good file so a transient API problem never breaks a deploy.
  let existing = 0;
  try { existing = JSON.parse(readFileSync(outPath, 'utf8')).events?.length ?? 0; } catch {}
  console.error(`[discord] sync failed (${error.message}) — keeping existing ${existing} event(s).`);
  process.exit(0);
}
