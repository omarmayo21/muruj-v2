import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { defaultCountries, parseCountry } from 'react-international-phone';

/** Emoji flag from ISO2 (no network request; falls back to letters on Windows) */
function Flag({ iso2, size }: { iso2: string; size: number }) {
  const emoji = iso2.toUpperCase().replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
  return (
    <span aria-hidden="true" className="inline-block leading-none" style={{ fontSize: size, fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}>
      {emoji}
    </span>
  );
}
import { AsYouType, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
import { useLang } from '../i18n/LanguageContext';
import { Icon } from './Icon';

export interface PhoneValue {
  iso2: string;
  national: string;
  /** E.164 (e.g. +201001234567) when valid, '' otherwise */
  e164: string;
  valid: boolean;
}

interface Country {
  iso2: string;
  dial: string;
  en: string;
  ar: string;
}

const PREFERRED = ['eg', 'sa', 'ae', 'kw', 'qa', 'bh', 'om', 'jo', 'ly'];

let displayAr: Intl.DisplayNames | null = null;
try {
  displayAr = new Intl.DisplayNames(['ar'], { type: 'region' });
} catch {
  displayAr = null;
}

const COUNTRIES: Country[] = defaultCountries.map((c) => {
  const p = parseCountry(c);
  let ar = p.name;
  try {
    ar = displayAr?.of(p.iso2.toUpperCase()) || p.name;
  } catch {
    /* ignore */
  }
  return { iso2: p.iso2, dial: p.dialCode, en: p.name, ar };
});

/** Arabic-insensitive normalization for searching */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u0652]/g, '')
    .trim();

/** Convert Arabic-Indic digits to Latin */
const toLatinDigits = (s: string) => s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

export function computePhone(iso2: string, national: string): PhoneValue {
  const raw = toLatinDigits(national).replace(/[^\d+]/g, '');
  if (!raw) return { iso2, national, e164: '', valid: false };
  const parsed = raw.startsWith('+') ? parsePhoneNumberFromString(raw) : parsePhoneNumberFromString(raw, iso2.toUpperCase() as CountryCode);
  const valid = !!parsed && parsed.isValid();
  return { iso2, national, e164: valid && parsed ? parsed.number : '', valid };
}

interface Props {
  value: PhoneValue;
  onChange: (v: PhoneValue) => void;
  onFocus?: () => void;
  error?: string;
  inputId: string;
}

export function PhoneField({ value, onChange, onFocus, error, inputId }: Props) {
  const { u, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const country = COUNTRIES.find((c) => c.iso2 === value.iso2) ?? COUNTRIES.find((c) => c.iso2 === 'eg')!;

  const list = useMemo(() => {
    const nq = norm(toLatinDigits(q).replace(/^\+/, ''));
    const sorted = [...PREFERRED.map((i) => COUNTRIES.find((c) => c.iso2 === i)!).filter(Boolean), ...COUNTRIES.filter((c) => !PREFERRED.includes(c.iso2))];
    if (!nq) return sorted;
    return sorted.filter((c) => norm(c.ar).includes(nq) || norm(c.en).includes(nq) || c.dial.startsWith(nq) || c.iso2 === nq);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    const t = window.setTimeout(() => searchRef.current?.focus(), 10);
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (c: Country) => {
    onChange(computePhone(c.iso2, value.national));
    setOpen(false);
    setQ('');
    window.setTimeout(() => document.getElementById(inputId)?.focus(), 10);
  };

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, list.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (list[active]) choose(list[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleInput = (raw: string) => {
    const latin = toLatinDigits(raw);
    // If the user pastes an international number, switch the country automatically
    if (latin.trim().startsWith('+') || latin.trim().startsWith('00')) {
      const intl = latin.trim().replace(/^00/, '+');
      const ayt = new AsYouType();
      ayt.input(intl.replace(/[^\d+]/g, ''));
      const iso = ayt.getCountry()?.toLowerCase();
      const parsed = parsePhoneNumberFromString(intl.replace(/[^\d+]/g, ''));
      if (iso && parsed) {
        onChange(computePhone(iso, parsed.nationalNumber));
        return;
      }
    }
    onChange(computePhone(value.iso2, latin.replace(/[^\d\s-]/g, '').slice(0, 20)));
  };

  const errId = `${inputId}-err`;
  return (
    <div ref={wrapRef} className="relative">
      <div dir="ltr" className={`flex items-stretch rounded-xl border bg-white transition focus-within:ring-2 focus-within:ring-gold-400/60 ${error ? 'border-red-400' : 'border-stone-300 focus-within:border-brand-600'}`}>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-s-xl border-e border-stone-200 bg-stone-50 px-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`${u('chooseCountry')}: ${lang === 'ar' ? country.ar : country.en} +${country.dial}`}
          onClick={() => setOpen((o) => !o)}
        >
          <Flag iso2={country.iso2} size={20} />
          <span className="tabular-nums">+{country.dial}</span>
          <Icon name="chevronDown" size={16} />
        </button>
        <input
          id={inputId}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          dir="ltr"
          className="min-w-0 flex-1 rounded-e-xl bg-transparent px-3 py-3 text-base text-stone-900 outline-none placeholder:text-stone-400"
          placeholder={country.iso2 === 'eg' ? '010 0000 0000' : u('phonePh')}
          value={value.national}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={onFocus}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          aria-required="true"
        />
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 mt-1 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xl">
          <div className="flex items-center gap-2 border-b border-stone-100 px-3 py-2">
            <Icon name="search" size={18} className="text-stone-400" />
            <input
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
              placeholder={u('searchCountry')}
              className="w-full bg-transparent py-1.5 text-sm outline-none"
              aria-controls={listId}
              aria-activedescendant={list[active] ? `${listId}-${list[active].iso2}` : undefined}
            />
          </div>
          <ul ref={listRef} id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1" aria-label={u('chooseCountry')}>
            {list.length === 0 && <li className="px-4 py-3 text-sm text-stone-500">{u('noCountry')}</li>}
            {list.map((c, i) => (
              <li
                key={c.iso2}
                id={`${listId}-${c.iso2}`}
                data-idx={i}
                role="option"
                aria-selected={c.iso2 === country.iso2}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm ${i === active ? 'bg-brand-50' : ''} ${c.iso2 === country.iso2 ? 'font-bold text-brand-800' : 'text-stone-700'} ${i === PREFERRED.length - 1 && !q ? 'border-b border-stone-100' : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(c)}
              >
                <Flag iso2={c.iso2} size={18} />
                <span className="flex-1 truncate">{lang === 'ar' ? c.ar : c.en}</span>
                <span dir="ltr" className="tabular-nums text-stone-500">
                  +{c.dial}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
