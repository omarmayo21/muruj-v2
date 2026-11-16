import type { VercelRequest, VercelResponse } from './_lib/http.js';
import { emailConfigured, sheetsConfigured, missingEmailVars, missingSheetsVars } from './_lib/env.js';
import { verifyEmailConnection } from './_lib/email.js';
import { verifySheetsConnection } from './_lib/sheets.js';
import { reasonCode } from './_lib/channels.js';

const has = (k: string) => !!(process.env[k] && String(process.env[k]).trim());

/**
 * Configuration check — booleans only, never values.
 * It does NOT send an email and does NOT write to the sheet; it only checks
 * that the required variables are present.
 * Optional `?verify=1` runs `transporter.verify()` and a read-only Sheets metadata call.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const keys = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'EMAIL_FROM',
    'EMAIL_TO',
    'GOOGLE_SHEET_ID',
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'VITE_GA_MEASUREMENT_ID',
    'VITE_GTM_ID',
    'VITE_GOOGLE_ADS_ID',
    'VITE_GOOGLE_ADS_CONVERSION_ID',
    'VITE_GOOGLE_ADS_CONVERSION_LABEL',
  ];
  const env = Object.fromEntries(keys.map((k) => [k, has(k)]));
  const smtpReady = emailConfigured();
  const googleSheetsReady = sheetsConfigured();

  const wantVerify =
    req.query?.verify === '1' ||
    (typeof req.url === 'string' && new URL(req.url, 'http://localhost').searchParams.get('verify') === '1');

  let verify:
    | {
        smtp: { status: 'ok' | 'failed' | 'not_configured'; reason?: string };
        sheets: { status: 'ok' | 'failed' | 'not_configured'; reason?: string };
      }
    | undefined;

  if (wantVerify) {
    verify = {
      smtp: { status: 'not_configured' },
      sheets: { status: 'not_configured' },
    };
    await Promise.all([
      smtpReady
        ? verifyEmailConnection()
            .then(() => {
              verify!.smtp = { status: 'ok' };
            })
            .catch((e) => {
              verify!.smtp = { status: 'failed', reason: reasonCode(e) };
            })
        : Promise.resolve(),
      googleSheetsReady
        ? verifySheetsConnection()
            .then(() => {
              verify!.sheets = { status: 'ok' };
            })
            .catch((e) => {
              verify!.sheets = { status: 'failed', reason: reasonCode(e) };
            })
        : Promise.resolve(),
    ]);
  }

  res.status(200).json({
    ok: smtpReady || googleSheetsReady,
    smtpReady,
    googleSheetsReady,
    missing: {
      email: missingEmailVars(),
      sheets: missingSheetsVars(),
    },
    ...(verify ? { verify } : {}),
    env,
    node: process.version,
    time: new Date().toISOString(),
  });
}
