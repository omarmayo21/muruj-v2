import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { IMAGES } from '../data/images.generated';
import type { ImageAsset } from '../data/types';
import {
  ABOUT,
  ALFORAT_FACILITIES,
  COMMUNITY_AMENITIES,
  FAQ,
  INFRASTRUCTURE,
  LANDMARKS_DISTANCE,
  LANDMARKS_TIME,
  NEARBY_AXES,
  PAYMENT_PLANS,
  UNIT_CARDS,
  UNIT_FILTER_CATEGORIES,
  type Amenity,
} from '../data/project';
import { Section, SectionHeading } from './ui';
import { Img } from './Img';
import { Icon } from './Icon';
import { LazyLeadForm as LeadForm } from './LazyLeadForm';
import { Lightbox } from './Lightbox';
import { MapEmbed } from './MapEmbed';
import { goToForm } from '../lib/cta';
import { track } from '../lib/analytics';

/* -------------------- LEAD FORM SECTION -------------------- */
export function LeadFormSection({ location, compact = false }: { location: string; compact?: boolean }) {
  const { u, t } = useLang();
  const perks = [
    { icon: 'tag', text: { ar: 'اعرف التفاصيل والأسعار من فريق المبيعات', en: 'Full unit details from our sales team' } },
    { icon: 'layers', text: { ar: 'المساقط والمساحات المتاحة حالياً (من 88 م² حتى 479 م²)', en: 'Currently available layouts & areas (88 m² up to 479 m²)' } },
    { icon: 'wallet', text: { ar: 'أنظمة سداد معلنة حتى 6 سنوات', en: 'Published plans up to 6 years' } },
    { icon: 'calendar', text: { ar: 'ترتيب زيارة للمشروع ومعاينة الوحدات', en: 'Arrange a site visit & unit viewing' } },
  ];
  return (
    <section id="lead-form" aria-label={u('formTitle')} className="scroll-mt-20 bg-brand-900 bg-[radial-gradient(ellipse_at_top,rgba(210,176,94,0.18),transparent_60%)] py-10 md:py-16">
      <div className={`container-x grid items-center gap-8 ${compact ? 'max-w-3xl' : 'lg:grid-cols-5'}`}>
        {!compact && (
          <div className="order-2 text-white lg:order-1 lg:col-span-2">
            <p className="text-sm font-extrabold text-gold-300">{t({ ar: 'تواصل مع مستشار مبيعات', en: 'Talk to a sales consultant' })}</p>
            <h2 className="mt-2 text-2xl font-black leading-snug md:text-3xl">{t({ ar: 'اعرف التفاصيل والأسعار من فريق المبيعات', en: 'Get unit details & payment plans in minutes' })}</h2>
            <ul className="mt-6 space-y-3.5">
              {perks.map((p) => (
                <li key={p.icon} className="flex items-center gap-3 text-white/90">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold-300">
                    <Icon name={p.icon} size={20} />
                  </span>
                  <span className="font-semibold">{t(p.text)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={`order-1 rounded-3xl bg-white p-5 shadow-2xl md:p-8 lg:order-2 ${compact ? '' : 'lg:col-span-3'}`}>
          <LeadForm location={location} />
        </div>
      </div>
    </section>
  );
}

/* -------------------- ABOUT -------------------- */
export function AboutSection() {
  const { u, t } = useLang();
  return (
    <Section id="about" ariaLabel={u('aboutTitle')}>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading kicker={t({ ar: 'كمبوند مروج سموحة', en: 'Muruj Compound Smouha' })} title={u('aboutTitle')} center={false} />
          <div className="space-y-4 text-base leading-8 text-stone-700 md:text-lg">
            {ABOUT.paragraphs.map((p, i) => (
              <p key={i}>{t(p)}</p>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {ABOUT.highlights.map((h) => (
              <li key={h.en} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-2 text-sm font-bold text-brand-800">
                <Icon name="check" size={16} className="text-gold-700" /> {t(h)}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Img image={IMAGES.sitePhoto1} className="col-span-2 aspect-[16/9] w-full rounded-2xl object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <Img image={IMAGES.apartmentFacades} className="aspect-square w-full rounded-2xl object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
          <Img image={IMAGES.landscapePath} className="aspect-square w-full rounded-2xl object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
        </div>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {ABOUT.pillars.map((p) => (
          <article key={p.title.en} className="rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="text-lg font-extrabold text-brand-900">{t(p.title)}</h3>
            <p className="mt-2 leading-7 text-stone-600">{t(p.text)}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* -------------------- UNIT CARDS -------------------- */
export function UnitsSection({ showAllLink = true, priorityFirst = false, showFilter = false }: { showAllLink?: boolean; priorityFirst?: boolean; showFilter?: boolean }) {
  const { u, t } = useLang();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const filteredCards = filter === 'all' ? UNIT_CARDS : UNIT_CARDS.filter((c) => c.category === filter);

  return (
    <Section id="units" className="bg-stone-50" ariaLabel={u('unitsTitle')}>
      <SectionHeading kicker={t({ ar: 'شقق · دوبلكس · فيلات · إداري', en: 'Apartments · Duplex · Villas · Admin' })} title={u('unitsTitle')} sub={u('unitsSub')} />
      {showFilter && (
        <div className="-mx-4 mb-6 overflow-x-auto px-4" role="tablist" aria-label={u('unitsTitle')}>
          <div className="flex w-max gap-2 mx-auto">
            {UNIT_FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={filter === cat.id}
                onClick={() => setFilter(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${filter === cat.id ? 'bg-brand-800 text-white' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'}`}
              >
                {t(cat.label)}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCards.map((c, i) => {
          const img = c.image ? IMAGES[c.image] : null;
          const isPlan = img?.category === 'floorplans';
          return (
            <article key={c.id} className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className={`relative aspect-[4/3] overflow-hidden ${img ? (isPlan ? 'bg-white' : 'bg-stone-200') : 'bg-gradient-to-br from-brand-50 via-stone-50 to-gold-100/40'}`}>
                {img ? (
                  <Img image={img} priority={priorityFirst && i === 0} className={`h-full w-full transition duration-500 group-hover:scale-105 ${isPlan ? 'object-contain p-2' : 'object-cover'}`} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-800 shadow-md">
                      <Icon name="ruler" size={32} />
                    </span>
                    <p className="mt-3 text-base font-extrabold text-brand-900">{t(c.title)}</p>
                    <p className="mt-1 text-xs font-semibold text-stone-500">
                      {t({ ar: 'تفاصيل التقسيمة والمسقط متاحة عبر فريق المبيعات', en: 'Layout and floor plan details available via our sales team' })}
                    </p>
                  </div>
                )}
                <span className="absolute start-3 top-3 rounded-full bg-brand-900/90 px-3 py-1 text-sm font-extrabold text-gold-200 backdrop-blur">{t(c.areas)}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-extrabold text-brand-900">{t(c.title)}</h3>
                <ul className="mt-3 flex-1 space-y-2 text-sm leading-6 text-stone-600">
                  {c.details.map((d) => (
                    <li key={d.en} className="flex gap-2">
                      <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold-700" />
                      {t(d)}
                    </li>
                  ))}
                </ul>
                <button onClick={() => goToForm(`unit_card_${c.id}`, navigate)} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-800 px-5 py-3 font-extrabold text-white transition hover:bg-brand-700">
                  {u('askDetails')} <Icon name="arrow" size={18} className="rtl:rotate-180" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {showAllLink && (
        <div className="mt-10 text-center">
          <Link to="/units" onClick={() => track('cta_click', { cta: 'home_all_units' })} className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-800 px-6 py-3 font-extrabold text-brand-800 hover:bg-brand-800 hover:text-white">
            {u('allUnits')} <Icon name="arrow" size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      )}
    </Section>
  );
}

/* -------------------- AMENITIES -------------------- */
function AmenityGrid({ items }: { items: Amenity[] }) {
  const { t } = useLang();
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((a) => (
        <li key={a.title.en} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3.5 md:p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon name={a.icon} size={22} />
          </span>
          <span className="text-sm font-bold leading-snug text-stone-800 md:text-[15px]">{t(a.title)}</span>
        </li>
      ))}
    </ul>
  );
}

export function AmenitiesSection() {
  const { u, lang } = useLang();
  const facImgs = [IMAGES.facPool, IMAGES.facCourt, IMAGES.facKids, IMAGES.facMosque];
  return (
    <Section id="amenities" ariaLabel={u('amenitiesTitle')}>
      <SectionHeading kicker={lang === 'ar' ? 'حياة متكاملة' : 'Complete lifestyle'} title={u('amenitiesTitle')} sub={u('amenitiesSub')} />
      <h3 className="mb-4 text-lg font-extrabold text-brand-900 md:text-xl">{u('communityAmenities')}</h3>
      <AmenityGrid items={COMMUNITY_AMENITIES} />

      <h3 className="mb-4 mt-12 text-lg font-extrabold text-brand-900 md:text-xl">{u('alforatFacilities')}</h3>
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {facImgs.map((im) => (
          <figure key={im.src} className="overflow-hidden rounded-2xl bg-stone-100">
            <Img image={im} className="aspect-[468/509] w-full object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            <figcaption className="px-3 py-2.5 text-center text-sm font-bold text-brand-900">{lang === 'ar' ? im.alt : im.altEn}</figcaption>
          </figure>
        ))}
      </div>
      <AmenityGrid items={ALFORAT_FACILITIES} />

      <h3 className="mb-4 mt-12 text-lg font-extrabold text-brand-900 md:text-xl">{u('infrastructure')}</h3>
      <AmenityGrid items={INFRASTRUCTURE} />
    </Section>
  );
}

/* -------------------- LOCATION -------------------- */
export function LocationSection() {
  const { u, t } = useLang();
  const [lb, setLb] = useState<number | null>(null);
  const maps: ImageAsset[] = [IMAGES.locationMap, IMAGES.masterplanMuruj];
  return (
    <Section id="location" className="bg-stone-50" ariaLabel={u('locationTitle')}>
      <SectionHeading kicker={t({ ar: 'سموحة · الإسكندرية', en: 'Smouha · Alexandria' })} title={u('locationTitle')} sub={u('locationSub')} />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          {maps.map((m, i) => (
            <button key={m.src} onClick={() => setLb(i)} className="group relative block w-full overflow-hidden rounded-2xl border border-stone-200 bg-white" aria-label={`${u('enlarge')}: ${t({ ar: m.alt, en: m.altEn })}`}>
              <Img image={m} className="w-full" sizes="(max-width: 1024px) 100vw, 60vw" />
              <span className="absolute end-3 top-3 rounded-full bg-white/90 p-2 text-brand-800 shadow">
                <Icon name="zoom" size={20} />
              </span>
            </button>
          ))}
        </div>
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-2 font-extrabold text-brand-900">
              <Icon name="clock" size={20} className="text-gold-700" /> {u('driveTimes')}
            </h3>
            <ul className="divide-y divide-stone-100">
              {LANDMARKS_TIME.map((l) => (
                <li key={l.name.en} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="font-semibold text-stone-700">{t(l.name)}</span>
                  <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 font-extrabold text-brand-800">{t(l.time)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-2 font-extrabold text-brand-900">
              <Icon name="car" size={20} className="text-gold-700" /> {u('distances')}
            </h3>
            <ul className="divide-y divide-stone-100">
              {LANDMARKS_DISTANCE.map((l) => (
                <li key={l.name.en} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="font-semibold text-stone-700">{t(l.name)}</span>
                  <span className="shrink-0 text-xs font-bold text-stone-500">{t(l.dist)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-2 font-extrabold text-brand-900">
              <Icon name="road" size={20} className="text-gold-700" /> {u('nearbyRoads')}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {NEARBY_AXES.map((a) => (
                <li key={a.en} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-bold text-stone-700">
                  {t(a)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <MapEmbed />
      </div>
      <Lightbox images={maps} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </Section>
  );
}

/* -------------------- PAYMENT PLANS -------------------- */
export function PaymentSection() {
  const { u, t } = useLang();
  const navigate = useNavigate();
  return (
    <Section id="payment" className="bg-brand-950 text-white" ariaLabel={u('paymentTitle')}>
      <SectionHeading light kicker={t({ ar: 'تسهيلات في السداد', en: 'Easy payments' })} title={u('paymentTitle')} sub={u('paymentSub')} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PAYMENT_PLANS.map((p, i) => (
          <article key={p.title.en} className={`flex flex-col rounded-2xl border p-6 ${i === 0 ? 'border-gold-400 bg-gold-400/10' : 'border-white/10 bg-white/5'}`}>
            <h3 className="text-sm font-bold text-white/70">{t(p.title)}</h3>
            <p className="mt-2 text-2xl font-black text-gold-300">{t(p.highlight)}</p>
            <ul className="mt-4 flex-1 space-y-2.5 text-sm leading-6 text-white/85">
              {p.lines.map((l) => (
                <li key={l.en} className="flex gap-2">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold-400" />
                  {t(l)}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-white/70">{t({ ar: 'أنظمة سداد مرنة، تواصل معنا لمعرفة التفاصيل والأسعار من فريق المبيعات.', en: 'Flexible payment plans — contact our sales team for full details.' })}</p>
      <div className="mt-6 text-center">
        <button onClick={() => goToForm('payment_section', navigate)} className="btn-gold inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-lg font-extrabold">
          {u('bookNow')} <Icon name="arrow" size={20} className="rtl:rotate-180" />
        </button>
      </div>
    </Section>
  );
}

/* -------------------- FAQ -------------------- */
export function FAQSection() {
  const { u, t } = useLang();
  return (
    <Section id="faq" ariaLabel={u('faqTitle')}>
      <SectionHeading title={u('faqTitle')} />
      <div className="mx-auto max-w-3xl space-y-3">
        {FAQ.map((f, i) => (
          <details key={f.q.en} className="group rounded-2xl border border-stone-200 bg-white p-5 open:shadow-md" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-extrabold text-brand-900 md:text-lg">
              {t(f.q)}
              <Icon name="chevronDown" size={20} className="shrink-0 text-gold-700 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 leading-8 text-stone-600">{t(f.a)}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* -------------------- FINAL CTA (reuses LeadForm) -------------------- */
export function FinalCTA({ location = 'final_cta' }: { location?: string }) {
  const { u } = useLang();
  return (
    <section aria-label={u('finalTitle')} className="relative overflow-hidden py-14 md:py-20">
      <Img image={IMAGES.villaRender3} className="absolute inset-0 h-full w-full object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-brand-950/85" />
      <div className="container-x relative grid items-center gap-8 lg:grid-cols-2">
        <div className="text-white">
          <h2 className="text-3xl font-black leading-snug md:text-5xl">{u('finalTitle')}</h2>
          <p className="mt-4 text-lg text-white/80">{u('finalSub')}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-2xl md:p-8">
          <LeadForm location={location} variant="compact" title={u('formTitle')} />
        </div>
      </div>
    </section>
  );
}
