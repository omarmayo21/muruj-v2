import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHead } from '../lib/head';
import { ROUTE_SEO } from '../config/seo';
import { useLang } from '../i18n/LanguageContext';
import { IMAGES } from '../data/images.generated';
import type { ImageAsset } from '../data/types';
import { FLOOR_PLANS, HEIGHTS_TYPES, SUB_PROJECTS, VILLAS } from '../data/project';
import { Section, SectionHeading } from '../components/ui';
import { Img } from '../components/Img';
import { Icon } from '../components/Icon';
import { Lightbox } from '../components/Lightbox';
import { LeadFormSection, UnitsSection } from '../components/sections';
import { goToForm } from '../lib/cta';

export default function Units() {
  const { u, t, lang } = useLang();
  const navigate = useNavigate();
  const [lb, setLb] = useState<{ imgs: ImageAsset[]; i: number } | null>(null);

  useHead({
    title: ROUTE_SEO['/units'].title[lang],
    description: ROUTE_SEO['/units'].description[lang],
    path: '/units',
  });

  return (
    <>
      <header className="bg-brand-950 bg-[radial-gradient(ellipse_at_top,rgba(210,176,94,0.2),transparent_60%)] py-12 text-white md:py-16">
        <div className="container-x">
          <p className="text-sm font-extrabold text-gold-300">{t({ ar: 'كمبوند مروج سموحة', en: 'Muruj Compound Smouha' })}</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">{u('unitsPageTitle')}</h1>
          <p className="mt-3 max-w-2xl text-white/80 md:text-lg">{u('unitsPageSub')}</p>
          <button onClick={() => goToForm('units_header', navigate)} className="btn-gold mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-extrabold">
            {u('bookNow')} <Icon name="arrow" size={18} className="rtl:rotate-180" />
          </button>
        </div>
      </header>

      <UnitsSection showAllLink={false} priorityFirst showFilter />

      {/* Sub-projects */}
      <Section id="sub-projects" ariaLabel={u('subProjects')}>
        <SectionHeading title={u('subProjects')} sub={t({ ar: 'مروج مجتمع يضم مطورين ومشروعات مختلفة — المساحات السكنية تبدأ من 88 م² حتى 479 م²', en: 'Muruj hosts several developers and projects — residential areas range from 88 m² up to 479 m²' })} />
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[640px] text-start text-sm">
            <thead className="bg-brand-900 text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-start font-extrabold">{u('project')}</th>
                <th scope="col" className="px-4 py-3 text-start font-extrabold">{u('developer')}</th>
                <th scope="col" className="px-4 py-3 text-start font-extrabold">{u('type')}</th>
                <th scope="col" className="px-4 py-3 text-start font-extrabold">{u('areas')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {SUB_PROJECTS.map((s) => (
                <tr key={s.name.en} className="even:bg-stone-50">
                  <th scope="row" className="px-4 py-3 text-start font-extrabold text-brand-900">
                    {t(s.name)}
                    {s.note && <span className="ms-2 rounded-full bg-gold-100 px-2 py-0.5 text-xs font-bold text-gold-800">{t(s.note)}</span>}
                  </th>
                  <td className="px-4 py-3 text-stone-700">{t(s.developer)}</td>
                  <td className="px-4 py-3 text-stone-600">{t(s.type)}</td>
                  <td className="px-4 py-3 font-bold text-brand-800">{t(s.areas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-stone-500">{t({ ar: 'مساحات الوحدات السكنية منفصلة عن الإداري والتجاري، والنطاق لا يعني توافر كل نموذج حالياً.', en: 'Residential areas are separate from admin/retail; a range does not mean every model is currently available.' })}</p>
      </Section>

      {/* Floor plans */}
      <Section id="floor-plans" className="bg-stone-50" ariaLabel={u('floorPlans')}>
        <SectionHeading title={u('floorPlans')} />
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 88 m² neutral placeholder card (owner-provided minimum area, no floor plan attached) */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="flex min-h-[240px] flex-col items-center justify-center bg-gradient-to-br from-brand-50 via-stone-50 to-gold-100/40 p-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-800 shadow-md">
                <Icon name="ruler" size={32} />
              </span>
              <span className="mt-3 rounded-full bg-brand-900 px-3.5 py-1 text-sm font-extrabold text-gold-200">
                {t({ ar: 'تبدأ من 88 م²', en: 'From 88 m²' })}
              </span>
              <p className="mt-2 text-xs font-semibold text-stone-500">
                {t({ ar: 'المسقط الهندسي وتوزيع الغرف متاح عبر فريق المبيعات', en: 'Floor plan & room layout available via our sales team' })}
              </p>
            </div>
            <div className="flex flex-1 flex-col border-t border-stone-100 p-5">
              <h3 className="text-lg font-extrabold text-brand-900">{t({ ar: 'شقة (تبدأ من 88 م²)', en: 'Apartment (from 88 m²)' })}</h3>
              <p className="text-sm text-stone-500">{t({ ar: 'بيانات المالك — مساحات تبدأ من 88 م²', en: 'Owner-provided data — areas starting from 88 m²' })}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-600">
                {t({
                  ar: 'تتوفر وحدات سكنية تبدأ مساحتها من 88 م² داخل كمبوند مروج سموحة. تواصل مع فريق المبيعات لمعرفة التقسيمة المتاحة والمسقط الهندسي.',
                  en: 'Residential units starting from 88 m² are available at Muruj Compound Smouha. Contact our sales team for the available layout and floor plan.',
                })}
              </p>
              <button onClick={() => goToForm('floorplan_apt88', navigate)} className="mt-5 w-full rounded-xl bg-brand-800 py-3 font-extrabold text-white hover:bg-brand-700">{u('askDetails')}</button>
            </div>
          </article>

          {FLOOR_PLANS.map((fp) => {
            const img = IMAGES[fp.image];
            return (
              <article key={fp.image} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <button onClick={() => setLb({ imgs: [img], i: 0 })} className="relative block w-full bg-white p-3" aria-label={`${u('enlarge')}: ${t(fp.title)}`}>
                  <Img image={img} className="mx-auto max-h-[380px] w-auto object-contain" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <span className="absolute end-3 top-3 rounded-full bg-brand-50 p-2 text-brand-800"><Icon name="zoom" size={18} /></span>
                </button>
                <div className="border-t border-stone-100 p-5">
                  <h3 className="text-lg font-extrabold text-brand-900">{t(fp.title)}</h3>
                  <p className="text-sm text-stone-500">{t(fp.sub)}</p>
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="text-stone-500">
                        <th scope="col" className="pb-2 text-start font-bold">{u('room')}</th>
                        <th scope="col" className="pb-2 text-end font-bold">{u('dimensions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {fp.rooms.map(([r, d]) => (
                        <tr key={r.en}>
                          <td className="py-2 font-semibold text-stone-700">{t(r)}</td>
                          <td className="py-2 text-end tabular-nums text-stone-600" dir="ltr">{lang === 'ar' ? d : d.replace(' م', ' m')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={() => goToForm(`floorplan_${fp.image}`, navigate)} className="mt-5 w-full rounded-xl bg-brand-800 py-3 font-extrabold text-white hover:bg-brand-700">{u('askDetails')}</button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Muruj Heights types */}
        <article className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white lg:grid lg:grid-cols-2">
          <button onClick={() => setLb({ imgs: [IMAGES.planHeights], i: 0 })} className="block bg-white p-3" aria-label={`${u('enlarge')}: ${u('heightsTitle')}`}>
            <Img image={IMAGES.planHeights} className="mx-auto w-full object-contain" sizes="(max-width: 1024px) 100vw, 50vw" />
          </button>
          <div className="p-6">
            <h3 className="text-xl font-extrabold text-brand-900">{u('heightsTitle')}</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {HEIGHTS_TYPES.map((b) => (
                <div key={b.building}>
                  <p className="mb-2 font-extrabold text-gold-700">{u('building')} {b.building}</p>
                  <ul className="space-y-1.5">
                    {b.types.map(([code, a]) => (
                      <li key={code} className="flex justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm">
                        <span className="font-bold text-stone-700">{code}</span>
                        <span className="font-extrabold text-brand-800">{a} {u('sqm')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button onClick={() => goToForm('heights_types', navigate)} className="mt-6 w-full rounded-xl bg-brand-800 py-3 font-extrabold text-white hover:bg-brand-700">{u('askDetails')}</button>
          </div>
        </article>
      </Section>

      {/* Villas */}
      <Section id="villas" ariaLabel={u('villasTitle')}>
        <SectionHeading kicker={t({ ar: 'الفرات للتطوير العقاري', en: 'Alforat Development' })} title={u('villasTitle')} sub={u('villasSub')} />
        <div className="grid gap-6 md:grid-cols-2">
          {VILLAS.map((v) => {
            const imgs = v.images.map((k) => IMAGES[k]);
            return (
              <article key={v.code} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <div className="grid grid-cols-2 gap-1">
                  {imgs.map((im, i) => (
                    <button key={im.src} onClick={() => setLb({ imgs, i })} className="relative block" aria-label={`${u('enlarge')}: ${t({ ar: im.alt, en: im.altEn })}`}>
                      <Img image={im} className="aspect-[4/3] w-full object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                      <span className="absolute bottom-2 start-2 rounded-md bg-black/55 px-2 py-0.5 text-xs font-bold text-white">{i === 0 ? u('front') : u('back')}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <h3 className="text-xl font-extrabold text-brand-900">{t(v.title)}</h3>
                    <p className="mt-1.5 flex items-start gap-2 text-sm leading-6 text-stone-600">
                      <Icon name="bed" size={18} className="mt-0.5 shrink-0 text-gold-700" /> {t(v.rooms)}
                    </p>
                  </div>
                  <button onClick={() => goToForm(`villa_${v.code}`, navigate)} className="shrink-0 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-700">{u('askDetails')}</button>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[IMAGES.villaModelsKey, IMAGES.masterplanAlforat].map((im, i, arr) => (
            <figure key={im.src} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <button onClick={() => setLb({ imgs: [...arr], i })} className="block w-full" aria-label={u('enlarge')}>
                <Img image={im} className="aspect-[4/3] w-full object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
              </button>
              <figcaption className="border-t border-stone-100 p-3 text-center text-sm font-bold text-brand-900">{i === 0 ? u('keyPlan') : u('masterPlanAlforat')}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <LeadFormSection location="units_page" compact />
      <Lightbox images={lb?.imgs ?? []} index={lb ? lb.i : null} onClose={() => setLb(null)} onIndex={(i) => setLb((p) => (p ? { ...p, i } : p))} />
    </>
  );
}
