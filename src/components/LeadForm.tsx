import { useId, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { SITE, telLink, unitOptions } from '../config/site';
import { PhoneField, computePhone, type PhoneValue } from './PhoneField';
import { Icon, WhatsAppIcon } from './Icon';
import { track } from '../lib/analytics';
import { getAttribution, getDeviceType } from '../lib/attribution';
import { newLeadId, normalizeEmail, normalizePhone, sha256 } from '../lib/hash';

import { LEAD_FLAG } from '../lib/leadFlag';
export { LEAD_FLAG };
const REQUEST_TIMEOUT_MS = 11000; // server channels time out at 8 s (parallel) → user never waits more than ~10 s
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Props {
  /** where the form is placed (sent with the lead + analytics) */
  location: string;
  variant?: 'full' | 'compact';
  title?: string;
  subtitle?: string;
  dark?: boolean;
}

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'unit' | 'form', string>>;

export function LeadForm({ location, variant = 'full', title, subtitle, dark }: Props) {
  const { u, t, lang } = useLang();
  const navigate = useNavigate();
  const uid = useId().replace(/:/g, '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState<PhoneValue>(() => computePhone('eg', ''));
  const [email, setEmail] = useState('');
  const [unit, setUnit] = useState('');
  const [hp, setHp] = useState(''); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [fallback, setFallback] = useState(false); // show Call / WhatsApp when the API cannot be reached
  const submitting = useRef(false);
  const started = useRef(false);
  const mountedAt = useRef(Date.now());

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track('form_start', { form_location: location });
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = u('errName');
    if (!phone.national.trim()) e.phone = u('errPhoneReq');
    else if (!phone.valid) e.phone = u('errPhone');
    if (email.trim() && !EMAIL_RE.test(email.trim())) e.email = u('errEmail');
    if (!unit) e.unit = u('errUnit');
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (submitting.current) return; // prevent double submit
    track('form_submit_attempt', { form_location: location });

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = (['name', 'phone', 'email', 'unit'] as const).find((k) => e[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    submitting.current = true;
    setLoading(true);
    setFallback(false);
    const attr = getAttribution();
    const leadId = newLeadId(); // unique per submission → Google Ads transaction_id (dedupe)
    const payload = {
      lead_id: leadId,
      name: name.trim(),
      phone: phone.e164,
      phone_country: phone.iso2.toUpperCase(),
      email: email.trim(),
      unit,
      website: hp, // honeypot
      page_url: window.location.href,
      referrer: attr.initial_referrer || document.referrer || '',
      landing_page: attr.landing_page || '',
      utm_source: attr.utm_source || '',
      utm_medium: attr.utm_medium || '',
      utm_campaign: attr.utm_campaign || '',
      utm_term: attr.utm_term || '',
      utm_content: attr.utm_content || '',
      gclid: attr.gclid || '',
      gbraid: attr.gbraid || '',
      wbraid: attr.wbraid || '',
      device: getDeviceType(),
      form_location: location,
      lang,
      client_ts: new Date().toISOString(),
      elapsed_ms: Date.now() - mountedAt.current,
    };

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      window.clearTimeout(timer);
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (res.ok && data.success) {
        // SHA-256 hashes for Enhanced Conversions (raw PII is never stored in the browser)
        const [hEmail, hPhone] = await Promise.all([
          payload.email ? sha256(normalizeEmail(payload.email)) : Promise.resolve(''),
          sha256(normalizePhone(payload.phone)),
        ]);
        try {
          sessionStorage.setItem(LEAD_FLAG, JSON.stringify({ ts: Date.now(), tid: leadId, unit, e: hEmail, p: hPhone }));
        } catch {
          /* ignore */
        }
        track('form_submit_success', { form_location: location, unit });
        navigate('/thank-you', { state: { submitted: true } });
        return;
      }
      setErrors({ form: res.status === 429 ? u('errRate') : u('errServer') });
      setFallback(true);
      track('form_submit_error', { form_location: location, status: res.status });
    } catch {
      window.clearTimeout(timer);
      setErrors({ form: u('errNetwork') });
      setFallback(true);
      track('form_submit_error', { form_location: location, status: 0 });
    }
    submitting.current = false;
    setLoading(false);
  };

  /** WhatsApp fallback carrying the lead details so the lead is never lost */
  const fallbackWhatsapp = () => {
    const lines: string[] = [SITE.whatsappMessage[lang]];
    if (name.trim()) lines.push(`${u('name')}: ${name.trim()}`);
    if (phone.e164) lines.push(`${u('phone')}: ${phone.e164}`);
    if (unit) lines.push(`${u('unit')}: ${unit}`);
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const label = dark ? 'text-white/90' : 'text-stone-700';
  const inputCls = (err?: string) =>
    `w-full rounded-xl border bg-white px-3.5 py-3 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:ring-2 focus:ring-gold-400/60 ${err ? 'border-red-400' : 'border-stone-300 focus:border-brand-600'}`;
  const errCls = dark ? 'text-red-200' : 'text-red-600';

  return (
    <form onSubmit={onSubmit} noValidate className="relative" aria-label={title || u('formTitle')} data-form-location={location}>
      {(title || variant === 'full') && (
        <div className="mb-5">
          <h3 className={`text-xl font-extrabold md:text-2xl ${dark ? 'text-white' : 'text-brand-900'}`}>{title || u('formTitle')}</h3>
          {(subtitle || variant === 'full') && <p className={`mt-1.5 text-sm leading-relaxed ${dark ? 'text-white/75' : 'text-stone-600'}`}>{subtitle || u('formSub')}</p>}
        </div>
      )}

      <div className={variant === 'full' ? 'grid gap-4 md:grid-cols-2' : 'grid gap-3.5'}>
        {/* Name */}
        <div>
          <label htmlFor={`${uid}-name`} className={`mb-1.5 block text-sm font-bold ${label}`}>
            {u('name')} <span className="text-red-500">*</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className={inputCls(errors.name)}
            placeholder={u('namePh')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={onStart}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            aria-required="true"
            maxLength={80}
          />
          {errors.name && (
            <p id={`${uid}-name-err`} role="alert" className={`mt-1 text-xs font-semibold ${errCls}`}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor={`${uid}-phone`} className={`mb-1.5 block text-sm font-bold ${label}`}>
            {u('phone')} <span className="text-red-500">*</span>
          </label>
          <PhoneField inputId={`${uid}-phone`} value={phone} onChange={setPhone} onFocus={onStart} error={errors.phone} />
          {errors.phone && (
            <p id={`${uid}-phone-err`} role="alert" className={`mt-1 text-xs font-semibold ${errCls}`}>
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email (optional) */}
        <div>
          <label htmlFor={`${uid}-email`} className={`mb-1.5 block text-sm font-bold ${label}`}>
            {u('email')} <span className={`text-xs font-normal ${dark ? 'text-white/60' : 'text-stone-500'}`}>{u('optional')}</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            className={`${inputCls(errors.email)} text-start`}
            placeholder={u('emailPh')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={onStart}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            maxLength={120}
          />
          {errors.email && (
            <p id={`${uid}-email-err`} role="alert" className={`mt-1 text-xs font-semibold ${errCls}`}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label htmlFor={`${uid}-unit`} className={`mb-1.5 block text-sm font-bold ${label}`}>
            {u('unit')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id={`${uid}-unit`}
              name="unit"
              className={`${inputCls(errors.unit)} appearance-none pe-10 ${unit ? '' : 'text-stone-400'}`}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              onFocus={onStart}
              aria-invalid={!!errors.unit}
              aria-describedby={errors.unit ? `${uid}-unit-err` : undefined}
              aria-required="true"
            >
              <option value="" disabled>
                {u('unitPh')}
              </option>
              {unitOptions.map((o) => (
                <option key={o.value} value={o.value} className="text-stone-900">
                  {t(o.label)}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={18} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-stone-500" />
          </div>
          {errors.unit && (
            <p id={`${uid}-unit-err`} role="alert" className={`mt-1 text-xs font-semibold ${errCls}`}>
              {errors.unit}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot — hidden from humans */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
      </div>

      {errors.form && (
        <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-relaxed text-red-700">
          {errors.form}
          {fallback && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={telLink()}
                onClick={() => track('click_call', { location: 'form_fallback' })}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-800 px-3 py-2.5 text-sm font-extrabold text-white"
              >
                <Icon name="phone" size={16} /> {u('callUs')}
              </a>
              <a
                href={fallbackWhatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('click_whatsapp', { location: 'form_fallback' })}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0f7d44] px-3 py-2.5 text-sm font-extrabold text-white"
              >
                <WhatsAppIcon size={16} /> {u('whatsapp')}
              </a>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="btn-gold mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-extrabold shadow-lg disabled:cursor-wait disabled:opacity-80"
      >
        {loading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-900/30 border-t-brand-900" aria-hidden="true" />
            {u('sending')}
          </>
        ) : (
          <>
            {u('submit')}
            <Icon name="arrow" size={20} className="rtl:rotate-180" />
          </>
        )}
      </button>
      <p className={`mt-3 flex flex-wrap items-center justify-center gap-1 text-center text-xs leading-relaxed ${dark ? 'text-white/75' : 'text-stone-600'}`}>
        <Icon name="shield" size={14} /> {u('consentPrefix')}{' '}
        <Link to="/privacy" className={`font-bold underline underline-offset-2 ${dark ? 'text-gold-300' : 'text-brand-800'}`}>
          {u('privacyPolicy')}
        </Link>
      </p>
    </form>
  );
}
