import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useHead } from '../lib/head';
import { ROUTE_SEO } from '../config/seo';
import { useLang } from '../i18n/LanguageContext';
import { KEY_INFO } from '../data/project';
import { IMAGES } from '../data/images.generated';
import { whatsappLink } from '../config/site';
import { fireLeadConversion, track } from '../lib/analytics';
import { LEAD_FLAG } from '../lib/leadFlag';
import { Img } from '../components/Img';
import { Icon, WhatsAppIcon } from '../components/Icon';
import { Logo } from '../components/Logo';

export default function ThankYou() {
  const { u, t, lang } = useLang();
  const fired = useRef(false);

  useHead({
    title: ROUTE_SEO['/thank-you'].title[lang],
    description: ROUTE_SEO['/thank-you'].description[lang],
    path: '/thank-you',
    noindex: true,
  });

  /**
   * Conversion fires ONLY if a real successful submit set the sessionStorage
   * flag. The flag is removed immediately so a refresh / direct visit / back
   * navigation never fires it again.
   */
  useEffect(() => {
    if (fired.current) return; // guards React StrictMode double-invoke
    fired.current = true;
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(LEAD_FLAG);
      if (raw) sessionStorage.removeItem(LEAD_FLAG);
    } catch {
      raw = null;
    }
    if (!raw) return;
    try {
      const d = JSON.parse(raw) as { ts: number; tid?: string; unit?: string; e?: string; p?: string };
      // ignore stale flags (older than 30 minutes) or flags without a submission id
      if (!d.ts || !d.tid || Date.now() - d.ts > 30 * 60 * 1000) return;
      // never fire the same submission twice (extra guard on top of removing the flag)
      const FIRED_KEY = 'muruj_fired_tids';
      let fired: string[] = [];
      try {
        fired = JSON.parse(localStorage.getItem(FIRED_KEY) || '[]') as string[];
      } catch {
        fired = [];
      }
      if (fired.includes(d.tid)) return;
      try {
        localStorage.setItem(FIRED_KEY, JSON.stringify([...fired, d.tid].slice(-20)));
      } catch {
        /* storage full / blocked → still fire once */
      }
      fireLeadConversion({ transaction_id: d.tid, unit: d.unit, sha256_email_address: d.e || undefined, sha256_phone_number: d.p || undefined });
    } catch {
      /* malformed flag → do nothing */
    }
  }, []);

  const cards = KEY_INFO;

  return (
    <section className="relative overflow-hidden bg-brand-950 py-14 text-white md:py-20">
      <Img image={IMAGES.villasStreet} priority className="absolute inset-0 h-full w-full object-cover opacity-20" sizes="100vw" />
      <div className="container-x relative max-w-4xl text-center">
        <div className="mb-5 flex justify-center">
          <Logo light className="h-14 w-auto" />
        </div>
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-400 text-brand-950 shadow-xl">
          <Icon name="check" size={44} strokeWidth={2.6} />
        </span>
        <h1 className="mt-6 text-3xl font-black leading-snug md:text-5xl">{u('tyTitle')}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">{u('tySub')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappLink(lang)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('click_whatsapp', { location: 'thank_you' })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f7d44] px-7 py-4 text-lg font-extrabold text-white shadow-lg hover:brightness-105"
          >
            <WhatsAppIcon size={22} /> {u('chatWhatsapp')}
          </a>
          <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-lg font-bold text-white hover:bg-white/20">
            {u('backHome')}
          </Link>
        </div>

        <div className="mt-12 rounded-3xl bg-white p-5 text-start text-stone-800 shadow-2xl md:p-8">
          <h2 className="mb-4 text-xl font-extrabold text-brand-900">
            {u('tySummary')} — {t({ ar: 'كمبوند مروج سموحة', en: 'Muruj Compound Smouha' })}
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {cards.map((c) => (
              <li key={c.label.en} className="rounded-xl bg-stone-50 p-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
                  <Icon name={c.icon} size={16} className="text-gold-700" /> {t(c.label)}
                </span>
                <span className="mt-1 block text-sm font-extrabold text-brand-900">{t(c.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
