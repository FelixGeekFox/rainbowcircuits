# Pip's Post Office Worker

This Worker receives anonymous submissions from `/pips-post-office/`, stores notes and uploaded images in Cloudflare KV, and exposes a tiny admin API for Pip's Discord bot to poll.

## Secrets and resources

Do **not** commit secrets. Set them with Wrangler:

```powershell
wrangler kv namespace create PIP_POST_OFFICE_KV
wrangler secret put ADMIN_KEY
# Optional: alert a private Discord/mod channel when new mail arrives.
wrangler secret put DISCORD_WEBHOOK_URL
```

Paste the KV namespace ID into `wrangler.toml`. Keep `ADMIN_KEY` private and give it to the bot via its own `.env`.

Note: the first deployment uses KV for both metadata and images because R2 is not enabled on the account. Images are still stored with folder-like keys under `submissions/YYYY-MM/images/`. If R2 is enabled later, move image storage to an R2 binding.

## Deploy

```powershell
cd workers/pips-post-office
wrangler deploy
```

After deploy, set the site build environment variable:

```text
PUBLIC_PIP_POST_OFFICE_ENDPOINT=https://pips-post-office.<your-subdomain>.workers.dev/submit
```

If the site stays on GitHub Pages, add that env var to the GitHub Actions workflow or repository secrets/variables and expose it during `npm run build`.

## Bot API

List pending deliveries for the current UTC month:

```http
GET /deliveries
Authorization: Bearer <ADMIN_KEY>
```

Optional query parameters:

- `month=2026-07`
- `status=pending|delivered|all`
- `limit=1..100`

Fetch a private image:

```http
GET /image?key=<R2 object key>
Authorization: Bearer <ADMIN_KEY>
```

Mark a delivery as delivered:

```http
POST /deliveries/<submission-id>?month=2026-07
Authorization: Bearer <ADMIN_KEY>
```

The Worker deliberately does not store raw IP addresses. It keeps Cloudflare Ray/country/colo only for lightweight moderation context.
