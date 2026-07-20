import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/theme';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        'border border-transparent',
        'transition-colors hover:bg-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        compact ? 'size-7' : 'size-9',
      )}
    >
      {isDark ? <Sun className={compact ? 'size-3.5' : 'size-4'} /> : <Moon className={compact ? 'size-3.5' : 'size-4'} />}
      <span className="sr-only">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
