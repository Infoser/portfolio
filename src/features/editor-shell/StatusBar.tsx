import { ThemeToggle } from '@/design-system/ThemeToggle';
import { Mail, Link as LinkIcon, Phone } from 'lucide-react';
import type { ReactNode } from 'react';

type StatusBarProps = {
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  rightSlot?: ReactNode;
};

const STATUS_CONTACTS: Array<{ href: string; label: string; icon: typeof Mail }> = [
  { href: 'mailto:ishanksahu@bitdurg.ac.in', label: 'Email Ishan', icon: Mail },
  { href: 'https://github.com/ishanksahu', label: 'GitHub profile', icon: LinkIcon },
  { href: 'tel:+919302597193', label: 'Phone', icon: Phone },
];

const statusCell = 'flex items-center gap-1.5 px-2 h-full';

export function StatusBar({ leftSlot, centerSlot, rightSlot }: StatusBarProps) {
  return (
    <footer
      role="contentinfo"
      className="flex h-7 items-stretch justify-between border-t border-border bg-status-bar px-2 font-mono text-[11px] text-status-bar-foreground"
    >
      <div className="flex items-stretch gap-1">
        <span className={statusCell}>
          <span className="text-primary">●</span> main
        </span>
        {leftSlot}
      </div>
      <div className="flex items-stretch gap-1">
        {centerSlot}
      </div>
      <div className="flex items-stretch gap-1">
        {rightSlot}
        <span className={statusCell}>
          <ThemeToggle compact />
        </span>
        <span className="flex items-stretch">
          {STATUS_CONTACTS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex items-center px-2 text-status-bar-foreground/80 hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-3.5" />
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
