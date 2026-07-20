import type { Transition, Variants } from 'framer-motion';

const baseTransition: Transition = {
  duration: 0.22,
  ease: [0.4, 0, 0.2, 1],
};

const makeVariants = (
  initial: Record<string, number>,
  animate: Record<string, number>,
  exit: Record<string, number>,
  transition: Transition = baseTransition,
): Variants => ({
  initial: { ...initial, transition },
  animate: { ...animate, transition },
  exit: { ...exit, transition },
});

export const motionPresets = {
  fade: makeVariants({ opacity: 0 }, { opacity: 1 }, { opacity: 0 }, {
    duration: 0.2,
    ease: 'easeOut',
  }),
  slideIn: makeVariants(
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0 },
    { opacity: 0, y: -8 },
    { duration: 0.25, ease: 'easeOut' },
  ),
  tabSwitch: makeVariants(
    { opacity: 0, y: 6 },
    { opacity: 1, y: 0 },
    { opacity: 0, y: -6 },
    { duration: 0.18, ease: 'easeOut' },
  ),
  scaleIn: makeVariants(
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 1.02 },
    { duration: 0.2, ease: 'easeOut' },
  ),
} as const;
