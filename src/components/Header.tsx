import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { Logo } from './Logo';
import { Icon } from './Icon';
import { goToForm } from '../lib/cta';
import { SITE, telLink } from '../config/site';
import { track } from '../lib/analytics';

export function Header() {
  const { u, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { to: '/', label: u('navHome') },
    { to: '/units', label: u('navUnits') },
    { to: '/gallery', label: u('navGallery') },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-all ${scrolled ? 'border-stone-200/80 bg-white/95 shadow-sm backdrop-blur' : 'border-transparent bg-white'}`}>
      <div className="container-x flex h-16 items-center justify-between gap-3 md:h-[72px]">
        <Link to="/" className="shrink-0" aria-label={u('navHome')}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) => `rounded-lg px-4 py-2 text-[15px] font-bold transition ${isActive ? 'bg-brand-50 text-brand-800' : 'text-stone-700 hover:bg-stone-100 hover:text-brand-800'}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={toggle} className="flex items-center gap-1.5 rounded-lg px-2 py-2 sm:px-2.5 text-sm font-bold text-stone-700 hover:bg-stone-100" aria-label="Switch language">
            <Icon name="globe" size={18} />
            <span className="hidden sm:inline">{u('langSwitch')}</span>
            <span className="sm:hidden">{u('langSwitch') === 'English' ? 'EN' : 'ع'}</span>
          </button>
          <a href={telLink()} onClick={() => track('click_call', { location: 'header' })} className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-brand-800 hover:bg-brand-50 md:flex" dir="ltr">
            <Icon name="phone" size={18} />
            {SITE.phoneDisplay}
          </a>
          <button onClick={() => goToForm('header_book_now', navigate)} className="btn-gold whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-extrabold shadow sm:px-4 md:px-5 md:text-base">
            {u('bookNow')}
          </button>
          <button className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label={u('menu')}>
            <Icon name={open ? 'x' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-stone-100 bg-white lg:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col py-2">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className={({ isActive }) => `rounded-lg px-3 py-3 text-base font-bold ${isActive ? 'bg-brand-50 text-brand-800' : 'text-stone-700'}`}>
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
