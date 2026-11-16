import { useState } from 'react';
import { SITE } from '../config/site';
import { useLang } from '../i18n/LanguageContext';
import { Icon } from './Icon';

/** Click-to-load Google Map (keeps Lighthouse score high & avoids 3rd-party JS on load). */
export function MapEmbed() {
  const { u, lang } = useLang();
  const [show, setShow] = useState(false);
  if (!SITE.map.enabled) return null;
  const q = SITE.map.lat != null && SITE.map.lng != null ? `${SITE.map.lat},${SITE.map.lng}` : SITE.map.query;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&hl=${lang}&z=15&output=embed`;
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-stone-200 bg-brand-50 md:aspect-[16/9]">
      {show ? (
        <iframe title={u('locationTitle')} src={src} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <button onClick={() => setShow(true)} className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_center,#e7efe9,#cfe0d5)] text-brand-800">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <Icon name="pin" size={30} className="text-gold-700" />
          </span>
          <span className="text-base font-extrabold">{u('showMap')}</span>
          {SITE.map.lat == null && <span className="text-xs text-stone-500">{u('mapNote')}</span>}
        </button>
      )}
    </div>
  );
}
