/** Helpers shared by the delivery channels (timeouts + safe error reasons). */

export const CHANNEL_TIMEOUT_MS = 8000; // each channel gives up after 8 s → user never waits > ~10 s

export class TimeoutError extends Error {
  constructor(label: string, ms: number) {
    super(`${label} timed out after ${ms}ms`);
    this.name = 'TimeoutError';
  }
}

export function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let t: ReturnType<typeof setTimeout>;
  return Promise.race([
    p.finally(() => clearTimeout(t)),
    new Promise<T>((_, reject) => {
      t = setTimeout(() => reject(new TimeoutError(label, ms)), ms);
    }),
  ]);
}

/**
 * Maps an error to a short, generic reason code. NEVER contains secrets,
 * credentials, stack traces or raw provider messages.
 */
export function reasonCode(err: unknown): string {
  const e = err as { name?: string; code?: string | number; responseCode?: number; status?: number; response?: { status?: number }; message?: string };
  const msg = String(e?.message || '').toLowerCase();
  const status = Number(e?.status ?? e?.response?.status ?? (typeof e?.code === 'number' ? e.code : NaN));
  if (e?.name === 'TimeoutError' || e?.code === 'ETIMEDOUT' || msg.includes('timeout')) return 'timeout';
  if (e?.code === 'EAUTH' || e?.responseCode === 535 || msg.includes('invalid login') || msg.includes('username and password')) return 'smtp_auth_failed';
  if (e?.code === 'ECONNECTION' || e?.code === 'ECONNREFUSED' || e?.code === 'ENOTFOUND' || e?.code === 'ESOCKET') return 'network_error';
  if (msg.includes('decoder') || msg.includes('private key') || msg.includes('pem')) return 'invalid_private_key';
  if (msg.includes('invalid_grant') || msg.includes('invalid jwt')) return 'google_auth_failed';
  if (status === 403 || msg.includes('permission') || msg.includes('caller does not have')) return 'sheet_permission_denied (share the sheet with the service account as Editor)';
  if (status === 404 || msg.includes('not found')) return 'sheet_not_found (check GOOGLE_SHEET_ID)';
  if (status === 400) return 'bad_request';
  if (status === 429) return 'provider_rate_limited';
  return 'unknown_error';
}
