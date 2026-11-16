import nodemailer, { type Transporter } from 'nodemailer';
import { env } from './env.js';
import type { LeadRecord } from './schema.js';
import { CHANNEL_TIMEOUT_MS, withTimeout } from './channels.js';

const esc = (s: string) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

let transporter: Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: CHANNEL_TIMEOUT_MS,
    });
  }
  return transporter;
}

export function buildLeadEmail(l: LeadRecord) {
  const rows: [string, string, boolean?][] = [
    ['الاسم', l.name, true],
    ['رقم التليفون', l.phone, true],
    ['البريد الإلكتروني', l.email || '—'],
    ['الوحدة / المساحة', l.unit, true],
    ['رقم الطلب (Lead ID)', l.lead_id || '—'],
    ['وقت التسجيل (القاهرة)', l.timestamp],
    ['مكان الفورم', l.form_location || '—'],
    ['الصفحة', l.page_url || '—'],
    ['صفحة الهبوط', l.landing_page || '—'],
    ['المصدر المحيل (Referrer)', l.referrer || '—'],
    ['utm_source', l.utm_source || '—'],
    ['utm_medium', l.utm_medium || '—'],
    ['utm_campaign', l.utm_campaign || '—'],
    ['utm_term', l.utm_term || '—'],
    ['utm_content', l.utm_content || '—'],
    ['GCLID', l.gclid || '—'],
    ['GBRAID', l.gbraid || '—'],
    ['WBRAID', l.wbraid || '—'],
    ['الجهاز', l.device || '—'],
    ['اللغة', l.lang || '—'],
    ['IP', l.ip || '—'],
  ];
  const tr = rows
    .map(
      ([k, v, strong], i) =>
        `<tr style="background:${i % 2 ? '#f7f7f5' : '#ffffff'}"><th style="text-align:right;padding:10px 14px;border:1px solid #e7e5e4;color:#57534e;font-weight:700;white-space:nowrap;width:190px">${esc(k)}</th><td style="text-align:right;padding:10px 14px;border:1px solid #e7e5e4;color:#1c1917;${strong ? 'font-weight:800;font-size:16px' : ''};word-break:break-all">${esc(v)}</td></tr>`,
    )
    .join('');
  const wa = l.phone.replace(/\D/g, '');
  const html = `<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;background:#f1f5f2;font-family:Tahoma,Arial,sans-serif">
<div style="max-width:680px;margin:0 auto;padding:24px 12px" dir="rtl">
  <div style="background:#163b2c;color:#fff;padding:20px 24px;border-radius:14px 14px 0 0">
    <div style="color:#d2b05e;font-size:13px;font-weight:700">كمبوند مروج سموحة</div>
    <h1 style="margin:6px 0 0;font-size:22px">عميل جديد: ${esc(l.name)}</h1>
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;background:#fff;font-size:14px" dir="rtl">${tr}</table>
  <div style="background:#fff;padding:18px 24px;border-radius:0 0 14px 14px;text-align:center">
    <a href="tel:${esc(l.phone)}" style="display:inline-block;background:#163b2c;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:700;margin:4px">اتصال بالعميل</a>
    <a href="https://wa.me/${esc(wa)}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:700;margin:4px">واتساب العميل</a>
  </div>
</div></body></html>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  return { subject: `عميل جديد - كمبوند مروج - ${l.name}`, html, text };
}

export async function sendLeadEmail(l: LeadRecord) {
  const { subject, html, text } = buildLeadEmail(l);
  await withTimeout(sendMail(subject, html, text, l), CHANNEL_TIMEOUT_MS, 'email');
}

async function sendMail(subject: string, html: string, text: string, l: LeadRecord) {
  await getTransporter().sendMail({
    from: { name: 'Muruj Leads', address: env.emailFrom },
    to: env.emailTo,
    replyTo: l.email || undefined,
    subject,
    html,
    text,
  });
}
