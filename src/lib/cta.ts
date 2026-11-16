import { track } from './analytics';

/** Smooth-scroll to the nearest lead form on the page (or go to home form). */
export function goToForm(cta: string, navigate?: (to: string) => void) {
  track('cta_click', { cta });
  const el = document.getElementById('lead-form');
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    window.setTimeout(() => {
      const first = el.querySelector<HTMLInputElement>('input[name="name"]');
      first?.focus({ preventScroll: true });
    }, 600);
  } else if (navigate) {
    navigate('/#lead-form');
  }
}
