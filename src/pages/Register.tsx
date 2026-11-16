import { useHead } from '../lib/head';
import { ROUTE_SEO } from '../config/seo';
import { useLang } from '../i18n/LanguageContext';
import { IMAGES } from '../data/images.generated';
import { KEY_INFO } from '../data/project';
import { Img } from '../components/Img';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { LazyLeadForm as LeadForm } from '../components/LazyLeadForm';

const BENEFITS = [
  {
    ar: 'مجتمع عمراني متكامل على مساحة 182 فدان في سموحة أمام جرين بلازا مباشرة',
    en: 'Integrated 182-feddan community in Smouha directly opposite Green Plaza',
  },
  {
    ar: 'تنوع الوحدات: شقق، دوبلكس، فيلات مستقلة، ووحدات إدارية وطبية بمساحات من 88 م² حتى 479 م²',
    en: 'Diverse units: apartments, duplexes, standalone villas and admin/medical units from 88 m² up to 479 m²',
  },
  {
    ar: 'أنظمة سداد مرنة بمقدم يبدأ من 10% وتقسيط يصل إلى 6 سنوات',
    en: 'Flexible payment plans starting from 10% down and up to 6 years of installments',
  },
  {
    ar: 'وحدات جاهزة للسكن الفوري (إعادة بيع) ومراحل تحت الإنشاء باستلام 2027 و2028',
    en: 'Ready-to-move resale apartments and off-plan phases with 2027 & 2028 delivery',
  },
] as const;

export default function Register() {
  const { u, t, lang } = useLang();

  useHead({
    title: ROUTE_SEO['/register'].title[lang],
    description: ROUTE_SEO['/register'].description[lang],
    path: '/register',
  });

  return (
    <>
      <section className="bg-brand-950 bg-[radial-gradient(ellipse_at_top,rgba(210,176,94,0.2),transparent_60%)] py-12 text-white md:py-16">
        <div className="container-x grid items-start gap-10 lg:grid-cols-12">
          {/* Hero text + benefit points + 2 project images */}
          <div className="lg:col-span-6">
            <div className="mb-4">
              <Logo light className="h-12 w-auto" />
            </div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-extrabold text-gold-300">
              <Icon name="pin" size={14} /> {u('heroKicker')}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-snug md:text-5xl">
              {t({ ar: 'سجّل اهتمامك بكمبوند مروج سموحة', en: 'Register Your Interest in Muruj Compound Smouha' })}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/80 md:text-lg">
              {t({
                ar: 'اعرف التفاصيل والأسعار من فريق المبيعات وتعرّف على المساحات المتاحة من 88 م² حتى 479 م² وأنظمة السداد.',
                en: 'Contact our sales team for full details, available areas from 88 m² up to 479 m² and payment plans.',
              })}
            </p>

            <ul className="mt-6 space-y-3">
              {BENEFITS.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-white/90 md:text-base">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-300">
                    <Icon name="check" size={15} />
                  </span>
                  <span className="font-semibold">{t(b)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Img
                image={IMAGES.villasStreet}
                priority
                className="aspect-[16/10] w-full rounded-2xl object-cover shadow-lg"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <Img
                image={IMAGES.apartmentTowers}
                className="aspect-[16/10] w-full rounded-2xl object-cover shadow-lg"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>

          {/* Reusable LeadForm with source_page=register */}
          <div id="lead-form" className="scroll-mt-20 rounded-3xl bg-white p-5 text-stone-900 shadow-2xl md:p-8 lg:col-span-6">
            <LeadForm location="register_page" sourcePage="register" />
          </div>
        </div>
      </section>

      {/* Project summary cards */}
      <section aria-label={u('tySummary')} className="bg-stone-50 py-12 md:py-16">
        <div className="container-x">
          <h2 className="mb-6 text-center text-2xl font-black text-brand-900 md:text-3xl">
            {u('tySummary')} — {t({ ar: 'كمبوند مروج سموحة', en: 'Muruj Compound Smouha' })}
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {KEY_INFO.map((c) => (
              <li key={c.label.en} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <span className="flex items-center gap-2 text-xs font-bold text-stone-500 md:text-sm">
                  <Icon name={c.icon} size={18} className="text-gold-700" /> {t(c.label)}
                </span>
                <span className="mt-1.5 block text-sm font-extrabold text-brand-900 md:text-base">{t(c.value)}</span>
                {c.note && <span className="mt-0.5 block text-xs text-stone-500">{t(c.note)}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs font-semibold text-stone-500">{u('marketingDisclaimer')}</p>
        </div>
      </section>
    </>
  );
}

