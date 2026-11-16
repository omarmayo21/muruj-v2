import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const winChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

/**
 * Two production builds are tested with `vite preview`:
 *  - TRACK  (port 4180): fake GA4 / Google Ads IDs → conversion tests
 *  - PLAIN  (port 4181): all VITE_* IDs empty      → site checks + "no tracking" checks
 * /api/lead and Google scripts are mocked inside the tests (no real network calls).
 */
const TRACK_ENV = {
  VITE_GA_MEASUREMENT_ID: 'G-TEST123',
  VITE_GTM_ID: '',
  VITE_GOOGLE_ADS_ID: 'AW-TEST',
  VITE_GOOGLE_ADS_CONVERSION_ID: 'AW-TEST',
  VITE_GOOGLE_ADS_CONVERSION_LABEL: 'TestLabel',
};
const PLAIN_ENV = {
  VITE_GA_MEASUREMENT_ID: '',
  VITE_GTM_ID: '',
  VITE_GOOGLE_ADS_ID: '',
  VITE_GOOGLE_ADS_CONVERSION_ID: '',
  VITE_GOOGLE_ADS_CONVERSION_LABEL: '',
};

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  projects: [
    {
      name: 'chromium',
      use: {
        locale: 'ar-EG',
        ...(existsSync(winChrome) ? { channel: 'chrome' } : {}),
      },
    },
  ],
  webServer: [
    {
      command: 'npx vite build --outDir node_modules/.pw/track --emptyOutDir --logLevel error && npx vite preview --outDir node_modules/.pw/track --port 4180 --strictPort',
      env: TRACK_ENV,
      url: 'http://localhost:4180',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npx vite build --outDir node_modules/.pw/plain --emptyOutDir --logLevel error && npx vite preview --outDir node_modules/.pw/plain --port 4181 --strictPort',
      env: PLAIN_ENV,
      url: 'http://localhost:4181',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
