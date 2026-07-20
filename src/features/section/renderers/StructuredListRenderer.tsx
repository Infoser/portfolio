import { Badge, Card, CardContent, CardHeader } from '@/design-system';
import { ExternalLink, Code2, Play, FileText, Calendar, MapPin } from 'lucide-react';
import type { ComponentType } from 'react';
import type { StructuredEntryBase } from '@/types/sections';

const LINK_ICON: Record<'demo' | 'site' | 'github' | 'paper', ComponentType<{ className?: string }>> = {
  demo: Play,
  site: ExternalLink,
  github: Code2,
  paper: FileText,
};

const LINK_ICON_DEFAULT = ExternalLink;

type StructuredListRendererProps = {
  entries: StructuredEntryBase[];
  emptyMessage?: string;
  className?: string;
};

export function StructuredListRenderer({ entries, emptyMessage, className }: StructuredListRendererProps) {
  if (!entries || entries.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        {emptyMessage ?? 'No entries yet. I\u2019ll add these later.'}
      </p>
    );
  }

  return (
    <ol role="list" className={'flex flex-col gap-4 ' + (className ?? '')}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <Card>
            <CardHeader>
              <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-medium tracking-tight">
                      {entry.title}
                    </h3>
                  </div>
                  {entry.subtitle && (
                    <p className="text-sm font-medium text-muted-foreground">
                      {entry.subtitle}
                    </p>
                  )}
                </div>
                {(entry.start || entry.location) && (
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {(entry.start || entry.end) && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        {entry.start}
                        {entry.end && entry.start !== entry.end ? ` — ${entry.end}` : ''}
                      </span>
                    )}
                    {entry.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" />
                        {entry.location}
                      </span>
                    )}
                  </div>
                )}
              </header>
              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {entry.imageUrl && (
                <img
                  src={entry.imageUrl}
                  alt={`${entry.title} preview`}
                  loading="lazy"
                  className="mb-4 max-h-64 w-full rounded-md border border-border object-cover"
                />
              )}
              {entry.bullets && entry.bullets.length > 0 && (
                <ul role="list" className="flex flex-col gap-2">
                  {entry.bullets.map((bullet, i) => (
                    <li key={i} className="flex flex-row gap-2 text-sm leading-relaxed">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {entry.links && entry.links.length > 0 && (
                <nav
                  aria-label={`${entry.title} links`}
                  className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3"
                >
                  {entry.links.map((link) => {
                    const Icon = LINK_ICON[link.kind ?? 'site'] ?? LINK_ICON_DEFAULT;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label} — opens in new tab`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-xs text-foreground transition-colors hover:bg-muted hover:text-primary"
                      >
                        <Icon className="size-3.5" />
                        {link.label}
                      </a>
                    );
                  })}
                </nav>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  );
}
