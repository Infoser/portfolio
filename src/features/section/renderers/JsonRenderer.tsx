type JsonRendererProps = {
  data: unknown;
  className?: string;
};

const formatJson = (data: unknown): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return '// unserializable value';
  }
};

const renderJsonLine = (line: string) => {
  const colonIdx = line.indexOf(':');
  const hasKey = colonIdx > -1 && line.includes('"');

  if (!hasKey) {
    return (
      <span className="text-muted-foreground">{line || ' '}</span>
    );
  }

  if (/^\s*"/.test(line)) {
    const leadingSpace = line.length - line.trimStart().length;
    const trimmed = line.trimStart();
    const keyEnd = trimmed.indexOf('":');
    const key = trimmed.slice(0, keyEnd + 2);
    const rest = trimmed.slice(key.length);

    return (
      <>
        {' '.repeat(leadingSpace)}
        <span className="text-primary">{key}</span>
        {highlightValue(rest)}
      </>
    );
  }

  return line || ' ';
};

const highlightValue = (value: string) => {
  const trimmed = value.trimStart();
  const leadingSpace = value.length - trimmed.length;

  if (trimmed.startsWith('"')) {
    return (
      <>
        {' '.repeat(leadingSpace)}
        <span className="text-foreground">{trimmed}</span>
      </>
    );
  }
  if (/^(true|false|null)(\s*,?\s*$)/.test(trimmed) || /^-?\d/.test(trimmed)) {
    return (
      <>
        {' '.repeat(leadingSpace)}
        <span className="text-research-foreground">{trimmed}</span>
      </>
    );
  }
  return <span>{value}</span>;
};

export function JsonRenderer({ data, className }: JsonRendererProps) {
  const json = formatJson(data);
  const lines = json.split('\n');

  return (
    <pre
      aria-label="Section content rendered as JSON"
      className={
        'overflow-x-auto rounded-md border border-border bg-code-bg p-4 font-mono text-xs leading-relaxed text-foreground ' +
        (className ?? '')
      }
    >
      <code>
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span
              className="select-none text-right text-muted-foreground/70"
              style={{ minWidth: '2.5rem' }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="flex-1">{renderJsonLine(line)}</span>
          </div>
        ))}
      </code>
    </pre>
  );
}
