import { Badge } from '@/design-system';
import { ExternalLink, Code2, Play, FileText, ArrowUpRight } from 'lucide-react';
import type { ComponentType } from 'react';
import type { StructuredEntryBase } from '@/types/sections';
import { cn } from '@/lib/utils';

const LINK_ICON: Record<'demo' | 'site' | 'github' | 'paper', ComponentType<{ className?: string }>> = {
  demo: Play,
  site: ExternalLink,
  github: Code2,
  paper: FileText,
};

const LINK_ICON_DEFAULT = ExternalLink;

type ProjectRendererProps = {
  entries: StructuredEntryBase[];
  emptyMessage?: string;
  className?: string;
};

export function ProjectRenderer({ entries, emptyMessage, className }: ProjectRendererProps) {
  if (!entries || entries.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        {emptyMessage ?? 'No projects wired yet. They will appear here once the admin uploads them.'}
      </p>
    );
  }

  return (
    <ol role="list" className={cn('flex flex-col gap-12', className)}>
      {entries.map((entry, idx) => (
        <li key={entry.id} className="relative">
          <article className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="order-2 flex flex-col gap-5 md:order-1">
              <header className="flex flex-col gap-2">
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                  aria-hidden="true"
                >
                  {String(idx + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
                </p>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-3xl font-medium tracking-tight">
                    {entry.title}
                  </h3>
                  {entry.subtitle && (
                    <p className="text-base text-muted-foreground">{entry.subtitle}</p>
                  )}
                </div>
              </header>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-mono text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {entry.bullets && entry.bullets.length > 0 && (
                <ul role="list" className="flex flex-col gap-3">
                  {entry.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="relative pl-5 text-sm leading-relaxed text-foreground/90"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2.5 size-1.5 rounded-full bg-primary"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {entry.links && entry.links.length > 0 && (
                <nav
                  aria-label={`${entry.title} links`}
                  className="flex flex-wrap items-center gap-2 pt-2"
                >
                  {entry.links.map((link) => {
                    const Icon = LINK_ICON[link.kind ?? 'site'] ?? LINK_ICON_DEFAULT;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label} for ${entry.title} — opens in new tab`}
                        className={cn(
                          'group inline-flex items-center gap-1.5 rounded-md',
                          'border border-border px-3 py-1.5',
                          'font-mono text-xs text-foreground',
                          'transition-colors hover:border-primary hover:text-primary',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        )}
                      >
                        <Icon className="size-3.5" />
                        {link.label}
                        <ArrowUpRight
                          className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </a>
                    );
                  })}
                </nav>
              )}
            </div>

            {entry.imageUrl && (
              <div className="order-1 md:order-2">
                <div className="group/img relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={entry.imageUrl}
                    alt={`${entry.title} preview`}
                    loading="lazy"
                    className={cn(
                      'size-full object-cover',
                      'transition-transform duration-700 ease-out',
                      'group-hover/img:scale-[1.03]',
                    )}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"
                  />
                </div>
              </div>
            )}
          </article>

          {idx < entries.length - 1 && (
            <hr
              aria-hidden="true"
              className="mt-12 border-0 border-t border-dashed border-border"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
