import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHead } from '../lib/head';
import { ROUTE_SEO } from '../config/seo';
import { useLang } from '../i18n/LanguageContext';
import { IMAGES } from '../data/images.generated';
import type { ImageAsset } from '../data/types';
import { GALLERY_CATEGORIES } from '../data/project';
import { Section, SectionHeading } from '../components/ui';
import { Img } from '../components/Img';
import { Icon } from '../components/Icon';
import { Lightbox } from '../components/Lightbox';
import { AmenitiesSection, LeadFormSection, LocationSection } from '../components/sections';
import { goToForm } from '../lib/cta';

const ALL: ImageAsset[] = Object.values(IMAGES).filter((i) => i.category !== 'logo');

export default function Gallery() {
  const { u, t, lang } = useLang();
  const navigate = useNavigate();
  const [cat, setCat] = useState<string>('all');
  const [lb, setLb] = useState<{ imgs: ImageAsset[]; i: number } | null>(null);
  const list = useMemo(() => (cat === 'all' ? ALL : ALL.filter((i) => i.category === cat)), [cat]);
  const [limit, setLimit] = useState(12);
  const shown = list.slice(0, limit);

  useHead({
    title: ROUTE_SEO['/gallery'].title[lang],
    description: ROUTE_SEO['/gallery'].description[lang],
    path: '/gallery',
  });

  return (
    <>
      <header className="bg-brand-950 bg-[radial-gradient(ellipse_at_top,rgba(210,176,94,0.2),transparent_60%)] py-12 text-white md:py-16">
        <div className="container-x">
          <p className="text-sm font-extrabold text-gold-300">{t({ ar: 'كمبوند مروج سموحة', en: 'Muruj Compound Smouha' })}</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">{u('galleryPageTitle')}</h1>
          <p className="mt-3 max-w-2xl text-white/80 md:text-lg">{u('galleryPageSub')}</p>
          <button onClick={() => goToForm('gallery_header', navigate)} className="btn-gold mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-extrabold">
            {u('bookNow')} <Icon name="arrow" size={18} className="rtl:rotate-180" />
          </button>
        </div>
      </header>

      <Section id="gallery" ariaLabel={u('galleryPageTitle')}>
        <div className="-mx-4 mb-6 overflow-x-auto px-4" role="tablist" aria-label={u('galleryPageTitle')}>
          <div className="flex w-max gap-2">
            {GALLERY_CATEGORIES.map((c) => {
              const count = c.id === 'all' ? ALL.length : ALL.filter((i) => i.category === c.id).length;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={cat === c.id}
                  onClick={() => { setCat(c.id); setLimit(12); }}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${cat === c.id ? 'bg-brand-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
                >
                  {t(c.label)} <span className="opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
          {shown.map((im, i) => {
            const contain = im.category === 'plans' || im.category === 'floorplans';
            return (
              <li key={im.src}>
                <button onClick={() => setLb({ imgs: list, i })} className="group relative block w-full overflow-hidden rounded-xl bg-stone-100" aria-label={`${u('enlarge')}: ${lang === 'ar' ? im.alt : im.altEn}`}>
                  <Img image={im} priority={i < 2} className={`aspect-[4/3] w-full transition duration-500 group-hover:scale-105 ${contain ? 'bg-white object-contain' : 'object-cover'}`} sizes="(max-width: 768px) 50vw, 25vw" />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-start text-xs font-semibold leading-tight text-white opacity-0 transition group-hover:opacity-100 md:text-xs">
                    {lang === 'ar' ? im.alt : im.altEn}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {list.length > limit && (
          <div className="mt-6 text-center">
            <button type="button" onClick={() => setLimit((n) => n + 12)} className="rounded-xl border-2 border-brand-700 px-6 py-3 font-extrabold text-brand-800 transition hover:bg-brand-700 hover:text-white">
              {t({ ar: `عرض المزيد (${list.length - limit})`, en: `Show more (${list.length - limit})` })}
            </button>
          </div>
        )}
      </Section>

      {/* Master plan */}
      <Section id="master-plan" className="bg-stone-50" ariaLabel={u('masterPlanTitle')}>
        <SectionHeading title={u('masterPlanTitle')} />
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            { im: IMAGES.masterplanMuruj, cap: u('masterPlanMuruj') },
            { im: IMAGES.masterplanAlforat, cap: u('masterPlanAlforat') },
          ].map(({ im, cap }, i, arr) => (
            <figure key={im.src} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <button onClick={() => setLb({ imgs: arr.map((a) => a.im), i })} className="relative block w-full" aria-label={`${u('enlarge')}: ${cap}`}>
                <Img image={im} className="aspect-[4/3] w-full object-contain" sizes="(max-width: 1024px) 100vw, 50vw" />
                <span className="absolute end-3 top-3 rounded-full bg-white/90 p-2 text-brand-800 shadow"><Icon name="zoom" size={18} /></span>
              </button>
              <figcaption className="border-t border-stone-100 p-3 text-center font-bold text-brand-900">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <AmenitiesSection />
      <LocationSection />
      <LeadFormSection location="gallery_page" compact />
      <Lightbox images={lb?.imgs ?? []} index={lb ? lb.i : null} onClose={() => setLb(null)} onIndex={(i) => setLb((p) => (p ? { ...p, i } : p))} />
    </>
  );
}
