import { test, expect, type Page } from '@playwright/test';
import { PLAIN } from './helpers';

const ROUTES = ['/', '/units', '/gallery', '/thank-you', '/privacy'];
const WIDTHS = [360, 390, 768, 1280];

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForLoadState('networkidle');
}

test.describe('All routes: load, RTL, no console errors, no broken images', () => {
  for (const path of ROUTES) {
    test(`route ${path}`, async ({ page }) => {
      const errors: string[] = [];
      const failed: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));

      const res = await page.goto(`${PLAIN}${path}`, { waitUntil: 'networkidle' });
      expect(res?.status()).toBe(200);
      expect(await page.evaluate(() => [document.documentElement.lang, document.documentElement.dir])).toEqual(['ar', 'rtl']);
      await expect(page.locator('h1').first()).toBeVisible();

      await scrollThrough(page);
      // force every lazy image to load, wait for load/error, then check it decoded
      const broken = await page.evaluate(async () => {
        const imgs = Array.from(document.images);
        imgs.forEach((img) => (img.loading = 'eager'));
        await Promise.all(
          imgs.map((img) =>
            img.complete ? null : new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); setTimeout(r, 15000); }),
          ),
        );
        return imgs.filter((img) => img.naturalWidth === 0).map((img) => img.currentSrc || img.src);
      });
      expect(broken, 'broken images').toEqual([]);
      expect(failed, 'failed requests').toEqual([]);
      expect(errors, 'console errors').toEqual([]);
    });
  }

  test('unknown route → redirects to home', async ({ page }) => {
    await page.goto(`${PLAIN}/does-not-exist`);
    await page.waitForURL(`${PLAIN}/`);
    expect(new URL(page.url()).pathname).toBe('/');
  });
});

test.describe('Responsive RTL — no horizontal scroll', () => {
  for (const width of WIDTHS) {
    test(`width ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const path of ROUTES) {
        await page.goto(`${PLAIN}${path}`, { waitUntil: 'networkidle' });
        const sw = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(sw, `${path} @${width}px`).toBeLessThanOrEqual(width);
      }
    });
  }
});

test.describe('Navigation & compliance', () => {
  test('exactly 4 main pages: nav has 3 links (Home/Units/Gallery) + /thank-you; /privacy only in footer', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${PLAIN}/`);
    const navLinks = await page.locator('header nav a').evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
    expect(navLinks).toEqual(['/', '/units', '/gallery']);
    expect(await page.locator('header a[href="/privacy"]').count()).toBe(0);
    await expect(page.locator('footer a[href="/privacy"]').first()).toBeVisible();
  });

  test('footer disclaimers on every page', async ({ page }) => {
    for (const path of ROUTES) {
      await page.goto(`${PLAIN}${path}`);
      const footer = page.locator('footer');
      await expect(footer).toContainText('الصور والمعلومات استرشادية وقابلة للتغيير');
      await expect(footer).toContainText('هذا الموقع تسويقي ولا يمثل الموقع الرسمي للمطور');
      await expect(footer.locator('a[href="/privacy"]').first()).toBeVisible();
    }
  });

  test('privacy page content + consent line under the form', async ({ page }) => {
    await page.goto(`${PLAIN}/privacy`);
    await expect(page.locator('h1')).toHaveText('سياسة الخصوصية');
    for (const t of ['الاسم', 'رقم الهاتف', 'البريد الإلكتروني', 'gclid', 'Google Analytics', 'لا نبيع بياناتك', 'حذف', 'آخر تحديث']) {
      await expect(page.locator('article')).toContainText(t);
    }
    await page.goto(`${PLAIN}/`);
    const consent = page.locator('#lead-form form').first().getByText('بالضغط على الزر أنت توافق على');
    await expect(consent).toBeVisible();
    await expect(page.locator('#lead-form form').first().locator('a[href="/privacy"]')).toHaveText('سياسة الخصوصية');
  });

  test('unit select has exactly the 5 data-based options (no 1-bedroom / studio)', async ({ page }) => {
    await page.goto(`${PLAIN}/`);
    const select = page.locator('#lead-form select[name=unit]').first();
    await select.waitFor(); // form chunk is lazy-loaded
    const opts = await select.locator('option:not([disabled])').allTextContents();
    expect(opts.map((o) => o.trim())).toEqual([
      'غرفتين (106–123 م²)',
      '3 غرف (131–257 م²)',
      'دوبلكس (حتى 479 م²)',
      'فيلا مستقلة (الفرات V1–V4)',
      'غير محدد / أريد استشارة',
    ]);
    const all = (await page.content()).replace(/<[^>]+>/g, ' ');
    expect(all).not.toMatch(/ستوديو|استوديو|غرفة واحدة/);
  });
});

test.describe('Form UX', () => {
  test('field attributes, Egypt default, numeric keypad, full-width submit, Arabic errors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${PLAIN}/`);
    const form = page.locator('#lead-form form').first();
    await expect(form.locator('input[name=name]')).toHaveAttribute('autocomplete', 'name');
    const phone = form.locator('input[name=phone]');
    await expect(phone).toHaveAttribute('type', 'tel');
    await expect(phone).toHaveAttribute('inputmode', 'tel');
    await expect(phone).toHaveAttribute('autocomplete', 'tel-national');
    await expect(form.locator('input[name=email]')).toHaveAttribute('inputmode', 'email');
    await expect(form.locator('input[name=email]')).toHaveAttribute('autocomplete', 'email');
    await expect(form.locator('button[aria-haspopup=listbox]')).toContainText('+20');

    const btn = form.locator('button[type=submit]');
    const [bw, fw] = await Promise.all([btn.evaluate((b) => b.getBoundingClientRect().width), form.evaluate((f) => f.getBoundingClientRect().width)]);
    expect(bw).toBeGreaterThanOrEqual(fw - 1);

    // auto-format + Arabic errors
    await phone.fill('01001234567');
    expect((await phone.inputValue()).replace(/\D/g, '')).toBe('01001234567');
    await phone.fill('0100');
    await btn.click();
    await expect(form.locator('[role=alert]').first()).toContainText('من فضلك');
    await expect(form).toContainText('رقم');

    // searchable country list (Arabic)
    await form.locator('button[aria-haspopup=listbox]').click();
    await form.locator('input[type=search]').fill('سعود');
    await expect(form.locator('[role=option]').first()).toContainText('السعودية');
  });

  test('CTA scrolls to the form and focuses the name field', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${PLAIN}/`);
    await page.locator('header').getByRole('button', { name: 'احجز الآن' }).click();
    await expect(page.locator('#lead-form input[name=name]').first()).toBeFocused({ timeout: 4000 });
    await expect(page.locator('#lead-form')).toBeInViewport();
  });

  test('floating Call/WhatsApp: mobile only, numbers from site.ts, Arabic prefilled message', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${PLAIN}/`);
    const bar = page.locator('div.fixed.bottom-0');
    await expect(bar).toBeVisible();
    await expect(bar.locator('a[href^="tel:"]')).toHaveAttribute('href', /^tel:\+20/);
    const wa = await bar.locator('a[href*="wa.me"]').getAttribute('href');
    expect(decodeURIComponent(wa!.split('text=')[1])).toBe('مرحباً، مهتم بكمبوند مروج سموحة وأرغب في معرفة التفاصيل');

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(bar).toBeHidden();
    expect(await page.locator('a.fixed[href*="wa.me"]').count()).toBe(0);
  });
});
