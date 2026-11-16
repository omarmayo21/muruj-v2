import { useHead } from '../lib/head';
import { ROUTE_SEO } from '../config/seo';
import { useLang } from '../i18n/LanguageContext';
import { SITE, telLink, whatsappLink } from '../config/site';
import { IMAGES } from '../data/images.generated';
import { KEY_INFO, PROJECT } from '../data/project';
import { Img } from '../components/Img';
import { Icon, WhatsAppIcon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { MapEmbed } from '../components/MapEmbed';
import { LazyLeadForm as LeadForm } from '../components/LazyLeadForm';
import { track } from '../lib/analytics';

export default function Contact() {
  const { u, t, lang } = useLang();

  useHead({
    title: ROUTE_SEO['/contact'].title[lang],
    description: ROUTE_SEO['/contact'].description[lang],
    path: '/contact',
  });

  return (
    <>
      <header className="bg-brand-950 bg-[radial-gradient(ellipse_at_top,rgba(210,176,94,0.2),transparent_60%)] py-12 text-white md:py-16">
        <div className="container-x">
          <div className="mb-4">
            <Logo light className="h-12 w-auto" />
          </div>
          <p className="text-sm font-extrabold text-gold-300">{t(PROJECT.name)}</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            {t({ ar: 'اتصل بنا — تواصل مع فريق المبيعات', en: 'Contact Us — Speak with Our Sales Team' })}
          </h1>
          <p className="mt-3 max-w-2xl text-white/80 md:text-lg">
            {t({
              ar: 'اعرف التفاصيل والأسعار من فريق المبيعات وتعرّف على الوحدات والمساحات المتاحة من 88 م² حتى 479 م² وأنظمة السداد.',
              en: 'Contact our sales team for full details, available unit areas from 88 m² up to 479 m² and payment plans.',
            })}
          </p>
        </div>
      </header>

      <section aria-label={u('navContact')} className="py-12 md:py-16">
        <div className="container-x grid items-start gap-8 lg:grid-cols-12">
          {/* Contact cards + Map */}
          <div className="space-y-6 lg:col-span-5">
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
              {/* Phone (tap-to-call) */}
              <a
                href={telLink()}
                onClick={() => track('click_call', { location: 'contact_page' })}
                className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-brand-700 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
                  <Icon name="phone" size={24} />
                </span>
                <div>
                  <p className="text-xs font-bold text-stone-500">{u('callUs')}</p>
                  <p className="mt-0.5 text-base font-extrabold text-brand-900" dir="ltr">
                    {SITE.phoneDisplay}
                  </p>
                </div>
              </a>

              {/* WhatsApp (prefilled Arabic message) */}
              <a
                href={whatsappLink(lang)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('click_whatsapp', { location: 'contact_page' })}
                className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-[#0f7d44] hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0f7d44]/10 text-[#0f7d44]">
                  <WhatsAppIcon size={24} />
                </span>
                <div>
                  <p className="text-xs font-bold text-stone-500">{u('whatsapp')}</p>
                  <p className="mt-0.5 text-base font-extrabold text-brand-900">
                    {t({ ar: 'تواصل عبر واتساب فوراً', en: 'Chat on WhatsApp now' })}
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-brand-700 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
                  <Icon name="mail" size={24} />
                </span>
                <div>
                  <p className="text-xs font-bold text-stone-500">{u('email')}</p>
                  <p className="mt-0.5 text-base font-extrabold text-brand-900" dir="ltr">
                    {SITE.email}
                  </p>
                </div>
              </a>

              {/* Working hours */}
              <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
                  <Icon name="clock" size={24} />
                </span>
                <div>
                  <p className="text-xs font-bold text-stone-500">{t({ ar: 'مواعيد العمل', en: 'Working hours' })}</p>
                  <p className="mt-0.5 text-sm font-extrabold text-brand-900">{t(SITE.workingHours)}</p>
                </div>
              </div>

              {/* Project location address */}
              <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
                  <Icon name="pin" size={24} />
                </span>
                <div>
                  <p className="text-xs font-bold text-stone-500">{t({ ar: 'عنوان المشروع', en: 'Project location' })}</p>
                  <p className="mt-0.5 text-sm font-extrabold text-brand-900">{t(PROJECT.location)}</p>
                </div>
              </div>
            </div>

            {/* Location Map Image + Interactive Google Map */}
            <div className="space-y-4">
              <figure className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <Img
                  image={IMAGES.locationMap}
                  priority
                  className="w-full object-contain"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <figcaption className="border-t border-stone-100 px-4 py-2.5 text-center text-xs font-bold text-stone-600">
                  {t({ ar: IMAGES.locationMap.alt, en: IMAGES.locationMap.altEn })}
                </figcaption>
              </figure>
              <MapEmbed />
            </div>
          </div>

          {/* Contact Form (same LeadForm + optional Message textarea + source_page=contact) */}
          <div id="lead-form" className="scroll-mt-20 rounded-3xl border border-stone-200 bg-white p-5 shadow-xl md:p-8 lg:col-span-7">
            <LeadForm
              location="contact_page"
              sourcePage="contact"
              showMessage
              title={t({ ar: 'أرسل استفسارك أو رسالتك', en: 'Send Your Enquiry or Message' })}
              subtitle={t({
                ar: 'اترك بياناتك ورسالتك وسيتواصل معك فريق المبيعات لتوضيح التفاصيل والأسعار والمساحات المتاحة.',
                en: 'Leave your details and message and our sales team will contact you with full details and available areas.',
              })}
            />
            <p className="mt-4 border-t border-stone-100 pt-3 text-center text-xs font-bold text-stone-500">
              {u('marketingDisclaimer')}
            </p>
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
        </div>
      </section>
    </>
  );
}

