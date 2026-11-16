import type { VercelRequest, VercelResponse } from './_lib/http.js';
import { leadSchema, type LeadRecord } from './_lib/schema.js';
import { isRateLimited, recordHit } from './_lib/rateLimit.js';
import { cairoNow } from './_lib/time.js';
import { emailConfigured, sheetsConfigured } from './_lib/env.js';
import { sendLeadEmail } from './_lib/email.js';
import { appendLeadRow } from './_lib/sheets.js';
import { reasonCode } from './_lib/channels.js';

/** Arabic messages returned to the client (the form also has its own copies) */
const MSG = {
  rate: 'وصلتنا عدة طلبات من نفس الشبكة خلال وقت قصير. من فضلك حاول بعد 10 دقائق أو تواصل معنا بالاتصال أو واتساب.',
  invalid: 'من فضلك راجع البيانات المدخلة وحاول مرة أخرى.',
  failed: 'عذراً، لم نتمكن من استلام طلبك الآن. حاول مرة أخرى أو تواصل معنا بالاتصال أو واتساب.',
};

type ChannelStatus = { status: 'ok' | 'failed' | 'not_configured'; reason?: string; ms?: number };

function clientIp(req: VercelRequest): string {
  const xf = req.headers['x-forwarded-for'];
  const first = (Array.isArray(xf) ? xf[0] : xf)?.split(',')[0]?.trim();
  return first || (req.headers['x-real-ip'] as string) || req.socket?.remoteAddress || 'unknown';
}

/** Same-origin only (the form lives on the same Vercel domain). */
function originAllowed(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin fetches may omit Origin; server-to-server tests (scripts/test-lead.mjs)
  try {
    const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.headers.origin && originAllowed(req)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ success: false, error: 'method_not_allowed' });
  }
  if (!originAllowed(req)) return res.status(403).json({ success: false, error: 'forbidden' });

  const ip = clientIp(req);
  const rl = isRateLimited(ip);
  if (rl.limited) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ success: false, error: 'rate_limited', message: MSG.rate });
  }

  let body: unknown = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: 'invalid_json', message: MSG.invalid });
    }
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    // validation errors do NOT consume rate-limit quota (protects users on shared mobile IPs)
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
    return res.status(400).json({ success: false, error: 'validation_error', fields, message: MSG.invalid });
  }
  const data = parsed.data;

  // Anti-spam: honeypot filled or submitted impossibly fast → pretend success, drop silently
  if (data.website || (data.elapsed_ms > 0 && data.elapsed_ms < 800)) {
    recordHit(ip);
    console.warn('[lead] spam dropped', { honeypot: !!data.website, elapsed: data.elapsed_ms });
    return res.status(200).json({ success: true });
  }

  recordHit(ip);
  const lead: LeadRecord = {
    ...data,
    timestamp: cairoNow(),
    ip,
    user_agent: String(req.headers['user-agent'] || '').slice(0, 300),
  };

  const channels: Record<'email' | 'sheets', ChannelStatus> = {
    email: { status: 'not_configured' },
    sheets: { status: 'not_configured' },
  };
  const tasks: { name: 'email' | 'sheets'; run: () => Promise<void> }[] = [];
  if (emailConfigured()) tasks.push({ name: 'email', run: () => sendLeadEmail(lead) });
  else console.error('[lead] email channel not configured (SMTP_* / EMAIL_TO)');
  if (sheetsConfigured()) tasks.push({ name: 'sheets', run: () => appendLeadRow(lead) });
  else console.error('[lead] sheets channel not configured (GOOGLE_*)');

  if (tasks.length === 0) {
    console.error('[lead] NO delivery channel configured — lead lost:', JSON.stringify({ ...lead, ip: undefined }));
    return res.status(500).json({ success: false, error: 'not_configured', message: MSG.failed, ...(data.test ? { channels } : {}) });
  }

  // Both channels in parallel; each has its own 8 s timeout (see _lib/channels.ts)
  const started = Date.now();
  const results = await Promise.allSettled(
    tasks.map(async (t) => {
      const t0 = Date.now();
      await t.run();
      return Date.now() - t0;
    }),
  );
  results.forEach((r, i) => {
    const name = tasks[i].name;
    if (r.status === 'fulfilled') channels[name] = { status: 'ok', ms: r.value };
    else {
      const reason = reasonCode(r.reason);
      channels[name] = { status: 'failed', reason };
      // log the generic reason + provider message (server logs only, never sent to the client)
      console.error(`[lead] ${name} failed: ${reason} —`, r.reason instanceof Error ? r.reason.message : String(r.reason));
    }
  });

  const okCount = Object.values(channels).filter((c) => c.status === 'ok').length;
  const diag = data.test ? { channels, total_ms: Date.now() - started } : {};
  if (okCount > 0) {
    console.info('[lead] delivered', { email: channels.email.status, sheets: channels.sheets.status, lead_id: lead.lead_id });
    return res.status(200).json({ success: true, ...diag });
  }
  // Both failed: log the lead so it can be recovered from Vercel logs
  console.error('[lead] ALL channels failed — lead data:', JSON.stringify({ ...lead, ip: undefined }));
  return res.status(502).json({ success: false, error: 'delivery_failed', message: MSG.failed, ...diag });
}
