import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingButtons';
import Home from './pages/Home';
import { trackPageView } from './lib/analytics';
import { captureAttribution } from './lib/attribution';

// Route-level code splitting: Home is in the main bundle (Google Ads landing page),
// every other page is its own chunk, prefetched when the browser is idle.
const loadUnits = () => import('./pages/Units');
const loadGallery = () => import('./pages/Gallery');
const Units = lazy(loadUnits);
const Gallery = lazy(loadGallery);
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Privacy = lazy(() => import('./pages/Privacy'));

function usePrefetchRoutes() {
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const run = () => {
      void loadUnits();
      void loadGallery();
    };
    const id = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 4000 }) : window.setTimeout(run, 2500);
    return () => {
      if (!w.requestIdleCallback) window.clearTimeout(id);
    };
  }, []);
}

function RouteEffects() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    captureAttribution();
  }, [search]);
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    // wait for page title to be set by useHead
    const id = window.setTimeout(() => trackPageView(pathname + search, document.title), 50);
    return () => window.clearTimeout(id);
  }, [pathname, search, hash]);
  return null;
}

function Layout() {
  usePrefetchRoutes();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Suspense fallback={<div className="min-h-[110vh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FloatingButtons />
      <RouteEffects />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/units" element={<Units />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/thank-you" element={<ThankYou />} />
            {/* legal page — footer only, not part of the 4-page navigation */}
            <Route path="/privacy" element={<Privacy />} />
            {/* 404 → home (not a page of its own) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
