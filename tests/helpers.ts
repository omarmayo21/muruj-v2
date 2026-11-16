import type { Page } from '@playwright/test';
import { createHash } from 'node:crypto';

export const TRACK = 'http://localhost:4180';
export const PLAIN = 'http://localhost:4181';

export const sha256 = (v: string) => createHash('sha256').update(v).digest('hex');

/** Mock the lead API (success by default) and Google scripts; returns captured request bodies */
export async function mockNetwork(page: Page, opts: { status?: number; body?: unknown; abort?: boolean } = {}) {
  const leads: Record<string, unknown>[] = [];
  await page.route('**/api/lead', async (route) => {
    leads.push(JSON.parse(route.request().postData() || '{}'));
    if (opts.abort) return route.abort('internetdisconnected');
    await route.fulfill({ status: opts.status ?? 200, contentType: 'application/json', body: JSON.stringify(opts.body ?? { success: true }) });
  });
  await page.route(/googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/, (route) =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: '/* mocked */' }),
  );
  return leads;
}

/** gtag() pushes `arguments` objects to dataLayer — return them as plain arrays */
export async function gtagCalls(page: Page): Promise<unknown[][]> {
  return page.evaluate(() =>
    (window.dataLayer || [])
      .filter((x) => Object.prototype.toString.call(x) === '[object Arguments]')
      .map((x) => JSON.parse(JSON.stringify(Array.from(x as ArrayLike<unknown>)))),
  );
}

export async function conversions(page: Page) {
  const calls = await gtagCalls(page);
  return calls.filter((c) => c[0] === 'event' && c[1] === 'conversion').map((c) => c[2] as Record<string, unknown>);
}

/** Fill and submit the first lead form on the page */
export async function submitLead(page: Page, email = 'Test.User@Example.com ') {
  const form = page.locator('#lead-form form').first();
  await form.scrollIntoViewIfNeeded();
  await form.locator('input[name=name]').fill('اختبار تلقائي');
  await form.locator('input[name=phone]').fill('01001234567');
  await form.locator('input[name=email]').fill(email);
  await form.locator('select[name=unit]').selectOption({ index: 1 });
  await page.waitForTimeout(900); // the API drops submissions faster than 800 ms (anti-bot)
  await form.locator('button[type=submit]').click();
}
