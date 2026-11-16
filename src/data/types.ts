export type Lang = 'ar' | 'en';
export interface L {
  ar: string;
  en: string;
}
export interface ImageAsset {
  src: string;
  srcSm?: string;
  /** 480px thumbnail */
  srcXs?: string;
  width: number;
  height: number;
  alt: string;
  altEn: string;
  category: string;
}
