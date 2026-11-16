import { sheets as sheetsApi, auth, type sheets_v4 } from '@googleapis/sheets';
import { env } from './env.js';
import type { LeadRecord } from './schema.js';
import { CHANNEL_TIMEOUT_MS, withTimeout } from './channels.js';

export const SHEET_HEADER = [
  'Timestamp',
  'Name',
  'Phone',
  'Email',
  'Unit',
  'Message',
  'Source Page',
  'Source',
  'Medium',
  'Campaign',
  'Term',
  'Content',
  'GCLID',
  'Page URL',
  'Referrer',
  'Device',
];
const LAST_COL = 'P'; // 16 columns

/**
 * Formula-injection protection: any cell starting with = + - @ (or tab / CR)
 * is prefixed with an apostrophe, so Sheets / Excel treat it as plain text.
 * (With USER_ENTERED the apostrophe is hidden and "+2010…" displays correctly.)
 */
export function safeCell(value: string): string {
  const v = String(value ?? '');
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}

/**
 * Returns true if the sheet's first row is empty OR has the old 14-column header
 * (or any mismatched header) and needs to be updated to the 16-column header.
 */
export function needsHeaderUpdate(row: unknown[] | undefined): boolean {
  const current = (row ?? []).map((v) => String(v ?? '').trim());
  if (current.length === 0 || !current.some(Boolean)) return true;
  if (current.length !== SHEET_HEADER.length) return true;
  return SHEET_HEADER.some((h, i) => current[i] !== h);
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

/**
 * Automatically detects the first sheet tab's title (e.g. "Sheet1", "ورقة1", "Leads")
 * and formats an A1 range prefix `'SheetTitle'!`.
 */
let cachedSheetPrefix: { id: string; prefix: string } | null = null;
async function getFirstSheetPrefix(s: sheets_v4.Sheets, spreadsheetId: string): Promise<string> {
  if (cachedSheetPrefix && cachedSheetPrefix.id === spreadsheetId) {
    return cachedSheetPrefix.prefix;
  }
  const meta = await s.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets(properties(title,index))',
  });
  const firstTitle = meta.data.sheets?.[0]?.properties?.title;
  const prefix = firstTitle ? `'${firstTitle.replace(/'/g, "''")}'!` : '';
  cachedSheetPrefix = { id: spreadsheetId, prefix };
  return prefix;
}

export function leadToRow(l: LeadRecord): string[] {
  return [
    l.timestamp,
    l.name,
    l.phone,
    l.email,
    l.unit,
    l.message,
    l.source_page || l.form_location,
    l.utm_source,
    l.utm_medium,
    l.utm_campaign,
    l.utm_term,
    l.utm_content,
    l.gclid,
    l.page_url,
    l.referrer,
    l.device,
  ].map(safeCell);
}

async function append(l: LeadRecord) {
  const s = client();
  const spreadsheetId = env.sheetId;
  const prefix = await getFirstSheetPrefix(s, spreadsheetId);
  const headerRange = `${prefix}A1:${LAST_COL}1`;
  const appendRange = `${prefix}A:${LAST_COL}`;

  // Auto-create the header row if empty, or safely upgrade an old 14-column header without deleting rows
  const head = await s.spreadsheets.values.get({ spreadsheetId, range: headerRange });
  if (needsHeaderUpdate(head.data.values?.[0])) {
    await s.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      valueInputOption: 'RAW',
      requestBody: { values: [SHEET_HEADER] },
    });
  }

  await s.spreadsheets.values.append({
    spreadsheetId,
    range: appendRange,
    valueInputOption: 'USER_ENTERED', // honours the leading apostrophe (text) — formulas cannot run
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [leadToRow(l)] },
  });
}

export function appendLeadRow(l: LeadRecord) {
  return withTimeout(append(l), CHANNEL_TIMEOUT_MS, 'sheets');
}

/** Read-only metadata check used by /api/health?verify=1 (never writes to the sheet) */
export async function verifySheetsConnection(): Promise<void> {
  const s = client();
  await withTimeout(getFirstSheetPrefix(s, env.sheetId), CHANNEL_TIMEOUT_MS, 'sheets_verify');
}
