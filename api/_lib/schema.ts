import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js/max';

/**
 * Sanitises free text BEFORE it is used anywhere (email HTML, Google Sheet):
 *  - removes HTML tags and any leftover angle brackets
 *  - removes control / zero-width characters
 *  - collapses whitespace and trims
 *  - hard-limits the length
 */
export function sanitizeText(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ') // strip HTML tags
    .replace(/[<>]/g, '') // stray brackets
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B\u2060\uFEFF]/g, ' ') // control & invisible chars (keeps RTL marks U+200E/F)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Optional sanitised string with a max length (missing → '') */
const text = (max: number) =>
  z
    .unknown()
    .optional()
    .transform((v) => (v == null ? '' : sanitizeText(v, max)));

/** URLs: keep only http(s), sanitised and length-limited */
const url = (max: number) =>
  text(max).transform((v) => (/^https?:\/\//i.test(v) ? v : ''));

export const leadSchema = z.object({
  name: z
    .unknown()
    .transform((v) => sanitizeText(v, 80))
    .pipe(z.string().min(2, 'name_too_short')),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ''))
    .pipe(z.string().regex(/^\+[1-9]\d{6,14}$/, 'phone_not_e164'))
    .refine((v) => isValidPhoneNumber(v), 'phone_invalid'),
  phone_country: text(4),
  email: z
    .unknown()
    .optional()
    .transform((v) => (v == null ? '' : sanitizeText(v, 120).toLowerCase()))
    .pipe(z.union([z.literal(''), z.email('email_invalid')])),
  unit: z
    .unknown()
    .transform((v) => sanitizeText(v, 120))
    .pipe(z.string().min(1, 'unit_required')),
  website: text(200), // honeypot
  lead_id: text(64),
  page_url: url(1000),
  referrer: url(1000),
  landing_page: url(1000),
  utm_source: text(200),
  utm_medium: text(200),
  utm_campaign: text(200),
  utm_term: text(200),
  utm_content: text(200),
  gclid: text(300),
  gbraid: text(300),
  wbraid: text(300),
  device: text(20),
  form_location: text(60),
  lang: text(4),
  client_ts: text(40),
  elapsed_ms: z.coerce.number().optional().default(0),
  /** set by scripts/test-lead.mjs → response includes per-channel diagnostics */
  test: z.boolean().optional().default(false),
});

export type Lead = z.infer<typeof leadSchema>;

export interface LeadRecord extends Lead {
  timestamp: string; // Africa/Cairo
  ip: string;
  user_agent: string;
}
