import { Badge, Card, CardContent, CardHeader } from '@/design-system';
import { ExternalLink, Code2, Play, FileText, Calendar, MapPin, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import type { StructuredEntryBase } from '@/types/sections';
import { cn } from '@/lib/utils';

type LinkKind = 'demo' | 'site' | 'github' | 'paper' | 'read-more';

const LINK_ICON: Partial<Record<LinkKind, ComponentType<{ className?: string }>>> = {
  demo: Play,
  site: ExternalLink,
  github: Code2,
  paper: FileText,
  'read-more': BookOpen,
};

const LINK_ICON_DEFAULT = ExternalLink;

type StructuredListRendererProps = {
  entries: StructuredEntryBase[];
  emptyMessage?: string;
  className?: string;
};

/**
 * Map / timeline view of structured-list entries.
 *
 * A vertical spine runs down the left edge; each card is a node on the
 * spine with a small numbered marker. Cards stagger into view as they
 * scroll past, giving the section a "map" / flowchart feel rather than
 * a flat key-value dump.
 */
export function StructuredListRenderer({ entries, emptyMessage, className }: StructuredListRendererProps) {
  if (!entries || entries.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        {emptyMessage ?? 'No entries yet. I\u2019ll add these later.'}
      </p>
    );
  }

  return (
    <ol
      role="list"
      className={cn('relative flex flex-col gap-6 pl-8', className)}
    >
      {/* The spine — a thin vertical line behind all the node markers. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-primary/60 via-border to-transparent"
      />

      {entries.map((entry, idx) => {
        return (
          <motion.li
            key={entry.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Node marker on the spine. */}
            <span
              aria-hidden="true"
              className="absolute -left-8 top-5 flex size-6 items-center justify-center rounded-full border border-primary/40 bg-background font-mono text-[10px] text-primary"
            >
              {String(idx + 1).padStart(2, '0')}
            </span>

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
                      const LinkIconComp = LINK_ICON[link.kind ?? 'site'] ?? LINK_ICON_DEFAULT;
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.label} — opens in new tab`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-xs text-foreground transition-colors hover:bg-muted hover:text-primary"
                        >
                          <LinkIconComp className="size-3.5" />
                          {link.label}
                        </a>
                      );
                    })}
                  </nav>
                )}
              </CardContent>
            </Card>
          </motion.li>
        );
      })}
    </ol>
  );
}
