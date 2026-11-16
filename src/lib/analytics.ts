/**
 * Analytics loader: GTM + gtag.js (GA4 + Google Ads).
 * Each tag loads ONLY if its env variable is set — when all VITE_* IDs are
 * empty, no external script is requested and nothing is logged.
 */
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const env = import.meta.env;
export const GA_ID = (env.VITE_GA_MEASUREMENT_ID || '').trim();
export const GTM_ID = (env.VITE_GTM_ID || '').trim();
export const ADS_ID = (env.VITE_GOOGLE_ADS_ID || '').trim();
export const ADS_CONV_ID = (env.VITE_GOOGLE_ADS_CONVERSION_ID || '').trim();
export const ADS_CONV_LABEL = (env.VITE_GOOGLE_ADS_CONVERSION_LABEL || '').trim();

/** true when at least one tag is configured */
export const TRACKING_ENABLED = !!(GA_ID || GTM_ID || ADS_ID || ADS_CONV_ID);

/* ------------------------------------------------------------------ */
/*  Consent Mode                                                       */
/* ------------------------------------------------------------------ */
/**
 * Consent defaults. Tracking is NOT blocked for this market (Egypt), so every
 * signal is "granted". The structure is Consent Mode v2-ready: to add a
 * cookie banner later, change these defaults to 'denied' for EEA visitors and
 * call `updateConsent({...})` from the banner's "Accept" button.
 */
export type ConsentState = 'granted' | 'denied';
export interface ConsentSettings {
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
  analytics_storage: ConsentState;
}
export const CONSENT_DEFAULTS: ConsentSettings = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
};

/** Call this from a future consent banner */
export function updateConsent(settings: Partial<ConsentSettings>) {
  if (window.gtag) window.gtag('consent', 'update', settings);
}

/* ------------------------------------------------------------------ */

let initialized = false;

function inject(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  if (!TRACKING_ENABLED) return; // nothing configured → load nothing

  // gtag() stub is defined whenever any tag exists so consent is set FIRST
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', { ...CONSENT_DEFAULTS, wait_for_update: 0 });

  // ---- Google Tag Manager ----
  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    inject(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`);
  }

  // ---- gtag.js (GA4 and/or Google Ads) ----
  // The Ads conversion ID (AW-XXXX) is used for config if VITE_GOOGLE_ADS_ID is empty.
  const adsConfigId = ADS_ID || ADS_CONV_ID;
  const primary = GA_ID || adsConfigId;
  if (primary) {
    window.gtag('js', new Date());
    if (GA_ID) window.gtag('config', GA_ID, { send_page_view: false });
    if (adsConfigId) window.gtag('config', adsConfigId, { allow_enhanced_conversions: true });
    inject(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primary)}`);
  }
}

/** Push to dataLayer (GTM) and send as gtag event (GA4) */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (window.gtag && GA_ID) window.gtag('event', event, { ...params, send_to: GA_ID });
}

/** SPA page view — called on every route change */
export function trackPageView(path: string, title: string) {
  const params = { page_path: path, page_location: window.location.href, page_title: title };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'page_view', ...params });
  if (window.gtag && GA_ID) window.gtag('event', 'page_view', { ...params, send_to: GA_ID });
}

export interface ConversionPayload {
  /** unique per submission — Google Ads de-duplicates on it */
  transaction_id: string;
  unit?: string;
  sha256_email_address?: string;
  sha256_phone_number?: string;
}

/**
 * Fires the Google Ads conversion + GA4 generate_lead + GTM lead_conversion.
 * Must be called ONLY from /thank-you after a verified successful submit.
 */
export function fireLeadConversion(p: ConversionPayload) {
  window.dataLayer = window.dataLayer || [];

  // Enhanced Conversions — SHA-256 hashed, normalised user data (skipped if unavailable)
  const userData: Record<string, string> = {};
  if (p.sha256_email_address) userData.sha256_email_address = p.sha256_email_address;
  if (p.sha256_phone_number) userData.sha256_phone_number = p.sha256_phone_number;
  const hasUserData = Object.keys(userData).length > 0;
  if (window.gtag && hasUserData) window.gtag('set', 'user_data', userData);

  // Google Ads conversion
  if (window.gtag && ADS_CONV_ID && ADS_CONV_LABEL) {
    window.gtag('event', 'conversion', {
      send_to: `${ADS_CONV_ID}/${ADS_CONV_LABEL}`,
      value: 1.0,
      currency: 'EGP',
      transaction_id: p.transaction_id,
      ...(hasUserData ? { user_data: userData } : {}),
    });
  }

  // GA4 generate_lead
  if (window.gtag && GA_ID) {
    window.gtag('event', 'generate_lead', { value: 1.0, currency: 'EGP', unit: p.unit, transaction_id: p.transaction_id, send_to: GA_ID });
  }

  // GTM
  window.dataLayer.push({
    event: 'lead_conversion',
    value: 1.0,
    currency: 'EGP',
    unit: p.unit,
    transaction_id: p.transaction_id,
    enhanced_conversion_data: userData,
  });
}
