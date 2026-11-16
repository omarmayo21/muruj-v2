/** SHA-256 hex (Google Ads Enhanced Conversions). Returns '' if crypto.subtle is unavailable. */
export async function sha256(value: string): Promise<string> {
  try {
    if (!value || typeof window === 'undefined' || !window.crypto?.subtle) return '';
    const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return '';
  }
}

/** Google normalisation: trim + lowercase */
export const normalizeEmail = (e: string) => e.trim().toLowerCase();

/** E.164 (e.g. +201001234567), trimmed + lowercase, no spaces */
export const normalizePhone = (p: string) => p.trim().toLowerCase().replace(/[\s()-]/g, '');

/** Unique id per submission (used as Google Ads transaction_id) */
export function newLeadId(): string {
  try {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
