export type EyeCursorOptions = {
  idleBlinkDelayMs: number;
  blinkDurationMs: number;
  pupilMaxShift: number;
  velocityDecay: number;
};

export const EYE_CURSOR_DEFAULTS: EyeCursorOptions = {
  idleBlinkDelayMs: 3000,
  blinkDurationMs: 150,
  pupilMaxShift: 1.6,
  velocityDecay: 0.85,
};
