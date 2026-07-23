import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Dismiss the boot splash after React mounts + first paint.
// The hamster wheel needs ~1.8s of visibility for the running motion
// to be clearly perceived before the fade-out begins.
const dismissBootLoader = () => {
  const el = document.getElementById('boot-loader');
  if (!el) return;
  el.classList.add('boot-hidden');
  window.setTimeout(() => el.remove(), 500);
};

window.requestAnimationFrame(() => window.setTimeout(dismissBootLoader, 1800));
