import { sheets as sheetsApi, auth } from '@googleapis/sheets';
import { env } from './env.js';
import type { LeadRecord } from './schema.js';
import { CHANNEL_TIMEOUT_MS, withTimeout } from './channels.js';

export const SHEET_HEADER = ['Timestamp', 'Name', 'Phone', 'Email', 'Unit', 'Source', 'Medium', 'Campaign', 'Term', 'Content', 'GCLID', 'Page URL', 'Referrer', 'Device'];
const LAST_COL = 'N'; // 14 columns

/**
 * Formula-injection protection: any cell starting with = + - @ (or tab / CR)
 * is prefixed with an apostrophe, so Sheets / Excel treat it as plain text.
 * (With USER_ENTERED the apostrophe is hidden and "+2010…" displays correctly.)
 */
export function safeCell(value: string): string {
  const v = String(value ?? '');
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}

function client() {
  const jwt = new auth.JWT({
    email: env.saEmail,
    key: env.privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  // per-request HTTP timeout (on top of the overall channel timeout)
  return sheetsApi({ version: 'v4', auth: jwt, timeout: CHANNEL_TIMEOUT_MS - 500 });
}

export function leadToRow(l: LeadRecord): string[] {
  return [l.timestamp, l.name, l.phone, l.email, l.unit, l.utm_source, l.utm_medium, l.utm_campaign, l.utm_term, l.utm_content, l.gclid, l.page_url, l.referrer, l.device].map(safeCell);
}

async function append(l: LeadRecord) {
  const s = client();
  const spreadsheetId = env.sheetId;

  // Auto-create the header row if the sheet is empty
  const head = await s.spreadsheets.values.get({ spreadsheetId, range: `A1:${LAST_COL}1` });
  if (!head.data.values || head.data.values.length === 0 || !head.data.values[0]?.some((v) => String(v).trim())) {
    await s.spreadsheets.values.update({
      spreadsheetId,
      range: `A1:${LAST_COL}1`,
      valueInputOption: 'RAW',
      requestBody: { values: [SHEET_HEADER] },
    });
  }

  await s.spreadsheets.values.append({
    spreadsheetId,
    range: `A:${LAST_COL}`,
    valueInputOption: 'USER_ENTERED', // honours the leading apostrophe (text) — formulas cannot run
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [leadToRow(l)] },
  });
}

export function appendLeadRow(l: LeadRecord) {
  return withTimeout(append(l), CHANNEL_TIMEOUT_MS, 'sheets');
}
