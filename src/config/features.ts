export type FeatureFlags = {
  bugCounter: boolean;
  debugTerminal: boolean;
  sessionTracker: boolean;
  pixelCursor: boolean;
};

export const FEATURE_FLAGS: FeatureFlags = {
  bugCounter: true,
  debugTerminal: true,
  sessionTracker: true,
  pixelCursor: true,
};

export const isFeatureEnabled = (key: keyof FeatureFlags): boolean => FEATURE_FLAGS[key];
