import { Megaphone } from 'lucide-react';
import type { BannerContent } from '@/types/sections';
import { useSection } from '@/lib/hooks/useSection';
import { cn } from '@/lib/utils';

export function SiteBanner() {
  const { content } = useSection('site_banner');

  if (!content || content.kind !== 'banner' || !content.enabled) return null;

  const message = content.message?.trim();
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex shrink-0 items-center gap-2 border-b border-border',
        'bg-primary/15 px-3 py-1.5',
        'font-mono text-xs text-foreground/90',
      )}
    >
      <Megaphone className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span className="truncate">{message}</span>
    </div>
  );
}

export type { BannerContent };
