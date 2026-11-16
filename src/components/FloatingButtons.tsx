import { useLang } from '../i18n/LanguageContext';
import { telLink, whatsappLink } from '../config/site';
import { track } from '../lib/analytics';
import { Icon, WhatsAppIcon } from './Icon';

/** Mobile only: sticky bottom bar (Call + WhatsApp) using the numbers in src/config/site.ts */
export function FloatingButtons() {
  const { u, lang } = useLang();
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-stone-200 bg-white/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <a href={telLink()} onClick={() => track('click_call', { location: 'floating_mobile' })} className="flex items-center justify-center gap-2 rounded-xl bg-brand-800 py-3 text-base font-extrabold text-white active:scale-[0.98]">
          <Icon name="phone" size={20} /> {u('callUs')}
        </a>
        <a
          href={whatsappLink(lang)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('click_whatsapp', { location: 'floating_mobile' })}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0f7d44] py-3 text-base font-extrabold text-white active:scale-[0.98]"
        >
          <WhatsAppIcon size={20} /> {u('whatsapp')}
        </a>
      </div>
    </>
  );
}
