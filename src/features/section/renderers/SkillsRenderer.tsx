import { motion } from 'framer-motion';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { motionPresets } from '@/design-system/motion';
import { SKILL_CATEGORY_ICON, SKILL_CATEGORY_LABEL } from './linkIcons';
import { Database } from 'lucide-react';

type SkillsRendererProps = {
  data: Record<string, unknown>;
  className?: string;
};

/**
 * Renders the Skills section as a responsive grid of category cards.
 * Each card reveals on scroll-in via framer-motion `whileInView`, and the
 * skill chips inside stagger their entrance beneath the card.
 *
 * Falls back to the raw JSON dump aesthetic (Code2-style header) for any
 * data shape that doesn't map cleanly to `{ [categoryKey: string]: string[] }`.
 */
export function SkillsRenderer({ data, className }: SkillsRendererProps) {
  const categories = Object.entries(data).filter(
    ([, value]) => Array.isArray(value) && value.length > 0,
  ) as Array<[string, string[]]>;

  if (categories.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        No skills wired yet. They will appear here once the admin uploads them.
      </p>
    );
  }

  return (
    <motion.ol
      role="list"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={motionPresets.chipStagger}
      className={
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ' + (className ?? '')
      }
    >
      {categories.map(([key, items]) => {
        const Icon = SKILL_CATEGORY_ICON[key] ?? Database;
        const label = SKILL_CATEGORY_LABEL[key] ?? key.replace(/_/g, ' ');
        return (
          <motion.li
            key={key}
            variants={motionPresets.inViewReveal}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <Card className="h-full transition-shadow duration-200 hover:shadow-lg hover:shadow-foreground/10">
              <CardHeader className="gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <CardTitle className="font-display text-lg font-medium tracking-tight">
                    {label}
                  </CardTitle>
                  <span
                    aria-hidden="true"
                    className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {String(items.length).padStart(2, '0')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <motion.ul
                  role="list"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={motionPresets.chipStagger}
                  className="flex flex-wrap gap-1.5"
                >
                  {items.map((skill) => (
                    <motion.li key={skill} variants={motionPresets.chipStaggerChild}>
                      <Badge
                        variant="secondary"
                        className="font-mono text-[11px] font-normal normal-case tracking-normal"
                      >
                        {skill}
                      </Badge>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </Card>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
