/**
 * ============================================================
 *  PROJECT DATA — single source of truth for page content.
 * ============================================================
 *  Every fact below was taken from one of the 4 source pages:
 *   [S1] solvahomes.com/projects/muruj-compound
 *   [S2] broker.com.eg/project/muruj
 *   [S3] alforat.com.eg/ar/our-projects/alforat-compound  (developer – official)
 *        + the brochure PDF linked on that page (Alforat-Compound.pdf)
 *   [S4] smouha.org/project/muruj
 *  Nothing here is invented. See DATA_CONFLICTS.md / MISSING_DATA.md.
 */
import type { L } from './types';
import { IMAGES } from './images.generated';

export const PROJECT = {
  name: { ar: 'كمبوند مروج سموحة', en: 'Muruj Compound Smouha' } as L,
  shortName: { ar: 'مروج', en: 'Muruj' } as L,
  tagline: { ar: 'مجتمع متكامل على 182 فدان في قلب سموحة', en: 'An integrated 182-feddan community in the heart of Smouha' } as L,
  // [S1][S4]
  location: { ar: 'سموحة، الإسكندرية — أمام جرين بلازا مباشرة', en: 'Smouha, Alexandria — directly opposite Green Plaza' } as L,
  totalArea: { ar: '182 فدان', en: '182 feddans' } as L,
};

/* ---------------- HERO KEY INFO CARDS ---------------- */
export interface KeyInfo {
  icon: string;
  label: L;
  value: L;
  note?: L;
  priceOnly?: boolean;
}
export const KEY_INFO: KeyInfo[] = [
  { icon: 'pin', label: { ar: 'الموقع', en: 'Location' }, value: { ar: 'سموحة – أمام جرين بلازا', en: 'Smouha – opposite Green Plaza' } }, // S1
  { icon: 'area', label: { ar: 'المساحة الإجمالية', en: 'Total land area' }, value: { ar: '182 فدان', en: '182 feddans' } }, // S1 S4
  { icon: 'building', label: { ar: 'أنواع الوحدات', en: 'Unit types' }, value: { ar: 'شقق · دوبلكس · فيلات · إداري وطبي', en: 'Apartments · Duplex · Villas · Admin & medical' } }, // S4 S2
  { icon: 'ruler', label: { ar: 'المساحات', en: 'Unit areas' }, value: { ar: 'من 106 م² حتى 479 م²', en: '106 m² up to 479 m²' }, note: { ar: 'حسب المشروع الداخلي', en: 'depending on sub-project' } }, // S4 S2
  { icon: 'wallet', label: { ar: 'نظام السداد', en: 'Payment plan' }, value: { ar: 'مقدم من 10% · تقسيط حتى 6 سنوات', en: 'From 10% down · up to 6 years' } }, // S1 S4
  { icon: 'calendar', label: { ar: 'الاستلام', en: 'Delivery' }, value: { ar: 'جاهز للسكن · 2027 · 2028', en: 'Ready to move · 2027 · 2028' }, note: { ar: 'حسب الوحدة', en: 'per unit' } }, // S1 S2 S4
  { icon: 'users', label: { ar: 'المطورون', en: 'Developers' }, value: { ar: 'تشييد · الغنيمي · MWA · الفرات', en: 'Tasheed · El Ghoniemy · MWA · Alforat' } }, // S2 S4 S3
  { icon: 'tag', label: { ar: 'الأسعار', en: 'Prices' }, value: { ar: 'تبدأ من 5,890,000 ج.م', en: 'From EGP 5,890,000' }, note: { ar: 'أسعار استرشادية', en: 'indicative' }, priceOnly: true }, // S1
];

/* ---------------- ABOUT ---------------- */
export const ABOUT = {
  paragraphs: [
    {
      ar: 'يقع كمبوند مروج في سموحة بالإسكندرية، أمام جرين بلازا مباشرة، وعلى مساحة ضخمة تبلغ 182 فدان. المشروع متكامل ويضم مناطق تجارية وإدارية وحدائق وشقق سكنية.',
      en: 'Muruj Compound is located in Smouha, Alexandria, directly opposite Green Plaza, on a vast 182-feddan plot. It is an integrated project that includes commercial and administrative zones, gardens and residential apartments.',
    },
    {
      ar: 'مروج مجتمع واحد عند مدخل سموحة يضم شققاً ودوبلكس وفيلات ومشروعات لمطورين مختلفين، وميزة هذا التنوع أنك تستطيع اختيار التقسيمة ونظام الدفعات وموعد السكن الأقرب لاحتياجك.',
      en: 'Muruj is one community at the entrance of Smouha with apartments, duplexes, villas and projects by different developers — so you can pick the layout, payment schedule and move-in date that fit your needs.',
    },
    {
      ar: 'ويضم المجتمع فللاً للبيع في واحدة من أرقى مناطق الإسكندرية، ويتميز بقربه من المرافق والخدمات الهامة مثل نادي سموحة الرياضي والمستشفيات والمدارس الدولية الرائدة بالإسكندرية.',
      en: 'The community also offers villas for sale in one of Alexandria’s most prestigious areas, close to key amenities such as Smouha Sporting Club, top hospitals and leading international schools.',
    },
  ] as L[],
  // [S1] "مميزات المشروع"
  highlights: [
    { ar: 'برايم لوكيشن', en: 'Prime location' },
    { ar: 'قريب من جميع الخدمات', en: 'Close to all services' },
    { ar: 'قريب من النوادي والمدارس', en: 'Near clubs and schools' },
    { ar: 'يضم جميع المساحات', en: 'All unit sizes available' },
    { ar: 'متكامل الخدمات', en: 'Fully serviced community' },
  ] as L[],
  // [S4] "مروج مجتمع واحد ومشروعات باختيارات مختلفة"
  pillars: [
    {
      title: { ar: 'اختيارات الشقق', en: 'Apartment choices' },
      text: { ar: 'يو بارك وڤي مروج وزينيا ومروج هايتس تقدم تقسيمات ومبانٍ وأنظمة سداد مختلفة داخل المجتمع.', en: 'U Park, Vee Muruj, Zinnia and Muruj Heights offer different layouts, buildings and payment plans inside the community.' },
    },
    {
      title: { ar: 'الفيلات والوحدات المهنية', en: 'Villas & professional units' },
      text: { ar: 'الفرات يطرح أربعة أنواع فيلات مستقلة داخل مروج، وتشييد تطرح وحدات إدارية وطبية بتفاصيل تعاقد وتشغيل مستقلة عن الشقق.', en: 'Alforat offers four standalone villa types inside Muruj, while Tasheed offers administrative and medical units with their own contract terms.' },
    },
    {
      title: { ar: 'جاهز أو تحت الإنشاء', en: 'Ready or off-plan' },
      text: { ar: 'تتوفر شقق إعادة بيع مكتملة ومتشطبة يمكن معاينتها، ومشروعات تحت الإنشاء بدفعات وتواريخ تسليم مختلفة.', en: 'Finished, completed resale apartments you can visit, plus off-plan projects with different payment and delivery schedules.' },
    },
  ],
};

/* ---------------- SUB-PROJECTS (S2 + S4) ---------------- */
export interface SubProject {
  name: L;
  developer: L;
  type: L;
  areas: L;
  note?: L;
}
export const SUB_PROJECTS: SubProject[] = [
  { name: { ar: 'يو بارك', en: 'U Park' }, developer: { ar: 'تشييد', en: 'Tasheed' }, type: { ar: 'شقق ودوبلكس', en: 'Apartments & duplexes' }, areas: { ar: '125 – 479 م²', en: '125 – 479 m²' }, note: { ar: 'تحت الإنشاء', en: 'Under construction' } },
  { name: { ar: 'سالوجا — بلاتفورم', en: 'Saloga — Platform' }, developer: { ar: 'تشييد', en: 'Tasheed' }, type: { ar: 'سكني، وإداري وتجاري منفصل', en: 'Residential, separate admin & retail' }, areas: { ar: '113 – 229 م²', en: '113 – 229 m²' } },
  { name: { ar: 'سالوجا — ليك يارد', en: 'Saloga — Lake Yard' }, developer: { ar: 'تشييد', en: 'Tasheed' }, type: { ar: 'وحدات سكنية', en: 'Residential units' }, areas: { ar: '131 – 230 م²', en: '131 – 230 m²' } },
  { name: { ar: 'سالوجا — كلوب يارد', en: 'Saloga — Club Yard' }, developer: { ar: 'تشييد', en: 'Tasheed' }, type: { ar: 'وحدات سكنية', en: 'Residential units' }, areas: { ar: '118 – 213 م²', en: '118 – 213 m²' } },
  { name: { ar: 'مروج آيقون', en: 'Muruj Icon' }, developer: { ar: 'تشييد', en: 'Tasheed' }, type: { ar: 'سكني، وإداري وتجاري منفصل', en: 'Residential, separate admin & retail' }, areas: { ar: '140 – 350 م²', en: '140 – 350 m²' } },
  { name: { ar: 'ڤي مروج', en: 'Vee Muruj' }, developer: { ar: 'الغنيمي', en: 'El Ghoniemy' }, type: { ar: 'شقق سكنية — تقسيمات ثلاث غرف ومراحل بنماذج مستقلة', en: 'Apartments — 3-bedroom layouts, phases with own models' }, areas: { ar: '169 – 207 م² (النطاق العام للمطور) · نموذج 106 م² في ڤي سيبا 37', en: '169 – 207 m² (developer’s general range) · 106 m² model in Vee Seba 37' } },
  { name: { ar: 'زينيا مروج', en: 'Zinnia Muruj' }, developer: { ar: 'إم دبليو إيه MWA', en: 'MWA' }, type: { ar: 'غرفتين وثلاث غرف، وروف بتراسات منفصلة — مباني 12 و17 و20', en: '2 & 3 bedrooms, roofs with separate terraces — buildings 12, 17 & 20' }, areas: { ar: '114 – 205 م²', en: '114 – 205 m²' } },
  { name: { ar: 'مروج هايتس', en: 'Muruj Heights' }, developer: { ar: '—', en: '—' }, type: { ar: 'شقق — المبنى C والمبنى D', en: 'Apartments — buildings C & D' }, areas: { ar: '121 – 180 م²', en: '121 – 180 m²' } },
  { name: { ar: 'كمبوند الفرات', en: 'Alforat Compound' }, developer: { ar: 'الفرات للتطوير العقاري', en: 'Alforat Development' }, type: { ar: 'فيلات مستقلة', en: 'Standalone villas' }, areas: { ar: '4 نماذج V1 – V4', en: '4 models V1 – V4' } },
];

/* ---------------- UNIT TYPE CARDS (home) ---------------- */
export interface UnitCard {
  id: string;
  title: L;
  areas: L;
  details: L[];
  image: keyof typeof IMAGES;
}
export const UNIT_CARDS: UnitCard[] = [
  {
    id: '2br',
    title: { ar: 'شقق غرفتين', en: '2-bedroom apartments' },
    areas: { ar: '106 – 123 م²', en: '106 – 123 m²' },
    details: [
      { ar: 'نموذج 106 م² في ڤي مروج (ڤي سيبا 37)', en: '106 m² model in Vee Muruj (Vee Seba 37)' },
      { ar: 'وحدات معروضة 114 و120 و123 م² — غرفتين وحمامين، متشطبة', en: 'Listed units of 114, 120 & 123 m² — 2 bed / 2 bath, finished' },
    ],
    image: 'planVee106',
  },
  {
    id: '3br',
    title: { ar: 'شقق 3 غرف', en: '3-bedroom apartments' },
    areas: { ar: '131 – 217 م²', en: '131 – 217 m²' },
    details: [
      { ar: 'زينيا: مبنى A شقة 1 بمساحة 140 م²', en: 'Zinnia: Building A, flat 1 — 140 m²' },
      { ar: 'وحدات معروضة 145، 150، 151، 168، 169، 172، 179، 217 م²', en: 'Listed units of 145, 150, 151, 168, 169, 172, 179, 217 m²' },
    ],
    image: 'planZinnia140',
  },
  {
    id: 'heights',
    title: { ar: 'مروج هايتس', en: 'Muruj Heights' },
    areas: { ar: '121 – 180 م²', en: '121 – 180 m²' },
    details: [
      { ar: 'المبنى C: نماذج 121 و123 م²', en: 'Building C: 121 & 123 m² types' },
      { ar: 'المبنى D: نماذج 153 و163 و178 و180 م²', en: 'Building D: 153, 163, 178 & 180 m² types' },
    ],
    image: 'planHeights',
  },
  {
    id: 'duplex',
    title: { ar: 'شقق ودوبلكس — يو بارك', en: 'Apartments & duplexes — U Park' },
    areas: { ar: '125 – 479 م²', en: '125 – 479 m²' },
    details: [
      { ar: 'من تشييد — تحت الإنشاء', en: 'By Tasheed — under construction' },
      { ar: 'نموذج 151 م² بمقدم 10% والباقي على 4 سنوات', en: '151 m² model with 10% down, balance over 4 years' },
    ],
    image: 'apartmentTowers',
  },
  {
    id: 'villas',
    title: { ar: 'فيلات مستقلة — كمبوند الفرات', en: 'Standalone villas — Alforat Compound' },
    areas: { ar: '4 نماذج: V1 · V2 · V3 · V4', en: '4 models: V1 · V2 · V3 · V4' },
    details: [
      { ar: 'مجتمع مسوّر بكلوب هاوس وحمام سباحة وملاعب', en: 'Gated community with clubhouse, pool and courts' },
      { ar: 'فيلات أخرى معروضة في مروج: توين هاوس 279 م² وفيلا مستقلة 309 م²', en: 'Other villas listed in Muruj: 279 m² twin house, 309 m² standalone' },
    ],
    image: 'v1Front',
  },
  {
    id: 'admin',
    title: { ar: 'وحدات إدارية وطبية', en: 'Administrative & medical units' },
    areas: { ar: 'مكاتب 92 م² و151 م²', en: '92 m² & 151 m² offices' },
    details: [
      { ar: 'تطرحها تشييد بتفاصيل تعاقد مستقلة', en: 'Offered by Tasheed with separate contract terms' },
      { ar: 'مكتب 151 م² بتقسيط 8 سنوات', en: '151 m² office with 8-year installments' },
    ],
    image: 'apartmentFacades',
  },
];

/* ---------------- ALFORAT VILLAS (S3 + brochure) ---------------- */
export const VILLAS = [
  { code: 'V1', title: { ar: 'ستاند ألون — V1', en: 'Standalone — V1' }, rooms: { ar: 'غرفة ماستر · غرفتا نوم · 2 ريسبشن (ليفينج)', en: '1 master bedroom · 2 bedrooms · 2 living rooms' }, images: ['v1Front', 'v1Back'] },
  { code: 'V2', title: { ar: 'ستاند ألون — V2', en: 'Standalone — V2' }, rooms: { ar: 'غرفة ماستر · 3 غرف نوم · ريسبشن · مكتب · غرفة أنشطة', en: '1 master bedroom · 3 bedrooms · 1 living room · 1 office · 1 activity room' }, images: ['v2Front', 'v2Back'] },
  { code: 'V3', title: { ar: 'ستاند ألون — V3', en: 'Standalone — V3' }, rooms: { ar: 'غرفة ماستر · 3 غرف نوم · 3 ريسبشن (ليفينج)', en: '1 master bedroom · 3 bedrooms · 3 living rooms' }, images: ['v3Front', 'v3Back'] },
  { code: 'V4', title: { ar: 'ستاند ألون — V4', en: 'Standalone — V4' }, rooms: { ar: 'غرفتا ماستر · 3 غرف نوم · 3 ريسبشن (ليفينج)', en: '2 master bedrooms · 3 bedrooms · 3 living rooms' }, images: ['v4Front', 'v4Back'] },
] as const satisfies ReadonlyArray<{ code: string; title: L; rooms: L; images: ReadonlyArray<keyof typeof IMAGES> }>;

/* ---------------- FLOOR PLANS WITH DIMENSIONS ---------------- */
export const FLOOR_PLANS = [
  {
    image: 'planVee106',
    title: { ar: 'ڤي مروج — شقة غرفتين 106 م²', en: 'Vee Muruj — 2-bedroom 106 m²' },
    sub: { ar: 'مرحلة ڤي سيبا 37 · النموذج 2', en: 'Vee Seba 37 phase · Type 2' },
    rooms: [
      [{ ar: 'ريسبشن', en: 'Reception' }, '8.60 × 3.40 م'],
      [{ ar: 'تراس', en: 'Terrace' }, '3.40 × 1.20 م'],
      [{ ar: 'مطبخ', en: 'Kitchen' }, '3.30 × 3.20 م'],
      [{ ar: 'حمام', en: 'Bathroom' }, '2.20 × 1.90 م'],
      [{ ar: 'غرفة ماستر', en: 'Master bedroom' }, '5.10 × 3.60 م'],
      [{ ar: 'غرفة نوم 1', en: 'Bedroom 1' }, '3.60 × 3.50 م'],
    ],
  },
  {
    image: 'planZinnia140',
    title: { ar: 'زينيا مروج — شقة 3 غرف 140 م²', en: 'Zinnia Muruj — 3-bedroom 140 m²' },
    sub: { ar: 'المبنى A · شقة 1 · حمام ودورة مياه', en: 'Building A · Flat 1 · bathroom + guest toilet' },
    rooms: [
      [{ ar: 'مدخل', en: 'Entrance hall' }, '4.30 × 1.40 م'],
      [{ ar: 'دورة مياه', en: 'Toilet' }, '2.60 × 1.20 م'],
      [{ ar: 'مطبخ', en: 'Kitchen' }, '3.10 × 2.60 م'],
      [{ ar: 'ريسبشن', en: 'Reception' }, '8.10 × 4.00 م'],
      [{ ar: 'تراس 1', en: 'Terrace 1' }, '3.70 × 1.20 م'],
      [{ ar: 'غرفة نوم 1', en: 'Bedroom 1' }, '3.80 × 3.70 م'],
      [{ ar: 'غرفة نوم 2', en: 'Bedroom 2' }, '3.80 × 3.50 م'],
      [{ ar: 'غرفة نوم 3', en: 'Bedroom 3' }, '3.70 × 4.10 م'],
      [{ ar: 'حمام', en: 'Bathroom' }, '3.10 × 1.90 م'],
      [{ ar: 'تراس 2', en: 'Terrace 2' }, '1.20 × 1.00 م'],
    ],
  },
] as const satisfies ReadonlyArray<{ image: keyof typeof IMAGES; title: L; sub: L; rooms: ReadonlyArray<readonly [L, string]> }>;

export const HEIGHTS_TYPES = [
  { building: 'C', types: [['C1', 121], ['C2', 121], ['C3', 123], ['C4', 123]] },
  { building: 'D', types: [['D1', 153], ['D2', 180], ['D3', 178], ['D4', 163]] },
] as const;

/* ---------------- SAMPLE OFFERS (indicative prices) ---------------- */
export interface Offer {
  project: L;
  area: number;
  rooms?: number;
  baths?: number;
  price: number;
  payment: L;
  status: L;
}
const FIN = { ar: 'متشطب · مكتمل الإنشاء', en: 'Finished · completed' };
export const OFFERS: Offer[] = [
  { project: { ar: 'مروج — ڤي مروج', en: 'Muruj — Vee Muruj' }, area: 169, price: 6151000, payment: { ar: 'نقداً (إعادة بيع)', en: 'Cash (resale)' }, status: { ar: '—', en: '—' } },
  { project: { ar: 'مروج', en: 'Muruj' }, area: 151, rooms: 3, baths: 2, price: 6300000, payment: { ar: 'ريسيل — يتحدد الاتفاق على الوحدة', en: 'Resale — terms per unit' }, status: { ar: 'كاملة التشطيب · جاهزة', en: 'Fully finished · ready' } },
  { project: { ar: 'مروج', en: 'Muruj' }, area: 135, rooms: 3, baths: 3, price: 6300000, payment: { ar: '—', en: '—' }, status: FIN },
  { project: { ar: 'زينيا مروج', en: 'Zinnia Muruj' }, area: 164, rooms: 3, baths: 3, price: 6500000, payment: { ar: 'نقداً', en: 'Cash' }, status: { ar: 'تشطيب كامل · استلام 2027', en: 'Fully finished · delivery 2027' } },
  { project: { ar: 'مروج', en: 'Muruj' }, area: 168, rooms: 3, baths: 1, price: 6500000, payment: { ar: 'مقدم 1,300,000 ج.م · 4 سنوات', en: 'EGP 1,300,000 down · 4 years' }, status: { ar: 'تسليم 2027', en: 'Delivery 2027' } },
  { project: { ar: 'مروج — تشييد', en: 'Muruj — Tasheed' }, area: 140, rooms: 3, baths: 3, price: 6974000, payment: { ar: '—', en: '—' }, status: FIN },
  { project: { ar: 'مروج — فيو النادي', en: 'Muruj — club view' }, area: 145, rooms: 3, baths: 3, price: 7500000, payment: { ar: '—', en: '—' }, status: FIN },
  { project: { ar: 'مروج', en: 'Muruj' }, area: 150, rooms: 3, baths: 2, price: 8250000, payment: { ar: 'دفعة أولى 1,650,000 ج.م والباقي على 4 سنوات (16 قسط ربع سنوي × 412,500 ج.م)', en: 'EGP 1,650,000 first payment, balance over 4 years (16 quarterly × EGP 412,500)' }, status: { ar: 'كامل التشطيب · استلام 2028', en: 'Fully finished · delivery 2028' } },
  { project: { ar: 'يو بارك', en: 'U Park' }, area: 151, price: 8758000, payment: { ar: 'مقدم 10% (875,800 ج.م) والباقي على 4 سنوات', en: '10% down (EGP 875,800), balance over 4 years' }, status: { ar: 'تحت الإنشاء', en: 'Under construction' } },
  { project: { ar: 'مروج هايتس', en: 'Muruj Heights' }, area: 169, rooms: 3, baths: 3, price: 8788000, payment: { ar: 'تقسيط', en: 'Installments' }, status: { ar: 'سوبر لوكس', en: 'Super lux' } },
  { project: { ar: 'زينيا مروج', en: 'Zinnia Muruj' }, area: 172, rooms: 3, baths: 2, price: 9300000, payment: { ar: 'مقدم 1,860,000 ج.م (20%) والباقي على 5 سنوات', en: 'EGP 1,860,000 down (20%), balance over 5 years' }, status: { ar: 'الدور السادس · كامل التشطيب', en: '6th floor · fully finished' } },
  { project: { ar: 'مروج', en: 'Muruj' }, area: 217, rooms: 3, baths: 2, price: 12586000, payment: { ar: 'مقدم 1,258,600 ج.م · 4 سنوات', en: 'EGP 1,258,600 down · 4 years' }, status: { ar: 'تسليم 2027', en: 'Delivery 2027' } },
];

/* ---------------- PAYMENT PLANS ---------------- */
export interface PaymentPlan {
  title: L;
  highlight: L;
  lines: L[];
}
export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    title: { ar: 'نظام السداد المعلن للمشروع', en: 'Announced project plan' },
    highlight: { ar: '15% مقدم', en: '15% down payment' },
    lines: [
      { ar: 'أقساط ربع سنوية', en: 'Quarterly installments' },
      { ar: 'مدة التقسيط 6 سنوات', en: '6-year installment period' },
    ],
  },
  {
    title: { ar: 'يو بارك', en: 'U Park' },
    highlight: { ar: '10% مقدم', en: '10% down payment' },
    lines: [
      { ar: 'الباقي على 4 سنوات', en: 'Balance over 4 years' },
      { ar: 'مثال: 151 م² بإجمالي 8,758,000 ج.م — مقدم 875,800 ج.م', en: 'e.g. 151 m² at EGP 8,758,000 — EGP 875,800 down' },
    ],
  },
  {
    title: { ar: 'زينيا مروج', en: 'Zinnia Muruj' },
    highlight: { ar: '20% مقدم', en: '20% down payment' },
    lines: [
      { ar: 'رصيد السعر على 5 سنوات', en: 'Balance over 5 years' },
      { ar: 'مثال: 172 م² بإجمالي 9,300,000 ج.م — مقدم 1,860,000 ج.م', en: 'e.g. 172 m² at EGP 9,300,000 — EGP 1,860,000 down' },
    ],
  },
  {
    title: { ar: 'شقة 150 م² — نظام سداد معلن', en: '150 m² apartment — published plan' },
    highlight: { ar: '16 قسط ربع سنوي', en: '16 quarterly installments' },
    lines: [
      { ar: 'دفعة أولى 1,650,000 ج.م تشمل المقدم والأوفر', en: 'EGP 1,650,000 first payment incl. down payment & premium' },
      { ar: 'المتبقي 6,600,000 ج.م على 4 سنوات — القسط 412,500 ج.م', en: 'Remaining EGP 6,600,000 over 4 years — EGP 412,500 each' },
      { ar: 'استلام الوحدة 2028', en: 'Delivery 2028' },
    ],
  },
];

/* ---------------- AMENITIES ---------------- */
export interface Amenity {
  icon: string;
  title: L;
}
// Community-level [S1][S2][S4]
export const COMMUNITY_AMENITIES: Amenity[] = [
  { icon: 'club', title: { ar: 'نادي على مساحة 14 فدان', en: '14-feddan sporting & social club' } },
  { icon: 'school', title: { ar: 'مدارس ومرافق تعليمية', en: 'Schools & education facilities' } },
  { icon: 'hospital', title: { ar: 'مستشفى وخدمات طبية', en: 'Hospital & medical services' } },
  { icon: 'mall', title: { ar: 'مول ومنطقة تجارية', en: 'Mall & commercial zone' } },
  { icon: 'office', title: { ar: 'وحدات إدارية', en: 'Administrative units' } },
  { icon: 'pool', title: { ar: 'حمامات سباحة', en: 'Swimming pools' } },
  { icon: 'clubhouse', title: { ar: 'كلوب هاوس', en: 'Clubhouse' } },
  { icon: 'mosque', title: { ar: 'مسجد ودور عبادة', en: 'Mosque & places of worship' } },
  { icon: 'tree', title: { ar: 'مساحات خضراء وأفنية داخلية', en: 'Green areas & inner courtyards' } },
  { icon: 'door', title: { ar: 'مداخل مستقلة للمباني', en: 'Independent building entrances' } },
  { icon: 'car', title: { ar: 'جراجات حسب المشروع', en: 'Garages (per sub-project)' } },
];
// Alforat Compound clubhouse & facilities [S3 + brochure]
export const ALFORAT_FACILITIES: Amenity[] = [
  { icon: 'pool', title: { ar: 'حمام سباحة', en: 'Swimming pool' } },
  { icon: 'ball', title: { ar: 'ملعب متعدد الأغراض: تنس، كرة قدم، يد، سلة', en: 'Multipurpose court: tennis, football, handball, basketball' } },
  { icon: 'racket', title: { ar: 'ملعب اسكواش', en: 'Squash court' } },
  { icon: 'child', title: { ar: 'ملعب للأطفال', en: 'Kids playground' } },
  { icon: 'mosque', title: { ar: 'مسجد', en: 'Mosque' } },
  { icon: 'coffee', title: { ar: 'مقهى وكافتيريا وصالون', en: 'Café, cafeteria & lounge' } },
  { icon: 'users', title: { ar: 'غرفة اجتماعات ومكتب استقبال', en: 'Meeting room & reception' } },
  { icon: 'shield', title: { ar: 'مجتمع سكني محاط بالأسوار', en: 'Gated residential community' } },
];
export const INFRASTRUCTURE: Amenity[] = [
  { icon: 'road', title: { ar: 'شبكة طرق متكاملة', en: 'Road network' } },
  { icon: 'water', title: { ar: 'شبكة صرف صحي', en: 'Sewage network' } },
  { icon: 'wifi', title: { ar: 'إنترنت فايبر', en: 'Fiber optic internet' } },
  { icon: 'fire', title: { ar: 'نظام إطفاء الحريق', en: 'Firefighting system' } },
  { icon: 'light', title: { ar: 'إنارة الشوارع', en: 'Street lighting' } },
  { icon: 'tree', title: { ar: 'شبكة ري', en: 'Irrigation network' } },
];

/* ---------------- LOCATION ---------------- */
// Developer brochure (official) – drive times
export const LANDMARKS_TIME = [
  { name: { ar: 'كارفور', en: 'Carrefour' }, time: { ar: '2 دقيقة', en: '2 mins' } },
  { name: { ar: 'مسجد عبد المنعم رياض', en: 'Abd El Moniem Riad Mosque' }, time: { ar: '2 دقيقة', en: '2 mins' } },
  { name: { ar: 'مبنى المحافظة الجديد', en: 'New Government building' }, time: { ar: '3 دقائق', en: '3 mins' } },
  { name: { ar: 'نادي الاتحاد الرياضي', en: 'Al-Ittihad Sports Club' }, time: { ar: '4 دقائق', en: '4 mins' } },
  { name: { ar: 'نادي سموحة الرياضي', en: 'Smouha Sporting Club' }, time: { ar: '6 دقائق', en: '6 mins' } },
] as const;
// smouha.org – by car from Muruj building-12 area
export const LANDMARKS_DISTANCE = [
  { name: { ar: 'جرين بلازا', en: 'Green Plaza' }, dist: { ar: '3.2 كم · نحو 11 دقيقة', en: '3.2 km · ~11 min' } },
  { name: { ar: 'نادي سموحة · مدخل فيكتور', en: 'Smouha Club · Victor gate' }, dist: { ar: '3.7 كم · نحو 17 دقيقة', en: '3.7 km · ~17 min' } },
  { name: { ar: 'محطة سيدي جابر', en: 'Sidi Gaber station' }, dist: { ar: '4.3 كم · نحو 20 دقيقة', en: '4.3 km · ~20 min' } },
  { name: { ar: 'جامعة فاروس', en: 'Pharos University' }, dist: { ar: '4.9 كم · نحو 15 دقيقة', en: '4.9 km · ~15 min' } },
  { name: { ar: 'شاطئ كليوباترا', en: 'Cleopatra beach' }, dist: { ar: '5.9 كم · نحو 25 دقيقة', en: '5.9 km · ~25 min' } },
] as const;
// broker.com.eg – nearby roads & places
export const NEARBY_AXES: L[] = [
  { ar: 'جرين بلازا', en: 'Green Plaza' },
  { ar: 'جامعة فاروس', en: 'Pharos University' },
  { ar: 'طريق 14 مايو', en: '14th of May road' },
  { ar: 'محور المحمودية', en: 'Mahmoudia axis' },
];

/* ---------------- FAQ ---------------- */
export const FAQ: { q: L; a: L }[] = [
  {
    q: { ar: 'هل مروج مشروع واحد أم أكثر من مشروع؟', en: 'Is Muruj one project or several?' },
    a: { ar: 'مروج مجتمع عمراني على مساحة 182 فدان يضم مشروعات لمطورين مختلفين، بأنواع شقق ودوبلكس وفيلات ووحدات تجارية وإدارية؛ منها يو بارك من تشييد، وڤي مروج من الغنيمي، وزينيا مروج من MWA، وكمبوند الفرات للفيلات.', en: 'Muruj is a 182-feddan community with projects by different developers — apartments, duplexes, villas and commercial/admin units — including U Park (Tasheed), Vee Muruj (El Ghoniemy), Zinnia Muruj (MWA) and Alforat Compound villas.' },
  },
  {
    q: { ar: 'أين يقع كمبوند مروج؟', en: 'Where is Muruj located?' },
    a: { ar: 'في سموحة بالإسكندرية أمام جرين بلازا، بالقرب من جامعة فاروس وطريق 14 مايو ومحور المحمودية، وعلى بُعد دقائق من كارفور ونادي سموحة الرياضي.', en: 'In Smouha, Alexandria, opposite Green Plaza, near Pharos University, 14th of May road and the Mahmoudia axis — minutes from Carrefour and Smouha Sporting Club.' },
  },
  {
    q: { ar: 'ما أنظمة السداد المتاحة؟', en: 'What payment plans are available?' },
    a: { ar: 'النظام المعلن مقدم 15% وأقساط ربع سنوية على 6 سنوات، وتوجد أنظمة معلنة بمقدم 10% والباقي على 4 سنوات. جدول الدفعات يتحدد لكل وحدة ويُرجى تأكيده مع فريق المبيعات.', en: 'The announced plan is 15% down with quarterly installments over 6 years; some published plans start at 10% down with 4 years. Schedules vary per unit — please confirm with our sales team.' },
  },
  {
    q: { ar: 'متى الاستلام؟ وهل توجد وحدات جاهزة؟', en: 'When is delivery? Are there ready units?' },
    a: { ar: 'توجد شقق إعادة بيع مكتملة الإنشاء ومتشطبة جاهزة للسكن، ومشروعات تحت الإنشاء بمواعيد استلام 2027 و2028 حسب المبنى والوحدة.', en: 'There are completed, finished resale apartments ready to move in, plus off-plan projects with 2027 and 2028 delivery depending on the building and unit.' },
  },
  {
    q: { ar: 'هل يوجد فيلات داخل مروج؟', en: 'Are there villas in Muruj?' },
    a: { ar: 'نعم، كمبوند الفرات داخل مروج يضم 4 نماذج فيلات مستقلة (V1 – V4) بكلوب هاوس وحمام سباحة وملاعب ومسجد، كما توجد وحدات توين هاوس وفيلات مستقلة أخرى معروضة.', en: 'Yes — Alforat Compound inside Muruj has 4 standalone villa models (V1–V4) with a clubhouse, pool, courts and a mosque; twin-house and other standalone villas are also listed.' },
  },
  {
    q: { ar: 'ما الخدمات داخل المشروع؟', en: 'What services are inside the project?' },
    a: { ar: 'مدرسة، مستشفى، نادي على مساحة 14 فدان، مول تجاري، وحدات إدارية، حمامات سباحة، كلوب هاوس، مسجد، ومساحات خضراء.', en: 'A school, hospital, 14-feddan club, mall, administrative units, swimming pools, clubhouse, mosque and green areas.' },
  },
];

export const GALLERY_CATEGORIES = [
  { id: 'all', label: { ar: 'الكل', en: 'All' } },
  { id: 'photos', label: { ar: 'صور فعلية', en: 'Real photos' } },
  { id: 'exterior', label: { ar: 'التصميمات الخارجية', en: 'Exteriors' } },
  { id: 'villas', label: { ar: 'نماذج الفيلات', en: 'Villa models' } },
  { id: 'facilities', label: { ar: 'المرافق', en: 'Facilities' } },
  { id: 'landscape', label: { ar: 'اللاندسكيب', en: 'Landscape' } },
  { id: 'plans', label: { ar: 'المخططات', en: 'Plans' } },
  { id: 'floorplans', label: { ar: 'المساقط', en: 'Floor plans' } },
] as const;

export const HERO_SLIDES: (keyof typeof IMAGES)[] = ['villasStreet', 'apartmentTowers', 'aerialNight', 'landscapePath', 'clubhousePool', 'sitePhoto1'];
