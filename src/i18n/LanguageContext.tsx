import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { L, Lang } from '../data/types';
import { UI, type UIKey } from './ui';

interface Ctx {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** translate a bilingual object */
  t: (v: L) => string;
  /** translate a UI key */
  u: (k: UIKey) => string;
}

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'muruj_lang';

function initialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'en' || q === 'ar') return q;
    const s = localStorage.getItem(STORAGE_KEY);
    if (s === 'en' || s === 'ar') return s;
  } catch {
    /* ignore */
  }
  return 'ar'; // Arabic by default
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((p) => (p === 'ar' ? 'en' : 'ar')), []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir,
      setLang,
      toggle,
      t: (v: L) => v[lang],
      u: (k: UIKey) => UI[k][lang],
    }),
    [lang, dir, setLang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const c = useContext(LanguageContext);
  if (!c) throw new Error('useLang must be used inside LanguageProvider');
  return c;
}
