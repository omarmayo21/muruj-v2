import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initAnalytics } from './lib/analytics';
import { captureAttribution } from './lib/attribution';
import { isPlaceholderPhone } from './config/site';

captureAttribution();
initAnalytics();

if (import.meta.env.DEV && isPlaceholderPhone) {
  console.info('[Muruj] Phone/WhatsApp are placeholders — edit src/config/site.ts');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
