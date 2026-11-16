import { useEffect, useRef } from 'react';
import type { ImageAsset } from '../data/types';
import { useLang } from '../i18n/LanguageContext';
import { Icon } from './Icon';

interface Props {
  images: ImageAsset[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}

export function Lightbox({ images, index, onClose, onIndex }: Props) {
  const { u, lang, dir } = useLang();
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const n = images.length;

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === 'Escape') onClose();
      const fwd = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === fwd) onIndex((index + 1) % n);
      if (e.key === back) onIndex((index - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open, index, n, onClose, onIndex, dir]);

  if (index === null) return null;
  const img = images[index];
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? img.alt : img.altEn}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) {
          const forward = (dx < 0) !== (dir === 'rtl');
          onIndex(forward ? (index + 1) % n : (index - 1 + n) % n);
        }
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between p-3 text-white">
        <span className="text-sm tabular-nums text-white/70">
          {index + 1} / {n}
        </span>
        <button ref={closeRef} onClick={onClose} className="rounded-full bg-white/10 p-2.5 hover:bg-white/20" aria-label={u('close')}>
          <Icon name="x" size={24} />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-16" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img src={img.src} width={img.width} height={img.height} alt={lang === 'ar' ? img.alt : img.altEn} className="max-h-full max-w-full object-contain" />
        <button onClick={() => onIndex((index - 1 + n) % n)} className="absolute start-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 md:start-4" aria-label={u('prevSlide')}>
          <Icon name={dir === 'rtl' ? 'chevronRight' : 'chevronLeft'} size={26} />
        </button>
        <button onClick={() => onIndex((index + 1) % n)} className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 md:end-4" aria-label={u('nextSlide')}>
          <Icon name={dir === 'rtl' ? 'chevronLeft' : 'chevronRight'} size={26} />
        </button>
      </div>
      <p className="p-4 text-center text-sm text-white/85">{lang === 'ar' ? img.alt : img.altEn}</p>
    </div>
  );
}
