import { useState, type FormEvent } from 'react';
import { Button, Input, Textarea, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/design-system';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

// Curated purpose options. Visitors can also pick one and edit, or type
// their own — the field is free-text but seeded with the common reasons so
// the form is fast for the 80% case while still flexible.
const PURPOSE_SUGGESTIONS = [
  'ML/DL internship enquiry',
  'Research collaboration',
  'Project opportunity',
  'Speaking / event invite',
  'Just saying hi',
] as const;

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const PURPOSE_MAX = 120;
const MESSAGE_MAX = 4000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'submitting' | 'success';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  // Honeypot: invisible to humans, filled by bots. Sent as `company`
  // to the endpoint which rejects silently. Aria-hidden + tabIndex=-1 +
  // absolute-positioned off-screen keeps it keyboard-inaccessible too.
  const [company, setCompany] = useState('');

  const valid =
    name.trim().length >= 1 &&
    name.length <= NAME_MAX &&
    EMAIL_RE.test(email) &&
    email.length <= EMAIL_MAX &&
    purpose.trim().length >= 1 &&
    purpose.length <= PURPOSE_MAX &&
    message.trim().length >= 1 &&
    message.length <= MESSAGE_MAX;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    if (!valid) {
      toast.error('Please complete all fields with valid values.');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, purpose, message, company }),
      });
      // 202 = honeypot branch (we still treat it as success from the
      // visitor's POV — bots don't get to learn the form has a trap).
      if (res.status === 202 || res.ok) {
        setStatus('success');
        toast.success('Message sent. Thanks — I will get back to you shortly.');
        setName(''); setEmail(''); setPurpose(''); setMessage(''); setCompany('');
        return;
      }
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      const msg = payload.error ?? 'Could not send your message. Please try again.';
      setStatus('idle');
      toast.error(msg);
    } catch {
      setStatus('idle');
      toast.error('Network error — please check your connection and try again.');
    }
  }

  if (status === 'success') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium tracking-tight">
            Message sent
          </CardTitle>
          <CardDescription className="text-xs">
            Your message is on its way to my inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Thanks for reaching out. I typically reply within 1–2 days at the
            latest. If your matter is time-sensitive, please email me directly
            at <a className="text-primary underline decoration-dotted underline-offset-4" href="mailto:issuatstudy090@gmail.com">issuatstudy090@gmail.com</a>.
          </p>
          <Button variant="outline" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium tracking-tight">
          Send a message
        </CardTitle>
        <CardDescription className="text-xs">
          Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {/* Honeypot: visually hidden, but rendered in the DOM so bots
              that scrape input fields fill it. The endpoint rejects if
              `company` is non-empty. Humans will never see/focus it. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <Field label="Name" required htmlFor="cf-name">
            <Input
              id="cf-name"
              name="name"
              value={name}
              maxLength={NAME_MAX}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={status === 'submitting'}
              placeholder="Your name"
            />
          </Field>

          <Field label="Email" required htmlFor="cf-email">
            <Input
              id="cf-email"
              name="email"
              type="email"
              value={email}
              maxLength={EMAIL_MAX}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={status === 'submitting'}
              placeholder="you@example.com"
            />
          </Field>

          <Field label="Purpose" required htmlFor="cf-purpose">
            <Input
              id="cf-purpose"
              name="purpose"
              list="cf-purpose-suggestions"
              value={purpose}
              maxLength={PURPOSE_MAX}
              onChange={(e) => setPurpose(e.target.value)}
              required
              disabled={status === 'submitting'}
              placeholder="Why are you reaching out?"
            />
            <datalist id="cf-purpose-suggestions">
              {PURPOSE_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>

          <Field label="Message" required htmlFor="cf-message">
            <Textarea
              id="cf-message"
              name="message"
              value={message}
              maxLength={MESSAGE_MAX}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={status === 'submitting'}
              rows={5}
              placeholder="Write your message…"
            />
            <span className="mt-1 text-right font-mono text-[10px] text-muted-foreground/70">
              {message.length}/{MESSAGE_MAX}
            </span>
          </Field>

          <Button
            type="submit"
            disabled={!valid || status === 'submitting'}
            className={cn('gap-2')}
          >
            <Send className="size-4" aria-hidden="true" />
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
