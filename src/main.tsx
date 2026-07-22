import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Dismiss the boot splash after React mounts + one frame paints.
// Grace period of 250ms ensures the splash is visible long enough
// to read "Loading workspace…" rather than flashing.
const dismissBootLoader = () => {
  const el = document.getElementById('boot-loader');
  if (!el) return;
  el.classList.add('boot-hidden');
  window.setTimeout(() => el.remove(), 500);
};

window.requestAnimationFrame(() => window.setTimeout(dismissBootLoader, 250));
