/** Server-only environment access. NEVER import this from /src. */
export const env = {
  get smtpHost() {
    return process.env.SMTP_HOST?.trim() || '';
  },
  get smtpPort() {
    return Number(process.env.SMTP_PORT || 587);
  },
  get smtpUser() {
    return process.env.SMTP_USER?.trim() || '';
  },
  /** Gmail app passwords are often pasted with spaces */
  get smtpPass() {
    return process.env.SMTP_PASS?.replace(/\s+/g, '') || '';
  },
  get emailFrom() {
    return process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || '';
  },
  get emailTo() {
    return process.env.EMAIL_TO?.trim() || '';
  },
  /** Multiple comma-separated recipient addresses */
  get emailToList(): string[] {
    return (process.env.EMAIL_TO || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  },
  get sheetId() {
    return process.env.GOOGLE_SHEET_ID?.trim() || '';
  },
  get saEmail() {
    return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || '';
  },
  /** Converts literal "\n" sequences into real new lines and strips wrapping quotes */
  get privateKey() {
    let k = process.env.GOOGLE_PRIVATE_KEY || '';
    k = k.trim();
    if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) {
      k = k.slice(1, -1);
    }
    return k.replace(/\\n/g, '\n');
  },
};

export function missingEmailVars(): string[] {
  const m: string[] = [];
  if (!env.smtpHost) m.push('SMTP_HOST');
  if (!process.env.SMTP_PORT?.trim()) m.push('SMTP_PORT');
  if (!env.smtpUser) m.push('SMTP_USER');
  if (!env.smtpPass) m.push('SMTP_PASS');
  if (!env.emailFrom) m.push('EMAIL_FROM');
  if (env.emailToList.length === 0) m.push('EMAIL_TO');
  return m;
}

export function missingSheetsVars(): string[] {
  const m: string[] = [];
  if (!env.sheetId) m.push('GOOGLE_SHEET_ID');
  if (!env.saEmail) m.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  if (!env.privateKey.includes('PRIVATE KEY')) m.push('GOOGLE_PRIVATE_KEY');
  return m;
}

export const emailConfigured = () => !!(env.smtpHost && env.smtpUser && env.smtpPass && env.emailToList.length > 0);
export const sheetsConfigured = () => !!(env.sheetId && env.saEmail && env.privateKey.includes('PRIVATE KEY'));
