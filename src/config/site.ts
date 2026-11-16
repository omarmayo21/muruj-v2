/**
 * ============================================================
 *  SITE CONFIG — fill the placeholders below before going live
 * ============================================================
 *  • phone / whatsapp: put YOUR numbers here (they appear in the header,
 *    floating buttons, footer and thank-you page).
 *  • siteUrl: your production domain (used for canonical / OG / sitemap).
 */
export const SITE = {
  /** Production URL without trailing slash, e.g. https://muruj-smouha.com */
  siteUrl: 'https://YOUR-DOMAIN.vercel.app',

  /** Call number in international format WITHOUT spaces, e.g. +201000000000 */
  phone: '+20XXXXXXXXXX',
  /** Human-readable version shown on the page, e.g. 0100 000 0000 */
  phoneDisplay: '01XX XXX XXXX',
  /** WhatsApp number digits only with country code, e.g. 201000000000 */
  whatsapp: '20XXXXXXXXXX',
  /** Pre-filled WhatsApp message */
  whatsappMessage: {
    ar: 'مرحباً، مهتم بكمبوند مروج سموحة وأرغب في معرفة التفاصيل',
    en: 'Hello, I am interested in Muruj Compound Smouha and would like more details',
  },
  /** Optional contact email shown in the footer (leave empty to hide) */
  email: '',

  /** Toggle price display (prices are indicative asking prices from the sources) */
  showPrices: true,

  /**
   * Google Map embed. The 4 source pages do NOT publish exact project
   * coordinates, so a place-name search is used. If you get exact coordinates,
   * set lat/lng and they will be used instead.
   */
  map: {
    enabled: true,
    query: 'Muruj Smouha, Alexandria, Egypt',
    lat: null as number | null,
    lng: null as number | null,
  },
} as const;

/**
 * Options of the "اختر الوحدة / المساحة" select in the lead form.
 * Based ONLY on unit types/areas published in the sources (see DATA_CONFLICTS.md):
 *  - No 1-bedroom or studio units exist in any source → intentionally not offered.
 *  - 2 bedrooms: 106–123 m² · 3 bedrooms: 131 m² up to 257 m² (top of the published
 *    project range; largest explicit 3-bed listing is 217 m²) · Duplex: up to 479 m²
 *    (top of U Park apartments & duplex range) · Alforat standalone villas V1–V4.
 * `value` is exactly what is saved in the email and the Google Sheet.
 */
export const unitOptions: ReadonlyArray<{ value: string; label: { ar: string; en: string } }> = [
  { value: 'غرفتين (106–123 م²)', label: { ar: 'غرفتين (106–123 م²)', en: '2 bedrooms (106–123 m²)' } },
  { value: '3 غرف (131–257 م²)', label: { ar: '3 غرف (131–257 م²)', en: '3 bedrooms (131–257 m²)' } },
  { value: 'دوبلكس (حتى 479 م²)', label: { ar: 'دوبلكس (حتى 479 م²)', en: 'Duplex (up to 479 m²)' } },
  { value: 'فيلا مستقلة (الفرات V1–V4)', label: { ar: 'فيلا مستقلة (الفرات V1–V4)', en: 'Standalone villa (Alforat V1–V4)' } },
  { value: 'غير محدد / أريد استشارة', label: { ar: 'غير محدد / أريد استشارة', en: 'Not sure / I need advice' } },
];

/** Phone placeholders still present? (used to show a dev warning in console) */
export const isPlaceholderPhone = SITE.phone.includes('X') || SITE.whatsapp.includes('X');

export function whatsappLink(lang: 'ar' | 'en' = 'ar') {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage[lang])}`;
}
export function telLink() {
  return `tel:${SITE.phone}`;
}
