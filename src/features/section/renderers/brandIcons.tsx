import type { ComponentType } from 'react';

export type IconProps = { className?: string };

/**
 * Brand icons for social channels — lucide-react v1 dropped branded icons,
 * so we ship tiny SVG components that match lucide's `size-*` className convention.
 * Keep this file component-only (no constant/record exports) to satisfy the
 * react/only-export-components fast-refresh rule.
 */

export const GithubIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.07-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.24-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.24 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.69.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
  </svg>
);

export const LinkedinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M20.45 20.45h-3.56v-5.56c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92v5.66H9.36V9h3.42v1.56h.05c.48-.9 1.64-1.84 3.37-1.84 3.6 0 4.27 2.37 4.27 5.45v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

export const HuggingfaceIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-3.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 14c1.6 0 3 .9 3.7 2.2.2.3-.1.7-.4.6-1.9-.9-4.7-.9-6.6 0-.3.1-.6-.2-.4-.5C9 14.9 10.4 14 12 14zM7 17a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm12 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
  </svg>
);

export type BrandIconComponent = ComponentType<IconProps>;
