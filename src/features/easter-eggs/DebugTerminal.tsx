import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/design-system';
import { Terminal } from 'lucide-react';
import { isFeatureEnabled } from '@/config/features';
import { cn } from '@/lib/utils';

const TRIGGER = 'debug';
const LINES_MAX = 200;

const FAKE_OUTPUTS: Array<(cmd: string) => string> = [
  () => 'traceback: semantic overflow at line 42',
  () => 'kernel panic: not enough coffee in the buffer',
  () => '> linting reality... 3 unresolved metaphysical warnings',
  () => 'stack trace withheld to protect the innocent',
  () => 'cannot find module: ./sanity — did you mean ./insanity?',
  () => 'segmentation fault (paper jam in the event loop)',
  () => 'npm warn: deprecated existential-themes@0.1.0 — migrate to nihilism@2.x',
  () => '> resolving quantum state of the payload... collapsed into a sensible default',
  () => '404: this output cannot be found in any known reality',
  (cmd) => `${cmd}: command not found — try \`help\` for an hallucinated list`,
];

const HELP_LINES = [
  'available commands (all hallucinated — no real data):',
  '  help      — show this list',
  '  whoami    — output a self-aware quip',
  '  ls /sections — list the 8 sections from the manifest',
  '  exit      — close the terminal',
];

const WHOAMI_LINES = [
  'ishan@portfolio:~$ who am I, really?',
  'the cursor that blinks when you stop moving.',
];

const SECTION_NAMES = ['about', 'experience', 'projects', 'achievements', 'skills', 'education', 'leadership', 'contact'];

type Line = { id: string; text: string; tone: 'in' | 'out' | 'muted' | 'accent' };

const uid = () => Math.random().toString(36).slice(2, 9);

export function DebugTerminal() {
  const enabled = isFeatureEnabled('debugTerminal');
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<Line[]>([
    { id: uid(), text: 'debug terminal v0.0.1 — purely fictional, no real user data is surfaced here.', tone: 'muted' },
    { id: uid(), text: 'type `help` for commands', tone: 'muted' },
  ]);
  const [buffer, setBuffer] = useState<string[]>([]);
  const [bufferIdx, setBufferIdx] = useState(-1);

  const sequenceRef = useRef('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (open && e.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (!open && !isTyping) {
        const key = e.key.length === 1 ? e.key : '';
        if (!key) return;
        sequenceRef.current = (sequenceRef.current + key).toLowerCase().slice(-TRIGGER.length);
        if (sequenceRef.current === TRIGGER) {
          sequenceRef.current = '';
          setOpen(true);
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  if (!enabled) return null;

  const pushLines = (newLines: Array<Omit<Line, 'id'>>) =>
    setLines((prev) => [...prev.slice(-LINES_MAX + newLines.length), ...newLines.map((l) => ({ ...l, id: uid() }))]);

  const handleCommand = (raw: string) => {
    const cmd = raw.trim();
    pushLines([{ text: `$ ${cmd}`, tone: 'in' }]);
    if (!cmd) return;

    setBuffer((b) => [cmd, ...b].slice(0, 20));
    setBufferIdx(-1);

    const lower = cmd.toLowerCase();
    if (lower === 'exit') {
      pushLines([{ text: 'goodbye. the cursor blinks for you.', tone: 'muted' }]);
      setTimeout(() => setOpen(false), 220);
      return;
    }
    if (lower === 'help') {
      pushLines(HELP_LINES.map((text) => ({ text, tone: 'out' })));
      return;
    }
    if (lower === 'whoami') {
      pushLines(WHOAMI_LINES.map((text) => ({ text, tone: 'accent' })));
      return;
    }
    if (lower === 'ls /sections' || lower === 'ls sections') {
      pushLines(SECTION_NAMES.map((text) => ({ text, tone: 'out' })));
      return;
    }
    const output = FAKE_OUTPUTS[Math.floor(Math.random() * FAKE_OUTPUTS.length)](cmd);
    pushLines([{ text: output, tone: 'out' }]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (buffer.length === 0) return;
      const nextIdx = Math.min(bufferIdx + 1, buffer.length - 1);
      setBufferIdx(nextIdx);
      setInput(buffer[nextIdx]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (bufferIdx <= 0) {
        setBufferIdx(-1);
        setInput('');
        return;
      }
      const nextIdx = bufferIdx - 1;
      setBufferIdx(nextIdx);
      setInput(buffer[nextIdx]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          'max-w-2xl gap-0 p-0 font-mono text-xs',
          'border-border bg-code-bg text-code-foreground',
        )}
        aria-describedby={undefined}
      >
        <DialogHeader className="border-b border-border px-3 py-2">
          <DialogTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em]">
            <Terminal className="size-3.5" aria-hidden="true" />
            debug
          </DialogTitle>
          <DialogDescription className="sr-only">
            A purely fictional debug terminal. None of the output references real user data.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="max-h-80 min-h-48 overflow-y-auto px-3 py-3 leading-relaxed"
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={cn(
                'whitespace-pre-wrap break-words',
                line.tone === 'in' && 'text-foreground',
                line.tone === 'out' && 'text-muted-foreground',
                line.tone === 'muted' && 'text-muted-foreground/70 italic',
                line.tone === 'accent' && 'text-primary',
              )}
            >
              {line.text}
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 border-t border-border px-3 py-2">
          <span className="text-primary" aria-hidden="true">$</span>
          <span className="sr-only">Debug terminal input</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="Debug terminal input"
            className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            placeholder="type `help` then Enter"
          />
        </label>
      </DialogContent>
    </Dialog>
  );
}
