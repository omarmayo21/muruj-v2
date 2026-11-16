import { lazy, Suspense, useEffect, type ComponentProps } from 'react';

const load = () => import('./LeadForm');
const LeadFormInner = lazy(() => load().then((m) => ({ default: m.LeadForm })));

let prefetched = false;
/** Start downloading the form chunk as soon as the browser is idle */
export function prefetchLeadForm() {
  if (prefetched) return;
  prefetched = true;
  void load();
}

type Props = ComponentProps<typeof LeadFormInner>;

function Skeleton({ variant }: { variant?: 'full' | 'compact' }) {
  return (
    <div aria-busy="true" className={`animate-pulse rounded-2xl bg-white p-5 shadow-xl md:p-7 ${variant === 'compact' ? 'min-h-[470px]' : 'min-h-[560px]'}`}>
      <div className="mb-3 h-6 w-2/5 rounded bg-stone-200" />
      <div className="mb-6 h-4 w-3/4 rounded bg-stone-100" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="mb-5">
          <div className="mb-2 h-4 w-1/4 rounded bg-stone-100" />
          <div className="h-12 rounded-xl bg-stone-100" />
        </div>
      ))}
      <div className="h-14 rounded-xl bg-gold-200" />
    </div>
  );
}

export function LazyLeadForm(props: Props) {
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(prefetchLeadForm, { timeout: 1500 });
    else setTimeout(prefetchLeadForm, 600);
  }, []);
  return (
    <Suspense fallback={<Skeleton variant={props.variant} />}>
      <LeadFormInner {...props} />
    </Suspense>
  );
}
