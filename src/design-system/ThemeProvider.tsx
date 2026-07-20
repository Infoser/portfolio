import { useEffect, type ReactNode } from 'react';
import { initTheme, useThemeStore } from '@/store/theme';
import { typography, fontRoles, type FontRole } from '@/design-system/typography';

const injectFontLink = (role: FontRole) => {
  if (typeof document === 'undefined') return;
  const cfg = typography[role];
  const id = `infoser-font-${role}`;
  if (document.getElementById(id)) return;

  if (cfg.preload) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'preload';
    link.as = 'style';
    link.href = cfg.googleFontUrl;
    document.head.appendChild(link);
  }

  const stylesheet = document.createElement('link');
  stylesheet.id = `${id}-stylesheet`;
  stylesheet.rel = 'stylesheet';
  stylesheet.href = cfg.googleFontUrl;
  document.head.appendChild(stylesheet);
};

const injectAllFonts = () => {
  fontRoles.forEach(injectFontLink);
};

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const applyToDocument = useThemeStore((s) => s.applyToDocument);

  useEffect(() => {
    injectAllFonts();
    initTheme();
  }, []);

  useEffect(() => {
    applyToDocument();
  }, [applyToDocument]);

  return <>{children}</>;
}
