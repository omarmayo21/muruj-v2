interface LogoProps {
  /** Use the light (white + luminous leaf-green) variant for dark backgrounds */
  light?: boolean;
  className?: string;
}

/**
 * Official Muruj Smouha Green City logo (512×323 aspect ratio = 124×78).
 * Uses WebP 1x + @2x Retina srcset with PNG fallback for crisp rendering at all DPIs.
 */
export function Logo({ light = false, className = 'h-11 w-auto md:h-12' }: LogoProps) {
  if (light) {
    return (
      <img
        src="/logo-light.png"
        alt="شعار كمبوند مروج"
        width={124}
        height={78}
        decoding="async"
        className={`shrink-0 object-contain ${className}`}
      />
    );
  }
  return (
    <picture className="inline-flex shrink-0 items-center">
      <source type="image/webp" srcSet="/logo.webp 1x, /logo@2x.webp 2x" />
      <img
        src="/logo.png"
        alt="شعار كمبوند مروج"
        width={124}
        height={78}
        decoding="async"
        fetchPriority="high"
        className={`shrink-0 object-contain ${className}`}
      />
    </picture>
  );
}
