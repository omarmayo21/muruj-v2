/**
 * Per-route SEO (title + description, AR/EN). Used by the pages (useHead) AND by the
 * build plugin in vite.config.ts that pre-renders one HTML shell per route, so crawlers
 * and social previews see the right tags without running JavaScript.
 */
export type RoutePath = '/' | '/units' | '/gallery' | '/thank-you' | '/privacy';
export interface RouteSeo {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  noindex?: boolean;
}

export const ROUTE_SEO: Record<RoutePath, RouteSeo> = {
  '/': {
    title: { ar: 'كمبوند مروج سموحة | شقق وفيلات للبيع بالتقسيط — الإسكندرية', en: 'Muruj Compound Smouha | Apartments & Villas for Sale — Alexandria' },
    description: { ar: 'كمبوند مروج سموحة على 182 فدان أمام جرين بلازا بالإسكندرية: شقق من 106 م²، دوبلكس، فيلات مستقلة ووحدات إدارية. مقدم من 10% وتقسيط حتى 6 سنوات. سجّل الآن للأسعار.', en: 'Muruj Compound Smouha — 182 feddans opposite Green Plaza, Alexandria: apartments from 106 m², duplexes, standalone villas and admin units. From 10% down, up to 6 years.' },
  },
  '/units': {
    title: { ar: 'الوحدات والمساحات والمساقط | كمبوند مروج سموحة', en: 'Units, Areas & Floor Plans | Muruj Compound Smouha' },
    description: { ar: 'كل أنواع الوحدات في مروج سموحة: شقق غرفتين و3 غرف من 106 إلى 217 م²، يو بارك حتى 479 م²، مروج هايتس، زينيا، ڤي مروج، وفيلات الفرات V1–V4 مع المساقط.', en: 'All unit types at Muruj Smouha: 2 & 3-bedroom apartments 106–217 m², U Park up to 479 m², Muruj Heights, Zinnia, Vee Muruj and Alforat villas V1–V4 with floor plans.' },
  },
  '/gallery': {
    title: { ar: 'صور كمبوند مروج سموحة والمخطط العام والموقع', en: 'Muruj Compound Smouha Gallery, Master Plan & Location' },
    description: { ar: 'معرض صور كمبوند مروج سموحة: صور فعلية وتصميمات الفيلات والعمارات، المخطط العام، المرافق، وخريطة الموقع أمام جرين بلازا بالإسكندرية.', en: 'Muruj Compound Smouha gallery: real photos, villa and tower renders, master plan, facilities and location map opposite Green Plaza, Alexandria.' },
  },
  '/thank-you': {
    title: { ar: 'شكراً لك | كمبوند مروج سموحة', en: 'Thank you | Muruj Compound Smouha' },
    description: { ar: 'تم استلام طلبك وسيتواصل معك فريقنا قريباً.', en: 'Your request was received; our team will contact you shortly.' },
    noindex: true,
  },
  '/privacy': {
    title: { ar: 'سياسة الخصوصية | كمبوند مروج سموحة', en: 'Privacy Policy | Muruj Compound Smouha' },
    description: { ar: 'سياسة الخصوصية لموقع كمبوند مروج سموحة: البيانات التي نجمعها، سبب جمعها، ملفات تعريف الارتباط، وكيفية طلب حذف بياناتك.', en: 'Privacy policy of the Muruj Compound Smouha website: data we collect, why, cookies, and how to request deletion.' },
  },
};
