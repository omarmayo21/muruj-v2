#!/usr/bin/env node
/**
 * End-to-end test of the lead API (email + Google Sheets).
 *
 *   node scripts/test-lead.mjs                         → http://localhost:3000
 *   node scripts/test-lead.mjs https://your-domain.com → deployed site
 *
 * Sends ONE clearly-marked test lead ("اختبار — Test Lead") and prints the
 * result of each channel. Only generic reason codes are shown — no secrets.
 * Note: a real email is sent and a real row is added to the sheet.
 */
const base = (process.argv[2] || process.env.LEAD_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const icon = (s) => (s === 'ok' ? '✅' : s === 'not_configured' ? '⚪' : '❌');

async function main() {
  console.log(`\n▶ Target: ${base}\n`);

  // 1) configuration + optional read-only credential check (/api/health?verify=1)
  try {
    const h = await fetch(`${base}/api/health?verify=1`).then((r) => r.json());
    console.log('1) /api/health?verify=1');
    console.log(`   smtpReady:         ${h.smtpReady}`);
    console.log(`   googleSheetsReady: ${h.googleSheetsReady}`);
    const missing = Object.entries(h.env || {}).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length) console.log(`   missing env vars:  ${missing.join(', ')}`);
    if (h.verify) {
      for (const [k, v] of Object.entries(h.verify)) {
        console.log(`   verify ${k.padEnd(6)}:     ${icon(v.status)} ${v.status}${v.reason ? ` (${v.reason})` : ''}`);
      }
    }
  } catch (e) {
    console.log(`1) /api/health → unreachable (${e.message})`);
  }

  // 2) real test lead
  const payload = {
    name: 'اختبار — Test Lead',
    phone: '+201001234567',
    phone_country: 'EG',
    email: 'test@example.com',
    unit: 'شقة (تبدأ من 88 م²)',
    message: 'رسالة اختبار من scripts/test-lead.mjs',
    source_page: 'test_script',
    lead_id: `test-${Date.now()}`,
    page_url: `${base}/?utm_source=test_script`,
    referrer: '',
    landing_page: `${base}/`,
    utm_source: 'test_script',
    utm_medium: 'cli',
    utm_campaign: 'api_check',
    utm_term: '',
    utm_content: '',
    gclid: 'TEST-GCLID',
    device: 'desktop',
    form_location: 'test_script',
    lang: 'ar',
    client_ts: new Date().toISOString(),
    elapsed_ms: 5000,
    test: true,
  };

  const t0 = Date.now();
  let res, data;
  try {
    res = await fetch(`${base}/api/lead`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    data = await res.json().catch(() => ({}));
  } catch (e) {
    console.log(`\n2) POST /api/lead → network error: ${e.message}`);
    process.exit(2);
  }
  const ms = Date.now() - t0;
  console.log(`\n2) POST /api/lead → HTTP ${res.status} in ${ms} ms — success: ${data.success === true}`);
  if (data.channels) {
    for (const [name, c] of Object.entries(data.channels)) {
      console.log(`   ${icon(c.status)} ${name.padEnd(6)}: ${c.status}${c.reason ? ` — reason: ${c.reason}` : ''}${c.ms != null ? ` (${c.ms} ms)` : ''}`);
    }
  } else if (data.error) {
    console.log(`   error: ${data.error}${data.fields ? ` (fields: ${data.fields.join(', ')})` : ''}`);
  }
  console.log('');
  process.exit(data.success ? 0 : 1);
}

main();
