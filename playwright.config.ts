import { defineConfig } from '@playwright/test';

/**
 * Two production builds are tested with `vite preview`:
 *  - TRACK  (port 4180): fake GA4 / Google Ads IDs → conversion tests
 *  - PLAIN  (port 4181): all VITE_* IDs empty      → site checks + "no tracking" checks
 * /api/lead and Google scripts are mocked inside the tests (no real network calls).
 */
const TRACK_ENV =
  'VITE_GA_MEASUREMENT_ID=G-TEST123 VITE_GTM_ID= VITE_GOOGLE_ADS_ID=AW-TEST VITE_GOOGLE_ADS_CONVERSION_ID=AW-TEST VITE_GOOGLE_ADS_CONVERSION_LABEL=TestLabel';
const PLAIN_ENV = 'VITE_GA_MEASUREMENT_ID= VITE_GTM_ID= VITE_GOOGLE_ADS_ID= VITE_GOOGLE_ADS_CONVERSION_ID= VITE_GOOGLE_ADS_CONVERSION_LABEL=';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { locale: 'ar-EG' },
  webServer: [
    {
      command: `${TRACK_ENV} npx vite build --outDir node_modules/.pw/track --emptyOutDir --logLevel error && npx vite preview --outDir node_modules/.pw/track --port 4180 --strictPort`,
      url: 'http://localhost:4180',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: `${PLAIN_ENV} npx vite build --outDir node_modules/.pw/plain --emptyOutDir --logLevel error && npx vite preview --outDir node_modules/.pw/plain --port 4181 --strictPort`,
      url: 'http://localhost:4181',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
