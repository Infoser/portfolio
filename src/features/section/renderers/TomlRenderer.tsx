type TomlRendererProps = {
  data: Record<string, unknown>;
  className?: string;
};

const INDENT = '  ';

const renderTomlValue = (value: unknown): string => {
  if (typeof value === 'string') return `"${value.replace(/"/g, '\\"')}"`;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return `[${value.map((v) => renderTomlValue(v)).join(', ')}]`;
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

const renderTomlNode = (
  key: string,
  value: unknown,
  depth: number,
  out: Array<{ line: React.ReactNode; key: string }>,
): void => {
  const indent = INDENT.repeat(depth);

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    out.push({ key, line: <span className="text-primary">{indent}[{key}]</span> });
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      renderTomlNode(k, v, depth + 1, out);
    }
    return;
  }

  out.push({
    key,
    line: (
      <>
        <span className="text-primary">{indent}{key}</span>
        <span className="text-muted-foreground"> = </span>
        {key === 'cv' && typeof value === 'string' && value.trim() ? (
          <a
            href={value.trim()}
            download
            className="inline-flex items-center gap-1 rounded border border-primary px-1.5 py-0.5 text-primary no-underline transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label={`Download CV — ${value.trim()}`}
          >
            <span>download CV</span>
          </a>
        ) : typeof value === 'string' && /^https?:\/\//.test(value) ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
          >
            {renderTomlValue(value)}
          </a>
        ) : typeof value === 'string' && /^mailto:|^tel:/.test(value) ? (
          <a
            href={value}
            className="text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
          >
            {renderTomlValue(value)}
          </a>
        ) : key === 'email' && typeof value === 'string' ? (
          <a
            href={`mailto:${value}`}
            className="text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
          >
            {renderTomlValue(value)}
          </a>
        ) : key === 'phone' && typeof value === 'string' ? (
          <a
            href={`tel:${value.replace(/[^+\d]/g, '')}`}
            className="text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
          >
            {renderTomlValue(value)}
          </a>
        ) : (
          <span className="text-foreground">{renderTomlValue(value)}</span>
        )}
      </>
    ),
  });
};

export function TomlRenderer({ data, className }: TomlRendererProps) {
  const lines: Array<{ line: React.ReactNode; key: string }> = [];
  for (const [k, v] of Object.entries(data ?? {})) {
    renderTomlNode(k, v, 0, lines);
  }

  return (
    <pre
      aria-label="Section content rendered as TOML"
      className={
        'overflow-x-auto rounded-md border border-border bg-code-bg p-4 font-mono text-xs leading-relaxed ' +
        (className ?? '')
      }
    >
      <code>
        {lines.length === 0 ? (
          <span className="text-muted-foreground"># (empty)</span>
        ) : (
          lines.map((entry, i) => (
            <div key={`${entry.key}-${i}`}>{entry.line}</div>
          ))
        )}
      </code>
    </pre>
  );
}
