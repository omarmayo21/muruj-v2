import { test, expect } from '@playwright/test';
import { leadSchema, sanitizeText } from '../api/_lib/schema';
import { safeCell, leadToRow, SHEET_HEADER, needsHeaderUpdate } from '../api/_lib/sheets';
import { buildLeadEmail } from '../api/_lib/email';
import { reasonCode, withTimeout } from '../api/_lib/channels';
import { cairoNow } from '../api/_lib/time';
import { normalizeAwId } from '../src/lib/analytics';

const base = { name: 'أحمد', phone: '+201001234567', unit: 'شقة (تبدأ من 88 م²)' };

test.describe('API input sanitising & validation', () => {
  test('strips HTML / control chars and limits lengths (including message & source_page)', () => {
    expect(sanitizeText('<b>Ahmed</b><script>alert(1)</script>', 80)).toBe('Ahmed alert(1)');
    expect(sanitizeText('a\u0000b\u200Bc', 80)).toBe('a b c');
    expect(sanitizeText('x'.repeat(600), 500)).toHaveLength(500);

    const r = leadSchema.parse({
      ...base,
      name: '<img src=x onerror=alert(1)>محمد',
      message: '<b>أريد</b> معرفة التفاصيل ' + 'x'.repeat(600),
      source_page: '<script>contact</script>',
      utm_campaign: '<a href="x">c</a>',
      page_url: 'javascript:alert(1)',
    });
    expect(r.name).toBe('محمد');
    expect(r.message.startsWith('أريد معرفة التفاصيل')).toBe(true);
    expect(r.message.length).toBeLessThanOrEqual(500);
    expect(r.source_page).toBe('contact');
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

  test('Google Sheets: 16 columns, header auto-upgrade & formula injection neutralised', () => {
    expect(SHEET_HEADER).toEqual([
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
    ]);
    // Empty header or old 14-column header triggers update
    expect(needsHeaderUpdate(undefined)).toBe(true);
    expect(needsHeaderUpdate([])).toBe(true);
    expect(
      needsHeaderUpdate(['Timestamp', 'Name', 'Phone', 'Email', 'Unit', 'Source', 'Medium', 'Campaign', 'Term', 'Content', 'GCLID', 'Page URL', 'Referrer', 'Device']),
    ).toBe(true);
    expect(needsHeaderUpdate(SHEET_HEADER)).toBe(false);

    expect(safeCell('=HYPERLINK("http://evil","x")')).toBe(`'=HYPERLINK("http://evil","x")`);
    expect(safeCell('+201001234567')).toBe("'+201001234567");
    expect(safeCell('-2+3')).toBe("'-2+3");
    expect(safeCell('@SUM(A1)')).toBe("'@SUM(A1)");
    expect(safeCell('أحمد')).toBe('أحمد');

    const lead = {
      ...leadSchema.parse({ ...base, name: '=1+1 أحمد', message: '=CMD()', source_page: 'contact', utm_source: '@google' }),
      timestamp: cairoNow(),
      ip: '1.1.1.1',
      user_agent: 'x',
    };
    const row = leadToRow(lead);
    expect(row).toHaveLength(16);
    expect(row[1]).toBe("'=1+1 أحمد");
    expect(row[4]).toBe('شقة (تبدأ من 88 م²)'); // Unit column
    expect(row[5]).toBe("'=CMD()"); // Message column
    expect(row[6]).toBe('contact'); // Source Page column
    expect(row[7]).toBe("'@google"); // Source column
  });

  test('email HTML escapes values and contains Unit, Message and Source Page rows', () => {
    const lead = {
      ...leadSchema.parse({ ...base, name: 'Tom & "Jerry"', message: 'استفسار عن <88 م²>', source_page: 'contact' }),
      timestamp: cairoNow(),
      ip: '1.1.1.1',
      user_agent: 'x',
    };
    const { subject, html } = buildLeadEmail(lead);
    expect(subject).toBe('عميل جديد - كمبوند مروج - Tom & "Jerry"');
    expect(html).toContain('Tom &amp; &quot;Jerry&quot;');
    expect(html).toContain('شقة (تبدأ من 88 م²)');
    expect(html).toContain('الرسالة (Message)');
    expect(html).toContain('استفسار عن');
    expect(html).toContain('صفحة المصدر (Source Page)');
    expect(html).toContain('contact');
    expect(html).toContain('/logo-light.png');
    expect(html).toContain('شعار كمبوند مروج');
    expect(html).toContain('dir="rtl"');
  });

  test('normalizeAwId normalizes Google Ads IDs with or without AW- prefix', () => {
    expect(normalizeAwId('123456789')).toBe('AW-123456789');
    expect(normalizeAwId('AW-123456789')).toBe('AW-123456789');
    expect(normalizeAwId('aw-987654')).toBe('AW-987654');
    expect(normalizeAwId('  ')).toBe('');
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
