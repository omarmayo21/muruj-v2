import { useEffect } from 'react';
import { SITE } from '../config/site';

interface HeadOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Lightweight per-route <head> manager (title, description, OG, canonical, robots) */
export function useHead({ title, description, path, noindex, image = '/images/og-muruj.jpg' }: HeadOptions) {
  useEffect(() => {
    document.title = title;
    const url = `${SITE.siteUrl}${path}`;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', `${SITE.siteUrl}${image}`);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, path, noindex, image]);
}
