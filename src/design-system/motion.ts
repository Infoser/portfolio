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
  /**
   * Card reveal as it scrolls into view. Use with `whileInView="show" initial="hidden"`.
   * The `viewport={{ once: true }}` option on the motion element ensures it
   * doesn't re-trigger on every scroll pass.
   */
  inViewReveal: {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  } as Variants,
  /**
   * Container variant that staggers its children's reveals when the container
   * enters the viewport. Pairs with `chipStaggerChild`.
   */
  chipStagger: {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.04, delayChildren: 0.05 },
    },
  } as Variants,
  /**
   * Individual chip in a stagged group. Use as the variants of a child of a
   * motion element with `chipStagger`.
   */
  chipStaggerChild: {
    hidden: { opacity: 0, scale: 0.85, y: 4 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    },
  } as Variants,
} as const;
