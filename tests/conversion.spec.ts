import { test, expect } from '@playwright/test';
import { TRACK, PLAIN, mockNetwork, conversions, gtagCalls, submitLead, sha256 } from './helpers';

test.describe('Google Ads conversion — fires only after a real submit', () => {
  test('(a) real submit → exactly ONE conversion on /thank-you with transaction_id + hashed user_data', async ({ page }) => {
    const leads = await mockNetwork(page);
    await page.goto(`${TRACK}/?utm_source=google&utm_medium=cpc&utm_campaign=muruj&gclid=TEST-GCLID`);
    expect(await conversions(page)).toHaveLength(0); // nothing on the landing page

    await submitLead(page);
    await page.waitForURL('**/thank-you');
    await page.waitForTimeout(500);

    const conv = await conversions(page);
    expect(conv).toHaveLength(1);
    expect(conv[0].send_to).toBe('AW-TEST/TestLabel');
    expect(conv[0].value).toBe(1);
    expect(conv[0].currency).toBe('EGP');

    // transaction_id = the lead_id sent to the API (unique per submission)
    expect(leads).toHaveLength(1);
    expect(typeof conv[0].transaction_id).toBe('string');
    expect(conv[0].transaction_id).toBe(leads[0].lead_id);

    // Enhanced Conversions: SHA-256 of normalised E.164 phone + trimmed/lower-cased email
    const ud = conv[0].user_data as Record<string, string>;
    expect(ud.sha256_phone_number).toBe(sha256('+201001234567'));
    expect(ud.sha256_email_address).toBe(sha256('test.user@example.com'));

    // lead payload carries unit + attribution
    expect(leads[0].unit).toBeTruthy();
    expect(leads[0].phone).toBe('+201001234567');
    expect(leads[0].gclid).toBe('TEST-GCLID');
    expect(leads[0].utm_campaign).toBe('muruj');

    // GA4 generate_lead fired once too
    const ga = (await gtagCalls(page)).filter((c) => c[0] === 'event' && c[1] === 'generate_lead');
    expect(ga).toHaveLength(1);
  });

  test('(b) refresh on /thank-you → NO new conversion', async ({ page }) => {
    await mockNetwork(page);
    await page.goto(`${TRACK}/`);
    await submitLead(page);
    await page.waitForURL('**/thank-you');
    await page.waitForTimeout(400);
    expect(await conversions(page)).toHaveLength(1);

    await page.reload();
    await page.waitForTimeout(600);
    expect(await conversions(page)).toHaveLength(0);

    // back / forward navigation does not fire either
    await page.goto(`${TRACK}/`);
    await page.goBack();
    await page.waitForTimeout(400);
    expect(await conversions(page)).toHaveLength(0);
  });

  test('(c) direct visit to /thank-you → NO conversion (page still renders)', async ({ page }) => {
    await mockNetwork(page);
    await page.goto(`${TRACK}/thank-you`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('شكراً لك');
    await page.waitForTimeout(600);
    expect(await conversions(page)).toHaveLength(0);
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
  });

  test('(d) two separate submissions → one conversion each, different transaction_id', async ({ page }) => {
    await mockNetwork(page);
    const ids: unknown[] = [];
    for (let i = 0; i < 2; i++) {
      await page.goto(`${TRACK}/`);
      await submitLead(page);
      await page.waitForURL('**/thank-you');
      await page.waitForTimeout(400);
      const conv = await conversions(page);
      expect(conv).toHaveLength(1);
      ids.push(conv[0].transaction_id);
    }
    expect(ids[0]).not.toBe(ids[1]);
  });

  test('(e) failed API → no redirect, no conversion, Arabic error + Call/WhatsApp fallback', async ({ page }) => {
    await mockNetwork(page, { abort: true });
    await page.goto(`${TRACK}/`);
    await submitLead(page);
    const alert = page.locator('#lead-form [role=alert]').last();
    await expect(alert).toContainText('تعذّر الاتصال');
    await expect(alert.getByRole('link', { name: /اتصل/ })).toHaveAttribute('href', /^tel:/);
    await expect(alert.getByRole('link', { name: /واتساب/ })).toHaveAttribute('href', /wa\.me\/.+text=/);
    expect(page.url()).not.toContain('thank-you');
    expect(await conversions(page)).toHaveLength(0);
  });

  test('(f) rate-limited (429) → friendly Arabic message + fallback buttons', async ({ page }) => {
    await mockNetwork(page, { status: 429, body: { success: false, error: 'rate_limited' } });
    await page.goto(`${TRACK}/`);
    await submitLead(page);
    const alert = page.locator('#lead-form [role=alert]').last();
    await expect(alert).toContainText('حاول بعد 10 دقائق');
    await expect(alert.getByRole('link', { name: /واتساب/ })).toBeVisible();
    expect(await conversions(page)).toHaveLength(0);
  });
});

test.describe('No tracking when VITE_* IDs are empty', () => {
  test('no Google script requested, no gtag, no console errors — on every route', async ({ page }) => {
    const googleRequests: string[] = [];
    const errors: string[] = [];
    page.on('request', (r) => {
      if (/googletagmanager|google-analytics|googleadservices|doubleclick/.test(r.url())) googleRequests.push(r.url());
    });
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.route('**/api/lead', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }));

    for (const path of ['/', '/units', '/gallery', '/privacy', '/thank-you']) {
      await page.goto(`${PLAIN}${path}`, { waitUntil: 'networkidle' });
    }
    // a full submit also must not try to load anything
    await page.goto(`${PLAIN}/`);
    await submitLead(page);
    await page.waitForURL('**/thank-you');
    await page.waitForTimeout(500);

    expect(googleRequests).toEqual([]);
    expect(await page.evaluate(() => typeof window.gtag)).toBe('undefined');
    expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
    expect(errors).toEqual([]);
  });
});
