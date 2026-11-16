import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { Logo } from './Logo';
import { Icon, WhatsAppIcon } from './Icon';
import { SITE, telLink, whatsappLink } from '../config/site';
import { track } from '../lib/analytics';
import { PROJECT } from '../data/project';

export function Footer() {
  const { u, t, lang } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-950 pb-24 text-white/80 md:pb-0">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-7">{u('footerAbout')}</p>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <Icon name="pin" size={16} className="text-gold-400" /> {t(PROJECT.location)}
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-base font-extrabold text-white">{u('footerLinks')}</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-gold-300" to="/">{u('navHome')}</Link></li>
            <li><Link className="hover:text-gold-300" to="/units">{u('navUnits')}</Link></li>
            <li><Link className="hover:text-gold-300" to="/gallery">{u('navGallery')}</Link></li>
            <li><Link className="hover:text-gold-300" to="/privacy">{u('privacyPolicy')}</Link></li>
          </ul>
          <h2 className="mb-2 mt-6 text-base font-extrabold text-white">{u('footerDevelopers')}</h2>
          <p className="text-sm leading-6">{lang === 'ar' ? 'تشييد · الغنيمي · إم دبليو إيه · الفرات' : 'Tasheed · El Ghoniemy · MWA · Alforat'}</p>
        </div>
        <div>
          <h2 className="mb-3 text-base font-extrabold text-white">{u('footerContact')}</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={telLink()} onClick={() => track('click_call', { location: 'footer' })} className="flex items-center gap-2 hover:text-gold-300" dir="ltr">
                <Icon name="phone" size={16} /> {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappLink(lang)} target="_blank" rel="noopener noreferrer" onClick={() => track('click_whatsapp', { location: 'footer' })} className="flex items-center gap-2 hover:text-gold-300">
                <WhatsAppIcon size={16} /> {u('whatsapp')}
              </a>
            </li>
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-gold-300">
                  <Icon name="mail" size={16} /> {SITE.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-bold text-gold-300">⚠ {u('disclaimer')}</p>
            <p className="font-bold text-white/85">{u('marketingDisclaimer')}</p>
          </div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © {year} {t(PROJECT.name)} — {u('rights')}
            </span>
            <Link to="/privacy" className="underline underline-offset-2 hover:text-gold-300">
              {u('privacyPolicy')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
