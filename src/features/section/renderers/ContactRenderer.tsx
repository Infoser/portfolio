import { useState, type ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/design-system';
import { motionPresets } from '@/design-system/motion';
import { cn } from '@/lib/utils';
import { ChevronRight, Mail, Phone, Download } from 'lucide-react';
import { SOCIAL_ICON } from './linkIcons';

type ContactRendererProps = {
  data: Record<string, unknown>;
  className?: string;
};

type ContactData = {
  identity?: { name?: string; title?: string };
  email?: string;
  phone?: string;
  links?: Record<string, string>;
  cv?: string;
};

const staggeredChip = {
  collapsed: { opacity: 0, x: -8, scale: 0.8 },
  expanded: { opacity: 1, x: 0, scale: 1 },
};

/** A hover/focus-driven "Connect" button that fans out into a row of
 *  social-icon chips with a staggered framer-motion reveal. Collapses on
 *  blur/hover-out. Inspired by kokonut-ui's social-button pattern. */
function ConnectFanOut({ links }: { links: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const entries = Object.entries(links).filter(([, url]) => typeof url === 'string' && url);
  if (entries.length === 0) return null;

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Button
        type="button"
        variant="outline"
        size="lg"
        aria-expanded={open}
        aria-controls="connect-chips"
        aria-label="Connect — expand social links"
        className={cn(
          'gap-1.5 transition-colors',
          open && 'bg-muted text-foreground',
        )}
      >
        <span className="font-mono text-xs uppercase tracking-[0.18em]">Connect</span>
        <ChevronRight
          aria-hidden="true"
          className={cn('size-4 transition-transform duration-200', open && 'rotate-90')}
        />
      </Button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            id="connect-chips"
            role="list"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              collapsed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
              expanded: { transition: { staggerChildren: 0.05 } },
            }}
            className="ml-2 flex items-center gap-2"
          >
            {entries.map(([kind, url]) => {
              const Icon: ComponentType<{ className?: string }> | undefined = SOCIAL_ICON[kind];
              const label = kind.charAt(0).toUpperCase() + kind.slice(1);
              return (
                <motion.li
                  key={kind}
                  variants={staggeredChip}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Button asChild variant="ghost" size="icon-lg">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} — opens in new tab`}
                      className="hover:bg-muted hover:text-primary"
                    >
                      {Icon ? <Icon className="size-4" /> : null}
                    </a>
                  </Button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A primary CTA button row: Email / Phone / Download CV. */
function ContactActions({ email, phone, cv }: { email?: string; phone?: string; cv?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {email && (
        <Button asChild variant="outline" size="lg" className="justify-start gap-2 font-mono text-xs">
          <a href={`mailto:${email}`} aria-label={`Email ${email}`}>
            <Mail className="size-4" aria-hidden="true" />
            <span className="uppercase tracking-[0.18em]">Email</span>
            <span className="ml-auto normal-case tracking-normal text-muted-foreground">{email}</span>
          </a>
        </Button>
      )}
      {phone && (
        <Button asChild variant="outline" size="lg" className="justify-start gap-2 font-mono text-xs">
          <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} aria-label={`Call ${phone}`}>
            <Phone className="size-4" aria-hidden="true" />
            <span className="uppercase tracking-[0.18em]">Phone</span>
            <span className="ml-auto normal-case tracking-normal text-muted-foreground">{phone}</span>
          </a>
        </Button>
      )}
      {cv && (
        <Button asChild variant="default" size="lg" className="justify-center gap-2 font-mono text-xs">
          <a href={cv} download aria-label="Download CV (PDF)">
            <Download className="size-4" aria-hidden="true" />
            <span className="uppercase tracking-[0.22em]">Download CV</span>
          </a>
        </Button>
      )}
    </div>
  );
}

/** Renders the Contact section as an identity card + a Connect fan-out and
 *  a primary CTA card for email/phone/CV. Animated via framer-motion `whileInView`. */
export function ContactRenderer({ data, className }: ContactRendererProps) {
  const contact = data as ContactData;
  const links = contact.links ?? {};
  const hasActions = Boolean(contact.email || contact.phone || contact.cv);

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={motionPresets.inViewReveal}
      className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}
    >
      {/* Identity card with avatar + connect fan-out */}
      <Card>
        <CardHeader className="gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16" style={{ borderRadius: 'var(--radius-lg)' }}>
              <AvatarImage src="/profile.png" alt={contact.identity?.name ?? 'Profile photo'} />
              <AvatarFallback className="font-mono text-xl uppercase" style={{ borderRadius: 'var(--radius-lg)' }}>
                {(contact.identity?.name ?? '?').slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <CardTitle className="font-display text-xl font-medium tracking-tight">
                {contact.identity?.name ?? 'Ishan Kumar Sahu'}
              </CardTitle>
              {contact.identity?.title && (
                <CardDescription className="text-xs">
                  {contact.identity.title}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Open to ML/DL internships, research collaborations, and ambitious projects.
            Reach out through any channel below.
          </p>
          <ConnectFanOut links={links} />
        </CardContent>
      </Card>

      {/* CTA card with primary actions */}
      {hasActions && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-medium tracking-tight">
              Reach out
            </CardTitle>
            <CardDescription className="text-xs">
              Email · Phone · Download CV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactActions email={contact.email} phone={contact.phone} cv={contact.cv} />
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

/** Curated export so callers can compose pieces if needed. */
export { ConnectFanOut, ContactActions };
