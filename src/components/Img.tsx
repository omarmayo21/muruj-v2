import type { ImgHTMLAttributes } from 'react';
import type { ImageAsset } from '../data/types';
import { useLang } from '../i18n/LanguageContext';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height' | 'alt'> {
  image: ImageAsset;
  /** above-the-fold images should be eager + high priority */
  priority?: boolean;
  sizes?: string;
  /** Always use the 768px file on phones regardless of DPR (full-bleed backgrounds) */
  mobileSmall?: boolean;
}

/** Responsive, lazy-loaded image with intrinsic width/height to prevent CLS. */
export function Img({ image, priority, sizes = '(max-width: 768px) 100vw, 50vw', mobileSmall, className, ...rest }: Props) {
  const { lang } = useLang();
  const parts = [
    image.srcXs ? `${image.srcXs} 480w` : '',
    image.srcSm ? `${image.srcSm} 768w` : '',
    image.srcXs || image.srcSm ? `${image.src} ${image.width}w` : '',
  ].filter(Boolean);
  const srcSet = parts.length ? parts.join(', ') : undefined;
  if (mobileSmall && image.srcSm) {
    return (
      <picture style={{ display: 'contents' }}>
        <source media="(max-width: 768px)" srcSet={image.srcSm} />
        <img
          src={image.src}
          width={image.width}
          height={image.height}
          alt={lang === 'ar' ? image.alt : image.altEn}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // @ts-expect-error fetchpriority is valid HTML but not yet typed in React 18
          fetchpriority={priority ? 'high' : 'auto'}
          className={className}
          {...rest}
        />
      </picture>
    );
  }
  return (
    <img
      src={image.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={lang === 'ar' ? image.alt : image.altEn}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      // @ts-expect-error fetchpriority is valid HTML but not yet typed in React 18
      fetchpriority={priority ? 'high' : 'auto'}
      className={className}
      {...rest}
    />
  );
}
