/**
 * Captures UTM / click IDs on first landing and persists them in
 * localStorage (first-touch, 30 days) + sessionStorage (current session),
 * so they survive navigation between the 4 pages.
 */
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'] as const;
export type AttrKey = (typeof KEYS)[number];
export type Attribution = Partial<Record<AttrKey, string>> & { landing_page?: string; initial_referrer?: string; captured_at?: number };

const LS = 'muruj_attr';
const SS = 'muruj_attr_session';
const TTL = 30 * 24 * 60 * 60 * 1000;

function read(storage: Storage, key: string): Attribution | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}
function write(storage: Storage, key: string, v: Attribution) {
  try {
    storage.setItem(key, JSON.stringify(v));
  } catch {
    /* storage full / blocked */
  }
}

export function captureAttribution() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) fromUrl[k] = v.slice(0, 300);
  });
  const hasNew = Object.keys(fromUrl).length > 0;
  const externalRef = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : '';

  // Session: new campaign params always override (last click in session)
  const session = read(sessionStorage, SS);
  if (hasNew || !session) {
    write(sessionStorage, SS, {
      ...(session || {}),
      ...fromUrl,
      landing_page: hasNew || !session ? window.location.href : session?.landing_page,
      initial_referrer: externalRef || session?.initial_referrer || '',
      captured_at: Date.now(),
    });
  }

  // Local (first-touch with TTL), refreshed when new click IDs arrive
  const local = read(localStorage, LS);
  const expired = !local || !local.captured_at || Date.now() - local.captured_at > TTL;
  if (expired || hasNew) {
    write(localStorage, LS, {
      ...(expired ? {} : local),
      ...fromUrl,
      landing_page: window.location.href,
      initial_referrer: externalRef || (expired ? '' : local?.initial_referrer) || '',
      captured_at: Date.now(),
    });
  }
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  const local = read(localStorage, LS) || {};
  const session = read(sessionStorage, SS) || {};
  // session (most recent click) wins, fall back to stored first-touch
  return { ...local, ...Object.fromEntries(Object.entries(session).filter(([, v]) => v)) };
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent;
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return 'tablet';
  if (/Mobi|iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'mobile';
  if (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua)) return 'tablet';
  return 'desktop';
}
