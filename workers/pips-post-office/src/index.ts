export interface Env {
  PIP_POST_OFFICE_KV: KVNamespace;
  ADMIN_KEY: string;
  ALLOWED_ORIGIN?: string;
  DISCORD_WEBHOOK_URL?: string;
}

type MailKind = 'community-love' | 'tiny-story' | 'art' | 'silly';

type DeliveryStatus = 'pending' | 'delivered';

interface SubmissionRecord {
  id: string;
  status: DeliveryStatus;
  kind: MailKind;
  message: string;
  image?: {
    key: string;
    filename: string;
    contentType: string;
    size: number;
  };
  createdAt: string;
  deliveredAt?: string;
  cf?: {
    ray?: string;
    country?: string;
    colo?: string;
  };
}

const MAX_MESSAGE_LENGTH = 1600;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const KIND_VALUES = new Set(['community-love', 'tiny-story', 'art', 'silly']);

function json(body: unknown, init: ResponseInit = {}, env?: Env): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders(env),
      ...(init.headers ?? {}),
    },
  });
}

function corsHeaders(env?: Env): HeadersInit {
  return {
    'access-control-allow-origin': env?.ALLOWED_ORIGIN || 'https://rainbowcircuits.org',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization, accept',
    'access-control-max-age': '86400',
  };
}

function isAuthorised(request: Request, env: Env): boolean {
  const header = request.headers.get('authorization') ?? '';
  const bearer = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  const keyFromUrl = new URL(request.url).searchParams.get('key') ?? '';
  return Boolean(env.ADMIN_KEY && (bearer === env.ADMIN_KEY || keyFromUrl === env.ADMIN_KEY));
}

function monthPrefix(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function safeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80) || 'image';
}

async function notifyDiscord(env: Env, record: SubmissionRecord): Promise<void> {
  if (!env.DISCORD_WEBHOOK_URL) return;

  const description = [
    `Kind: ${record.kind}`,
    record.message ? `Note: ${record.message.slice(0, 350)}${record.message.length > 350 ? '…' : ''}` : 'Note: none',
    record.image ? `Image: ${record.image.filename} (${Math.round(record.image.size / 1024)} KB)` : 'Image: none',
  ].join('\n');

  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: "Pip's Post Office",
      content: 'New anonymous mail is waiting for review.',
      embeds: [
        {
          title: `Mail ${record.id}`,
          description,
          color: 0x1e73d8,
          timestamp: record.createdAt,
        },
      ],
    }),
  }).catch(() => undefined);
}

async function handleSubmit(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();

  if (String(form.get('company') ?? '').trim()) {
    return json({ ok: true }, { status: 202 }, env);
  }

  if (form.get('consent') !== 'yes') {
    return json({ error: 'Consent is required before Pip can accept the mail.' }, { status: 400 }, env);
  }

  const message = String(form.get('message') ?? '').trim();
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json({ error: `Notes must be ${MAX_MESSAGE_LENGTH} characters or less.` }, { status: 400 }, env);
  }

  const kindRaw = String(form.get('kind') ?? 'community-love');
  const kind = (KIND_VALUES.has(kindRaw) ? kindRaw : 'community-love') as MailKind;

  const imagePart = form.get('image');
  const hasImage = imagePart instanceof File && imagePart.size > 0;

  if (!message && !hasImage) {
    return json({ error: 'Send a note, an image, or both.' }, { status: 400 }, env);
  }

  const now = new Date();
  const id = crypto.randomUUID();
  const month = monthPrefix(now);

  let image: SubmissionRecord['image'];
  if (hasImage) {
    const file = imagePart as File;
    if (!IMAGE_TYPES.has(file.type)) {
      return json({ error: 'Images must be PNG, JPG, WebP, or GIF.' }, { status: 400 }, env);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return json({ error: 'Images must be 8 MB or smaller.' }, { status: 400 }, env);
    }

    const filename = safeFilename(file.name);
    const extension = filename.includes('.') ? filename.split('.').pop() : 'bin';
    const key = `submissions/${month}/images/${id}.${extension}`;
    await env.PIP_POST_OFFICE_KV.put(key, await file.arrayBuffer(), {
      metadata: { originalFilename: filename, submissionId: id, contentType: file.type, size: file.size },
    });
    image = { key, filename, contentType: file.type, size: file.size };
  }

  const record: SubmissionRecord = {
    id,
    status: 'pending',
    kind,
    message,
    image,
    createdAt: now.toISOString(),
    cf: {
      ray: request.headers.get('cf-ray') ?? undefined,
      country: request.cf?.country as string | undefined,
      colo: request.cf?.colo as string | undefined,
    },
  };

  await env.PIP_POST_OFFICE_KV.put(`submissions/${month}/${id}.json`, JSON.stringify(record), {
    metadata: { id, status: record.status, kind, createdAt: record.createdAt, hasImage },
  });

  await notifyDiscord(env, record);

  return json({ ok: true, id }, { status: 201 }, env);
}

async function listDeliveries(request: Request, env: Env): Promise<Response> {
  if (!isAuthorised(request, env)) return json({ error: 'Unauthorised' }, { status: 401 }, env);

  const url = new URL(request.url);
  const status = (url.searchParams.get('status') || 'pending') as DeliveryStatus | 'all';
  const month = url.searchParams.get('month') || monthPrefix();
  const limit = Math.min(Number(url.searchParams.get('limit') || 50), 100);

  const listed = await env.PIP_POST_OFFICE_KV.list({ prefix: `submissions/${month}/`, limit });
  const records = await Promise.all(
    listed.keys.map(async (key) => {
      const record = await env.PIP_POST_OFFICE_KV.get<SubmissionRecord>(key.name, 'json');
      return record ? { ...record, storageKey: key.name } : null;
    }),
  );

  const deliveries = records
    .filter((record): record is SubmissionRecord & { storageKey: string } => Boolean(record))
    .filter((record) => status === 'all' || record.status === status)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return json({ deliveries }, {}, env);
}

async function markDelivered(request: Request, env: Env): Promise<Response> {
  if (!isAuthorised(request, env)) return json({ error: 'Unauthorised' }, { status: 401 }, env);

  const url = new URL(request.url);
  const id = url.pathname.split('/').filter(Boolean).pop();
  const month = url.searchParams.get('month') || monthPrefix();
  if (!id) return json({ error: 'Missing delivery id' }, { status: 400 }, env);

  const key = `submissions/${month}/${id}.json`;
  const record = await env.PIP_POST_OFFICE_KV.get<SubmissionRecord>(key, 'json');
  if (!record) return json({ error: 'Delivery not found' }, { status: 404 }, env);

  record.status = 'delivered';
  record.deliveredAt = new Date().toISOString();
  await env.PIP_POST_OFFICE_KV.put(key, JSON.stringify(record), {
    metadata: { id: record.id, status: record.status, kind: record.kind, createdAt: record.createdAt, hasImage: Boolean(record.image) },
  });

  return json({ ok: true, delivery: record }, {}, env);
}

async function getImage(request: Request, env: Env): Promise<Response> {
  if (!isAuthorised(request, env)) return json({ error: 'Unauthorised' }, { status: 401 }, env);

  const key = new URL(request.url).searchParams.get('key');
  if (!key) return json({ error: 'Missing image key' }, { status: 400 }, env);

  const object = await env.PIP_POST_OFFICE_KV.getWithMetadata<{ contentType?: string }>(key, 'arrayBuffer');
  if (!object.value) return json({ error: 'Image not found' }, { status: 404 }, env);

  return new Response(object.value, {
    headers: {
      ...corsHeaders(env),
      'content-type': object.metadata?.contentType || 'application/octet-stream',
      'cache-control': 'private, max-age=60',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(env) });

    const url = new URL(request.url);

    try {
      if (request.method === 'POST' && url.pathname === '/submit') return handleSubmit(request, env);
      if (request.method === 'GET' && url.pathname === '/deliveries') return listDeliveries(request, env);
      if (request.method === 'POST' && url.pathname.startsWith('/deliveries/')) return markDelivered(request, env);
      if (request.method === 'GET' && url.pathname === '/image') return getImage(request, env);
      if (request.method === 'GET' && url.pathname === '/health') return json({ ok: true }, {}, env);

      return json({ error: 'Not found' }, { status: 404 }, env);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 }, env);
    }
  },
};
