import type { ReactNode } from 'react';

export function SectionHeading({ kicker, title, sub, center = true, light = false }: { kicker?: string; title: string; sub?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`mb-8 md:mb-12 ${center ? 'mx-auto max-w-2xl text-center' : ''}`}>
      {kicker && <p className={`mb-2 text-sm font-extrabold tracking-wide ${light ? 'text-gold-300' : 'text-gold-700'}`}>{kicker}</p>}
      <h2 className={`text-2xl font-black leading-snug md:text-4xl ${light ? 'text-white' : 'text-brand-900'}`}>{title}</h2>
      <span className={`mt-4 block h-1 w-16 rounded-full bg-gold-500 ${center ? 'mx-auto' : ''}`} aria-hidden="true" />
      {sub && <p className={`mt-4 text-base leading-relaxed md:text-lg ${light ? 'text-white/75' : 'text-stone-600'}`}>{sub}</p>}
    </div>
  );
}

export function Section({ id, children, className = '', ariaLabel }: { id?: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  return (
    <section id={id} aria-label={ariaLabel} className={`scroll-mt-20 py-14 md:py-20 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}
