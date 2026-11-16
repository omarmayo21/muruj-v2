import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { IMAGES } from '../data/images.generated';
import { HERO_SLIDES, KEY_INFO } from '../data/project';
import { Img } from './Img';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { goToForm } from '../lib/cta';
import { track } from '../lib/analytics';

export function Hero() {
  const { u, t, dir } = useLang();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [mountAll, setMountAll] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = HERO_SLIDES.length;

  const go = useCallback((i: number) => setIdx(((i % n) + n) % n), [n]);

  // Mount the other slides only after the page has loaded (protects LCP on mobile)
  useEffect(() => {
    const done = () => window.setTimeout(() => setMountAll(true), 1200);
    if (document.readyState === 'complete') done();
    else window.addEventListener('load', done, { once: true });
    return () => window.removeEventListener('load', done);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!mountAll || paused || reduce) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % n), 5500);
    return () => window.clearInterval(id);
  }, [mountAll, paused, n]);

  const cards = KEY_INFO;
  const nextIcon = dir === 'rtl' ? 'chevronLeft' : 'chevronRight';
  const prevIcon = dir === 'rtl' ? 'chevronRight' : 'chevronLeft';

  return (
    <section aria-label={u('heroTitle')} className="relative bg-brand-950">
      {/* ---- Slider ---- */}
      <div
        className="relative h-[68svh] min-h-[440px] w-full overflow-hidden md:h-[78vh] md:max-h-[760px] md:min-h-[540px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 45) go(idx + ((dx < 0 ? 1 : -1) * (dir === 'rtl' ? -1 : 1)));
          touchX.current = null;
        }}
        aria-roledescription="carousel"
      >
        {HERO_SLIDES.map((key, i) =>
          i === 0 || mountAll ? (
            <div
              key={key}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={i !== idx}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${n}`}
            >
              <Img image={IMAGES[key]} priority={i === 0} mobileSmall className={`h-full w-full object-cover ${i === idx ? 'hero-zoom' : ''}`} />
            </div>
          ) : null,
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/55 to-brand-950/10" />

        {/* Headline */}
        <div className="container-x absolute inset-x-0 bottom-0 pb-20 md:pb-28">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Logo light className="h-10 w-auto drop-shadow md:h-12" />
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-gold-200 backdrop-blur md:text-sm">
              <Icon name="pin" size={15} /> {u('heroKicker')}
            </p>
          </div>
          <h1 className="max-w-3xl text-[2rem] font-black leading-[1.2] text-white drop-shadow md:text-6xl">
            {u('heroTitle')}
            <span className="mt-2 block text-lg font-bold text-gold-300 md:text-2xl">{t({ ar: 'مجتمع متكامل على 182 فدان أمام جرين بلازا', en: 'An integrated 182-feddan community opposite Green Plaza' })}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 md:text-lg">{u('heroSub')}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => goToForm('hero_primary', navigate)} className="btn-gold inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-extrabold shadow-xl md:text-lg">
              {u('heroCta')} <Icon name="arrow" size={20} className="rtl:rotate-180" />
            </button>
            <Link to="/units" onClick={() => track('cta_click', { cta: 'hero_units' })} className="hidden items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur hover:bg-white/20 sm:inline-flex">
              {u('heroCta2')}
            </Link>
          </div>
        </div>

        {/* Controls */}
        {mountAll && (
          <>
            <button onClick={() => go(idx - 1)} aria-label={u('prevSlide')} className="absolute start-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2.5 text-white backdrop-blur hover:bg-white/35 md:block">
              <Icon name={prevIcon} size={24} />
            </button>
            <button onClick={() => go(idx + 1)} aria-label={u('nextSlide')} className="absolute end-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2.5 text-white backdrop-blur hover:bg-white/35 md:block">
              <Icon name={nextIcon} size={24} />
            </button>
          </>
        )}
        <div className="absolute inset-x-0 bottom-6 flex justify-center gap-0.5 md:bottom-10">
          {HERO_SLIDES.map((k, i) => (
            <button key={k} onClick={() => go(i)} aria-label={`${u('goToSlide')} ${i + 1}`} aria-current={i === idx} className="grid h-6 min-w-6 place-items-center px-0.5">
              <span className={`block h-1.5 rounded-full transition-all ${i === idx ? 'w-7 bg-gold-400' : 'w-2.5 bg-white/60'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* ---- Key info cards ---- */}
      <div className="container-x relative z-10 -mt-6 pb-8 md:-mt-14 md:pb-12">
        <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
          {cards.map((c) => (
            <li key={c.label.en} className="rounded-2xl border border-white/10 bg-white p-3.5 shadow-lg shadow-brand-950/10 md:p-5">
              <div className="flex items-center gap-2 text-gold-700">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 md:h-10 md:w-10">
                  <Icon name={c.icon} size={20} />
                </span>
                <span className="text-xs font-bold text-stone-500 md:text-sm">{t(c.label)}</span>
              </div>
              <p className="mt-2 text-sm font-extrabold leading-snug text-brand-900 md:text-lg">{t(c.value)}</p>
              {c.note && <p className="mt-0.5 text-xs text-stone-500 md:text-xs">{t(c.note)}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
