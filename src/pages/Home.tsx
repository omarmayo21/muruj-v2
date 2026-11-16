import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHead } from '../lib/head';
import { ROUTE_SEO } from '../config/seo';
import { useLang } from '../i18n/LanguageContext';
import { Hero } from '../components/Hero';
import { AboutSection, AmenitiesSection, FAQSection, FinalCTA, LeadFormSection, LocationSection, PaymentSection, UnitsSection } from '../components/sections';

export default function Home() {
  const { lang } = useLang();
  const { hash } = useLocation();
  useHead({
    title: ROUTE_SEO['/'].title[lang],
    description: ROUTE_SEO['/'].description[lang],
    path: '/',
  });

  useEffect(() => {
    if (hash === '#lead-form') {
      const t = window.setTimeout(() => {
        const el = document.getElementById('lead-form');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }, 150);
      return () => window.clearTimeout(t);
    }
  }, [hash]);

  return (
    <>
      {/* 1. Hero (images + key info) */}
      <Hero />
      {/* 2. Lead form — immediately after hero */}
      <LeadFormSection location="home_after_hero" />
      {/* 3. About */}
      <AboutSection />
      {/* 4. Units */}
      <UnitsSection />
      {/* 5. Amenities */}
      <AmenitiesSection />
      {/* 6. Location */}
      <LocationSection />
      {/* 7. Payment plans */}
      <PaymentSection />
      {/* 8. FAQ */}
      <FAQSection />
      {/* 9. Final CTA with the same form */}
      <FinalCTA location="home_final_cta" />
    </>
  );
}
