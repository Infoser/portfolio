export type FontRole = 'display' | 'body' | 'mono';

export type FontConfig = {
  fontFamily: string;
  googleFontUrl: string;
  fallback: string;
  lineHeight: number;
  letterSpacing: string;
  weights: number[];
  preload?: boolean;
};

export const typography: Record<FontRole, FontConfig> = {
  display: {
    fontFamily: '"Newsreader", ui-serif, Georgia, serif',
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap',
    fallback: 'ui-serif, Georgia, serif',
    lineHeight: 1.15,
    letterSpacing: '-0.01em',
    weights: [400, 500, 600],
    preload: true,
  },
  body: {
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
    fallback: 'ui-sans-serif, system-ui, sans-serif',
    lineHeight: 1.6,
    letterSpacing: '0',
    weights: [400, 500, 600],
  },
  mono: {
    fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap',
    fallback: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
    lineHeight: 1.5,
    letterSpacing: '0',
    weights: [400, 500, 600],
  },
} as const;

export const fontRoles = Object.keys(typography) as FontRole[];
