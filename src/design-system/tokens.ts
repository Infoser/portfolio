export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'infoser-theme';

export const themeTokens = {
  accent: {
    primary: 'var(--color-primary)',
    accent: 'var(--color-accent)',
    research: 'var(--color-research)',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  },
} as const;
