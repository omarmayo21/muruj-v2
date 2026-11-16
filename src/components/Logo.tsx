import { useLang } from '../i18n/LanguageContext';

/** Text-based wordmark in the project’s brand colours (green + gold). */
export function Logo({ light = false }: { light?: boolean }) {
  const { lang } = useLang();
  return (
    <span className="flex items-center gap-2.5" aria-label={lang === 'ar' ? 'كمبوند مروج سموحة' : 'Muruj Compound Smouha'}>
      <svg width="40" height="40" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
        <rect width="48" height="48" rx="12" fill="#1f5a42" />
        <path d="M11 36V20l7 6 6-12 6 12 7-6v16" fill="none" stroke="#d2b05e" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M11 39h26" stroke="#d2b05e" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`text-xl font-black tracking-tight ${light ? 'text-white' : 'text-brand-900'}`}>{lang === 'ar' ? 'مروج' : 'MURUJ'}</span>
        <span className={`mt-1 text-xs font-bold tracking-[0.12em] max-[379px]:hidden ${light ? 'text-gold-300' : 'text-gold-700'}`}>{lang === 'ar' ? 'سموحة · الإسكندرية' : 'SMOUHA · ALEXANDRIA'}</span>
      </span>
    </span>
  );
}
