/**
 * Per-route SEO (title + description, AR/EN). Used by the pages (useHead) AND by the
 * build plugin in vite.config.ts that pre-renders one HTML shell per route, so crawlers
 * and social previews see the right tags without running JavaScript.
 */
export type RoutePath = '/' | '/units' | '/gallery' | '/register' | '/contact' | '/thank-you' | '/privacy';
export interface RouteSeo {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  noindex?: boolean;
}

export const ROUTE_SEO: Record<RoutePath, RouteSeo> = {
  '/': {
    title: { ar: 'كمبوند مروج سموحة | شقق وفيلات للبيع بالتقسيط — الإسكندرية', en: 'Muruj Compound Smouha | Apartments & Villas for Sale — Alexandria' },
    description: {
      ar: 'كمبوند مروج سموحة على 182 فدان أمام جرين بلازا بالإسكندرية: شقق، دوبلكس، فيلات مستقلة ووحدات إدارية بمساحات من 88 م² حتى 479 م². مقدم من 10% وتقسيط حتى 6 سنوات. سجّل اهتمامك الآن.',
      en: 'Muruj Compound Smouha — 182 feddans opposite Green Plaza, Alexandria: apartments, duplexes, standalone villas and admin units from 88 m² up to 479 m². From 10% down, up to 6 years.',
    },
  },
  '/units': {
    title: { ar: 'الوحدات والمساحات والمساقط | كمبوند مروج سموحة', en: 'Units, Areas & Floor Plans | Muruj Compound Smouha' },
    description: {
      ar: 'كل أنواع الوحدات في مروج سموحة بمساحات من 88 م² حتى 479 م²: شقق تبدأ من 88 م²، غرفتين و3 غرف، يو بارك، مروج هايتس، زينيا، ڤي مروج، وفيلات الفرات V1–V4 مع المساقط.',
      en: 'All unit types at Muruj Smouha from 88 m² up to 479 m²: apartments starting from 88 m², 2 & 3-bedroom layouts, U Park, Muruj Heights, Zinnia, Vee Muruj and Alforat villas V1–V4.',
    },
  },
  '/gallery': {
    title: { ar: 'صور كمبوند مروج سموحة والمخطط العام والموقع', en: 'Muruj Compound Smouha Gallery, Master Plan & Location' },
    description: {
      ar: 'معرض صور كمبوند مروج سموحة: صور فعلية وتصميمات الفيلات والعمارات، المخطط العام، المرافق، وخريطة الموقع أمام جرين بلازا بالإسكندرية.',
      en: 'Muruj Compound Smouha gallery: real photos, villa and tower renders, master plan, facilities and location map opposite Green Plaza, Alexandria.',
    },
  },
  '/register': {
    title: { ar: 'سجّل اهتمامك بكمبوند مروج سموحة | شقق وفيلات بسموحة', en: 'Register Your Interest | Muruj Compound Smouha' },
    description: {
      ar: 'سجّل اهتمامك بكمبوند مروج سموحة على 182 فدان أمام جرين بلازا بالإسكندرية — مساحات من 88 م² حتى 479 م² وأنظمة سداد مرنة حتى 6 سنوات.',
      en: 'Register your interest in Muruj Compound Smouha on 182 feddans opposite Green Plaza, Alexandria — unit areas from 88 m² up to 479 m² and flexible payment plans up to 6 years.',
    },
  },
  '/contact': {
    title: { ar: 'اتصل بنا | كمبوند مروج سموحة — الإسكندرية', en: 'Contact Us | Muruj Compound Smouha — Alexandria' },
    description: {
      ar: 'تواصل مع فريق مبيعات كمبوند مروج سموحة بالإسكندرية عبر الهاتف أو واتساب أو نموذج التواصل لمعرفة المساحات المتاحة من 88 م² حتى 479 م² وأنظمة السداد.',
      en: 'Contact the Muruj Compound Smouha sales team in Alexandria by phone, WhatsApp or contact form for available areas from 88 m² up to 479 m² and payment plans.',
    },
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
