import { useEffect, useState } from 'react';
import { Button } from '@/design-system';
import { Input } from '@/design-system';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type AboutRolesEditorProps = {
  initialEnabled: boolean;
  initialRoles: string[];
  onChange: (data: { enabled: boolean; roles: string[] }) => void;
};

// Editor for the `about_roles` meta section — the list of roles that
// cycle through the typewriter at the top of the About page. Mirrors
// BannerEditor's prop shape (initial values + onChange callback) so it
// slots into AdminShell's existing dispatch the same way.
//
// Roles are stored as a string[]. Empty strings are tolerated in the
// editor (so the user can blank a row mid-edit) but the consumer
// <RoleTypewriter> falls back to the bundled default when the cleaned
// list is empty, so blanks effectively disappear on the public site.
export function AboutRolesEditor({
  initialEnabled,
  initialRoles,
  onChange,
}: AboutRolesEditorProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [hasInit, setHasInit] = useState(false);

  useEffect(() => {
    if (!hasInit) {
      setHasInit(true);
      return;
    }
    onChange({ enabled, roles });
  }, [enabled, roles, hasInit, onChange]);

  const addRole = () => setRoles((r) => [...r, '']);
  const removeRole = (idx: number) => setRoles((r) => r.filter((_, i) => i !== idx));
  const updateRole = (idx: number, value: string) =>
    setRoles((r) => r.map((v, i) => (i === idx ? value : v)));

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          aria-label="Show role typewriter on About page"
          className="size-4 cursor-pointer accent-primary"
        />
        <span className="font-mono text-sm text-foreground">
          Show role typewriter on About page
        </span>
      </label>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Roles (shown after &ldquo;I am &rdquo;)
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRole}
            className="h-7 gap-1 px-2 text-xs"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add role
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          {roles.length === 0 && (
            <p className="font-mono text-[11px] text-muted-foreground/70">
              No roles yet — click &ldquo;Add role&rdquo; to add one. With an
              empty list the typewriter is hidden on the public site.
            </p>
          )}
          {roles.map((role, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
                {idx + 1}.
              </span>
              <Input
                value={role}
                onChange={(e) => updateRole(idx, e.target.value)}
                spellCheck={true}
                maxLength={60}
                placeholder={`Role ${idx + 1}`}
                aria-label={`Role ${idx + 1}`}
                className={cn('font-mono text-sm')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeRole(idx)}
                className="size-7 shrink-0 p-0"
                aria-label={`Remove role ${idx + 1}`}
              >
                <X className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
        <p className="font-mono text-[11px] text-muted-foreground/70">
          Each role cycles in the typewriter at the top of the About page
          ({`I am <role>`}). Keep them short noun phrases.
        </p>
      </div>

      <div className="rounded-md border border-border bg-surface p-4">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Live preview
        </p>
        {enabled && roles.some((r) => r.trim()) ? (
          <p className="font-display text-2xl font-medium tracking-tight">
            <span className="text-foreground">I am </span>
            <span className="text-primary">
              {roles.find((r) => r.trim()) || ''}
            </span>
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block w-[2px] bg-primary"
              style={{ height: '1.1em' }}
            />
          </p>
        ) : (
          <p className="font-mono text-[11px] text-muted-foreground/70">
            {enabled
              ? 'Add at least one non-empty role to see the preview.'
              : 'Disabled — typewriter will not render.'}
          </p>
        )}
      </div>
    </div>
  );
}
