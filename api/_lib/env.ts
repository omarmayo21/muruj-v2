/** Server-only environment access. NEVER import this from /src. */
export const env = {
  get smtpHost() { return process.env.SMTP_HOST?.trim() || ''; },
  get smtpPort() { return Number(process.env.SMTP_PORT || 587); },
  get smtpUser() { return process.env.SMTP_USER?.trim() || ''; },
  get smtpPass() { return process.env.SMTP_PASS?.replace(/\s+/g, '') || ''; }, // Gmail app passwords are often pasted with spaces
  get emailFrom() { return process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || ''; },
  get emailTo() { return process.env.EMAIL_TO?.trim() || ''; },
  get sheetId() { return process.env.GOOGLE_SHEET_ID?.trim() || ''; },
  get saEmail() { return process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || ''; },
  /** Converts literal "\n" sequences into real new lines and strips wrapping quotes */
  get privateKey() {
    let k = process.env.GOOGLE_PRIVATE_KEY || '';
    k = k.trim();
    if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1);
    return k.replace(/\\n/g, '\n');
  },
};

export const emailConfigured = () => !!(env.smtpHost && env.smtpUser && env.smtpPass && env.emailTo);
export const sheetsConfigured = () => !!(env.sheetId && env.saEmail && env.privateKey.includes('PRIVATE KEY'));
