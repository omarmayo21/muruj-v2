import { test, expect } from '@playwright/test';
import { leadSchema, sanitizeText } from '../api/_lib/schema';
import { safeCell, leadToRow } from '../api/_lib/sheets';
import { buildLeadEmail } from '../api/_lib/email';
import { reasonCode, withTimeout } from '../api/_lib/channels';
import { cairoNow } from '../api/_lib/time';

const base = { name: 'أحمد', phone: '+201001234567', unit: 'غير محدد / أريد استشارة' };

test.describe('API input sanitising & validation', () => {
  test('strips HTML / control chars and limits lengths', () => {
    expect(sanitizeText('<b>Ahmed</b><script>alert(1)</script>', 80)).toBe('Ahmed alert(1)');
    expect(sanitizeText('a\u0000b\u200Bc', 80)).toBe('a b c');
    expect(sanitizeText('x'.repeat(500), 80)).toHaveLength(80);

    const r = leadSchema.parse({ ...base, name: '<img src=x onerror=alert(1)>محمد', utm_campaign: '<a href="x">c</a>', page_url: 'javascript:alert(1)' });
    expect(r.name).toBe('محمد');
    expect(r.utm_campaign).toBe('c');
    expect(r.page_url).toBe(''); // non-http(s) URLs dropped
  });

  test('rejects invalid input', () => {
    expect(leadSchema.safeParse({ ...base, name: 'a' }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, name: '<b></b>' }).success).toBe(false); // empty after stripping
    expect(leadSchema.safeParse({ ...base, phone: '+20123' }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, email: 'bad@' }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, unit: '' }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, email: ' Ahmed@Example.COM ' }).data?.email).toBe('ahmed@example.com');
  });

  test('Google Sheets: formula injection is neutralised', () => {
    expect(safeCell('=HYPERLINK("http://evil","x")')).toBe(`'=HYPERLINK("http://evil","x")`);
    expect(safeCell('+201001234567')).toBe("'+201001234567");
    expect(safeCell('-2+3')).toBe("'-2+3");
    expect(safeCell('@SUM(A1)')).toBe("'@SUM(A1)");
    expect(safeCell('أحمد')).toBe('أحمد');

    const lead = { ...leadSchema.parse({ ...base, name: '=1+1 أحمد', utm_source: '@google' }), timestamp: cairoNow(), ip: '1.1.1.1', user_agent: 'x' };
    const row = leadToRow(lead);
    expect(row).toHaveLength(14);
    expect(row[1]).toBe("'=1+1 أحمد");
    expect(row[4]).toBe('غير محدد / أريد استشارة'); // unit column
    expect(row[5]).toBe("'@google");
  });

  test('email HTML escapes values and contains the unit', () => {
    const lead = { ...leadSchema.parse({ ...base, name: 'Tom & "Jerry"' }), timestamp: cairoNow(), ip: '1.1.1.1', user_agent: 'x' };
    const { subject, html } = buildLeadEmail(lead);
    expect(subject).toBe('عميل جديد - كمبوند مروج - Tom & "Jerry"');
    expect(html).toContain('Tom &amp; &quot;Jerry&quot;');
    expect(html).toContain('غير محدد / أريد استشارة');
    expect(html).toContain('dir="rtl"');
  });
});

test.describe('API resilience helpers', () => {
  test('channel timeout rejects after the limit', async () => {
    const t0 = Date.now();
    await expect(withTimeout(new Promise(() => {}), 300, 'email')).rejects.toThrow('timed out');
    expect(Date.now() - t0).toBeLessThan(1000);
  });

  test('error reasons are generic (no secrets)', () => {
    expect(reasonCode({ code: 'EAUTH', message: 'Invalid login: 535 user leadsmars@gmail.com pass xyz' })).toBe('smtp_auth_failed');
    expect(reasonCode(new Error('error:1E08010C:DECODER routines::unsupported'))).toBe('invalid_private_key');
    expect(reasonCode({ status: 403, message: 'The caller does not have permission' })).toContain('sheet_permission_denied');
    expect(reasonCode({ name: 'TimeoutError', message: 'x' })).toBe('timeout');
    expect(reasonCode(new Error('something with SECRET=abc'))).toBe('unknown_error');
  });

  test('Cairo timestamp format', () => {
    expect(cairoNow(new Date('2026-11-16T12:00:00Z'))).toBe('2026-11-16 14:00:00');
  });
});
